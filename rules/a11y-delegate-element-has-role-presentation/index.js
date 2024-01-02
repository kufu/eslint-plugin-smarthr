const { generateTagFormatter } = require('../../libs/format_styled_components');

const EXPECTED_NAMES = {
  '(i|I)nput$': 'Input$',
  '(t|T)extarea$': 'Textarea$',
  '(s|S)elect$': 'Select$',
  'InputFile$': 'InputFile$',
  'RadioButtonPanel$': 'RadioButtonPanel$',
  'Check(b|B)ox$': 'CheckBox$',
  'Combo(b|B)ox$': 'ComboBox$',
  'DatePicker$': 'DatePicker$',
  'DropZone$': 'DropZone$',
  'Switch$': 'Switch$',
  'SegmentedControl$': 'SegmentedControl$',
  'RightFixedNote$': 'RightFixedNote$',
  'FieldSet$': 'FieldSet$',
  '(b|B)utton$': 'Button$',
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  'TabItem$': 'TabItem$',
  '^a$': '(Anchor|Link)$',

  '(f|F)orm$': 'Form$',
  'ActionDialogWithTrigger$': 'ActionDialogWithTrigger$',
  'RemoteDialogTrigger$': 'RemoteDialogTrigger$',
  'RemoteTrigger(.+)Dialog$': 'RemoteTrigger(.+)Dialog$',
  'FormDialog$': 'FormDialog$',
  'Pagination$': 'Pagination$',
  'SideNav$': 'SideNav$',
  'AccordionPanel$': 'AccordionPanel$',
}

const UNEXPECTED_NAMES = {
  '(B|^b)utton$': '(Button)$',
  '(Anchor|^a)$': '(Anchor)$',
  '(Link|^a)$': '(Link)$',
}

const INTERACTIVE_COMPONENT_NAMES = Object.keys(EXPECTED_NAMES).join('|')
const INTERACTIVE_ON_REGEX = /^on(Change|Input|Focus|Blur|(Double)?Click|Key(Down|Up|Press)|Mouse(Enter|Over|Down|Up|Leave)|Select|Submit)$/
const MEANED_ROLE_REGEX = /^(combobox|group|slider|toolbar)$/
const INTERACTIVE_NODE_TYPE_REGEX = /^(JSXElement|JSXExpressionContainer|ConditionalExpression)$/

const messageNonInteractiveEventHandler = (nodeName, interactiveComponentRegex, onAttrs) => {
  const onAttrsText = onAttrs.join(', ')

  return `${nodeName} に${onAttrsText}を設定するとブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1:  ${nodeName}がinput、buttonやaなどのインタラクティブな要素の場合、コンポーネント名の末尾をインタラクティブなコンポーネントであることがわかる名称に変更してください
   - "${interactiveComponentRegex}" の正規表現にmatchするコンポーネントに差し替える、もしくは名称を変更してください
 - 方法2: ${onAttrsText} がコンポーネント内の特定のインタラクティブな要素に設定される場合、名称を具体的なものに変更してください
   - 属性名を"${INTERACTIVE_ON_REGEX}"に一致しないものに変更してください
   - 例: 対象コンポーネント内に '追加ボタン' が存在する場合、'onClick' という属性名を 'onClickAddButton' に変更する
 - 方法3: インタラクティブな親要素、もしくは子要素が存在する場合、直接${onAttrsText}を設定することを検討してください
 - 方法4: インタラクティブな親要素、もしくは子要素が存在しない場合、インタラクティブな要素を必ず持つようにマークアップを修正後、${onAttrsText}の設定要素を検討してください
 - 方法5: インタラクティブな子要素から発生したイベントをキャッチすることが目的で${onAttrsText}を設定している場合、'role="presentation"' を設定してください
   - 'role="presentation"' を設定した要素はマークアップとしての意味がなくなるため、div・span などマークアップとしての意味を持たない要素に設定してください
   - 'role="presentation"' を設定する適切な要素が存在しない場合、div、またはspanでイベントが発生する要素を囲んだ上でrole属性を設定してください`
}
const messageRolePresentationNotHasInteractive = (nodeName, interactiveComponentRegex, onAttrs) => `${nodeName}に 'role="presentation"' が設定されているにも関わらず、子要素にinput、buttonやaなどのインタラクティブな要素が見つからないため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 子要素にインタラクティブな要素が存在するにも関わらずこのエラーが表示されている場合、子要素の名称を変更してください
   - "${interactiveComponentRegex}" の正規表現にmatchするよう、インタラクティブな子要素全てを差し替える、もしくは名称を変更してください
 - 方法2: ${nodeName}自体がインタラクティブな要素の場合、'role="presentation"'を削除した上で名称を変更してください
   - "${interactiveComponentRegex}" の正規表現にmatchするよう、${nodeName}の名称を変更してください
 - 方法3: 子要素にインタラクティブな要素が存在し、${onAttrs.join(', ')}全属性をそれらの要素に移動させられる場合、'role="presentation"'を消した上で実施してください`
const messageInteractiveHasRolePresentation = (nodeName, interactiveComponentRegex) => `${nodeName}はinput、buttonやaなどのインタラクティブな要素にもかかわらず 'role="presentation"' が設定されているため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 'role="presentation"' を削除してください
 - 方法2: ${nodeName}の名称を "${interactiveComponentRegex}" とマッチしない名称に変更してください`

const SCHEMA = [
  {
    type: 'object',
    properties: {
      additionalInteractiveComponentRegex: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
  }
]

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    const options = context.options[0]
    const interactiveComponentRegex = new RegExp(`(${INTERACTIVE_COMPONENT_NAMES}${options?.additionalInteractiveComponentRegex ? `|${options.additionalInteractiveComponentRegex.join('|')}` : ''})`)
    const findInteractiveNode = (ec) => ec && ec.type.match(INTERACTIVE_NODE_TYPE_REGEX) && isHasInteractive(ec)
    const isHasInteractive = (c) => {
      switch (c.type) {
        case 'JSXElement': {
          const name = c.openingElement.name.name

          if (name && name.match(interactiveComponentRegex)) {
            return true
          } else if (c.children.length > 0) {
            return !!c.children.find(isHasInteractive)
          }
        }
        case 'JSXExpressionContainer':
        case 'ConditionalExpression': {
          let e = c

          if (c.expression) {
            e = c.expression
          }

          return !![e.right, e.consequent, e.alternate].find(findInteractiveNode)
        }
      }

      return false
    }

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name || '';

        let onAttrs = []
        let isMeanedRole = false
        let isRolePresentation = false

        node.attributes.forEach((a) => {
          const aName = a.name?.name || ''

          if (aName.match(INTERACTIVE_ON_REGEX)) {
            onAttrs.push(aName)
          } else if (aName === 'role') {
            const v = a.value?.value || ''

            if (v === 'presentation') {
              isMeanedRole = isRolePresentation = true
            } else if (v.match(MEANED_ROLE_REGEX)) {
              isMeanedRole = true
            }
          }
        })

        if (nodeName.match(interactiveComponentRegex)) {
          if (isRolePresentation) {
            context.report({
              node,
              message: messageInteractiveHasRolePresentation(nodeName, interactiveComponentRegex)
            })
          }
        } else if (onAttrs.length > 0) {
          // HINT: role="presentation"以外で意味があるroleが設定されている場合はエラーにしない
          // 基本的にsmarthr-uiでroleの設定などは巻き取る &&　そもそもroleを設定するよりタグを適切にマークアップすることが優先されるため
          // エラーなどには表示しない
          if (!isMeanedRole) {
            context.report({
              node,
              message: messageNonInteractiveEventHandler(nodeName, interactiveComponentRegex, onAttrs),
            });
          } else if (!node.parent.children.find(isHasInteractive)) {
            context.report({
              node,
              message: messageRolePresentationNotHasInteractive(nodeName, interactiveComponentRegex, onAttrs)
            })
          }
        }
      },
    };
  },
};
module.exports.schema = SCHEMA;
