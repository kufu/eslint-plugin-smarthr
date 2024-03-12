const { generateTagFormatter } = require('../../libs/format_styled_components')

const FIELDSET_EXPECTED_NAMES = {
  '((F|^f)ieldset)$': '(Fieldset)$',
  '(Fieldsets)$': '(Fieldsets)$',
}
const FORM_CONTROL_EXPECTED_NAMES = {
  ...FIELDSET_EXPECTED_NAMES,
  '(FormGroup)$': '(FormGroup)$',
  '(FormControl)$': '(FormControl)$',
  '(FormControls)$': '(FormControls)$',
}
const FORM_EXPECTED_NAMES = {
  '((F|^f)orm)$': '(Form)$',
  '(FormDialog)$': '(FormDialog)$',
  'RemoteTrigger(.*)FormDialog$': 'RemoteTrigger(.*)FormDialog$',
}
const EXPECTED_NAMES = {
  ...FORM_CONTROL_EXPECTED_NAMES,
  ...FORM_EXPECTED_NAMES,
}
const UNEXPECTED_NAMES = EXPECTED_NAMES

const targetRegex = new RegExp(`(${Object.keys(FORM_CONTROL_EXPECTED_NAMES).join('|')})`)
const wrapperRegex = new RegExp(`(${Object.keys(EXPECTED_NAMES).join('|')})`)
const ignoreCheckParentTypeRegex = /^(Program|ExportNamedDeclaration)$/
const messageFieldset = `(${Object.values(FORM_CONTROL_EXPECTED_NAMES).join('|')})`
const declaratorTargetRegex = new RegExp(messageFieldset)
const asRegex = /^(as|forwardedAs)$/
const bareTagRegex = /^(form|fieldset)$/

const includeAsAttrFormOrFieldset = (a) => a.name?.name.match(asRegex) && a.value.value.match(bareTagRegex)

const searchBubbleUp = (node) => {
  switch (node.type) {
    case 'Program':
      // rootまで検索した場合は確定でエラーにする
      return null
    case 'JSXElement':
      // formかFieldsetでラップされていればOK
      if (node.openingElement.name.name && (wrapperRegex.test(node.openingElement.name.name) || node.openingElement.attributes.some(includeAsAttrFormOrFieldset))) {
        return node
      }
      break
    case 'VariableDeclarator':
      // FormControl系コンポーネントの拡張の場合は対象外
      if (ignoreCheckParentTypeRegex.test(node.parent.parent?.type) && declaratorTargetRegex.test(node.id.name)) {
        return node
      }

      break
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
      // FormControl系コンポーネントの拡張の場合は対象外
      if (ignoreCheckParentTypeRegex.test(node.parent.type) && declaratorTargetRegex.test(node.id.name)) {
        return node
      }

      break
  }

  return searchBubbleUp(node.parent)
}

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const elementName = node.name.name

        if (elementName && targetRegex.test(elementName)) {
          const result = searchBubbleUp(node.parent.parent)

          if (!result) {
            context.report({
              node,
              message: `${elementName}をform要素で囲むようにマークアップしてください。
 - form要素で囲むことでスクリーンリーダーに入力フォームであることが正しく伝わる、入力要素にfocusした状態でEnterを押せばsubmitできる、inputのpattern属性を利用できるなどのメリットがあります
 - 以下のいずれかの方法で修正をおこなってください
   - 方法1: form要素で ${elementName} を囲んでください。smarthr-ui/ActionDialog、もしくはsmarthr-ui/RemoteTriggerActionDialogを利用している場合、smarthr-ui/FormDialog、smarthr-ui/RemoteTriggerFormDialogに置き換えてください
   - 方法2: ${elementName} がコンポーネント内の一要素であり、かつその親コンポーネントがFormControl、もしくはFieldsetを表現するものである場合、親コンポーネント名を "${messageFieldset}" とマッチするものに変更してください`,
            })
          }
        }
      },
    }
  },
}
module.exports.schema = []
