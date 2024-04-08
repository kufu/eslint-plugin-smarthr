const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_LABELED_INPUT_NAMES = {
  'RadioButton$': '(RadioButton)$',
  'RadioButtons$': '(RadioButtons)$',
  'RadioButtonPanel$': '(RadioButtonPanel)$',
  'RadioButtonPanels$': '(RadioButtonPanels)$',
  'Check(B|b)ox$': '(CheckBox)$',
  'Check(B|b)ox(e)?s$': '(CheckBoxes)$',
}
const EXPECTED_INPUT_NAMES = {
  '(I|^i)nput$': '(Input)$',
  'SearchInput$': '(SearchInput)$',
  '(T|^t)extarea$': '(Textarea)$',
  '(S|^s)elect$': '(Select)$',
  'InputFile$': '(InputFile)$',
  'Combo(b|B)ox$': '(ComboBox)$',
  'DatePicker$': '(DatePicker)$',
  ...EXPECTED_LABELED_INPUT_NAMES,
}

const EXPECTED_FORM_CONTROL_NAMES = {
  '(FormGroup)$': '(FormGroup)$',
  '(FormControl)$': '(FormControl)$',
  '((F|^f)ieldset)$': '(Fieldset)$',
}

const EXPECTED_NAMES = {
  ...EXPECTED_INPUT_NAMES,
  ...EXPECTED_FORM_CONTROL_NAMES,
  '(A|^a)rticle$': '(Article)$',
  '(A|^a)side$': '(Aside)$',
  '(N|^n)av$': '(Nav)$',
  '(S|^s)ection$': '(Section)$',
  'Cluster$': '(Cluster)$',
  'Center$': '(Center)$',
  'Reel$': '(Reel)$',
  'Sidebar$': '(Sidebar)$',
  'Stack$': '(Stack)$',
  '(L|^l)abel$': '(Label)$',

}

const UNEXPECTED_NAMES = EXPECTED_NAMES

const FORM_CONTROL_INPUTS_REGEX = new RegExp(`(${Object.keys(EXPECTED_INPUT_NAMES).join('|')})`)
const LABELED_INPUTS_REGEX = new RegExp(`(${Object.keys(EXPECTED_LABELED_INPUT_NAMES).join('|')})`)
const SEARCH_INPUT_REGEX = /SearchInput$/
const INPUT_REGEX = /(i|I)nput$/
const RADIO_BUTTONS_REGEX = /RadioButton(Panel)?(s)?$/
const CHECKBOX_REGEX = /Check(B|b)ox(s|es)?$/
const SELECT_REGEX = /(S|s)elect(s)?$/
const FROM_CONTROLS_REGEX = new RegExp(`(${Object.keys(EXPECTED_FORM_CONTROL_NAMES).join('|')})`)
const FORM_CONTROL_REGEX = /(Form(Control|Group))$/
const FIELDSET_REGEX = /Fieldset$/
const DIALOG_REGEX = /Dialog(WithTrigger)?$/
const SECTIONING_REGEX = /(((A|^a)(rticle|side))|(N|^n)av|(S|^s)ection|^SectioningFragment)$/
const BARE_SECTIONING_TAG_REGEX = /^(article|aside|nav|section)$/
const LAYOUT_COMPONENT_REGEX = /((C(ent|lust)er)|Reel|Sidebar|Stack)$/
const AS_REGEX = /^(as|forwardedAs)$/
const SUFFIX_S_REGEX = /s$/

const IGNORE_INPUT_CHECK_PARENT_TYPE = /^(Program|ExportNamedDeclaration)$/

const findRoleGroup = (a) => a.name?.name === 'role' && a.value.value === 'group'
const findAsSectioning = (a) => a.name?.name.match(AS_REGEX) && a.value.value.match(BARE_SECTIONING_TAG_REGEX)
const findTitle = (i) => i.key.name === 'title'

const SCHEMA = [
  {
    type: 'object',
    properties: {
      additionalInputComponents: { type: 'array', items: { type: 'string' }, default: [] },
      additionalMultiInputComponents: { type: 'array', items: { type: 'string' }, default: [] },
    },
    additionalProperties: false,
  }
]

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const additionalInputComponents = option.additionalInputComponents?.length > 0 ? new RegExp(`(${option.additionalInputComponents.join('|')})`) : null
    const additionalMultiInputComponents = option.additionalMultiInputComponents?.length > 0 ? new RegExp(`(${option.additionalMultiInputComponents.join('|')})`) : null

    const checkAdditionalInputComponents = (name) => additionalInputComponents && name.match(additionalInputComponents)
    const checkAdditionalMultiInputComponents = (name) => additionalMultiInputComponents && name.match(additionalMultiInputComponents)

    let formControls = []
    let checkboxFormControls = []

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name || '';
        const isFormControlInput = nodeName.match(FORM_CONTROL_INPUTS_REGEX)
        const isAdditionalMultiInput = checkAdditionalMultiInputComponents(nodeName)

        if (isFormControlInput || isAdditionalMultiInput || checkAdditionalInputComponents(nodeName)) {
          let isInMap = false

          // HINT: 検索ボックスの場合、UIの関係上labelを設定出来ないことが多い & smarthr-ui/SearchInputはa11y対策してあるため無視
          if (nodeName.match(SEARCH_INPUT_REGEX)) {
            return
          }

          const isPureInput = nodeName.match(INPUT_REGEX)
          let isPseudoLabel = false
          let isTypeRadio = false
          let isTypeCheck = false

          if (isFormControlInput) {
            for (const i of node.attributes) {
              if (i.name) {
                // HINT: idが設定されている場合、htmlForでlabelと紐づく可能性が高いため無視する
                // HINT: titleが設定されている場合、なんの入力要素かはわかるため無視する
                switch (i.name.name) {
                  case 'id':
                  case 'title':
                    isPseudoLabel = true
                    break
                  case 'inputAttributes': {
                    if (!isPseudoLabel && i.value.expression.type === 'ObjectExpression' && i.value.expression.properties.some(findTitle)) {
                      isPseudoLabel = true
                    }
                    break
                  }
                  case 'type':
                    switch (i.value.value) {
                      case 'radio':
                        isTypeRadio = true
                        break
                      case 'checkbox':
                        isTypeCheck = true
                        break
                    }

                    break
                }
              }
            }
          }

          const isPreMultiple = isAdditionalMultiInput || isFormControlInput && nodeName.match(SUFFIX_S_REGEX)
          const isRadio = (isPureInput && isTypeRadio) || nodeName.match(RADIO_BUTTONS_REGEX);
          const isCheckbox = !isRadio && (isPureInput && isTypeCheck || nodeName.match(CHECKBOX_REGEX));

          const wrapComponentName = isRadio ? 'Fieldset' : 'FormControl'
          const search = (n) => {
            switch (n.type) {
              case 'JSXElement': {
                const openingElement = n.openingElement
                const name = openingElement.name.name

                if (name) {
                  if (name.match(FROM_CONTROLS_REGEX)) {
                    const hit = formControls.includes(n)

                    if (!hit) {
                      formControls.push(n)

                      if (isCheckbox) {
                        checkboxFormControls.push(n)
                      }
                    }

                    const isMultiInput = isPreMultiple || hit || isInMap
                    const matcherFormControl = name.match(FORM_CONTROL_REGEX)

                    if (matcherFormControl) {
                      if (isRadio || isCheckbox && (isInMap || hit && checkboxFormControls.includes(n))) {
                        const convertComp = isRadio ? 'smarthr-ui/RadioButton、smarthr-ui/RadioButtonPanel' : 'smarthr-ui/Checkbox'

                        context.report({
                          node: n,
                          message: `${name} が ${nodeName} を含んでいます。smarthr-ui/${matcherFormControl[1]} を smarthr-ui/Fieldset に変更し、正しくグルーピングされるように修正してください。${isRadio ? `
 - Fieldsetで同じname属性のラジオボタン全てを囲むことで正しくグループ化され、適切なタイトル・説明を追加出来ます` : ''}${isPureInput ? `
 - 可能なら${nodeName}は${convertComp}への変更を検討してください。難しい場合は ${nodeName} と結びつくlabel要素が必ず存在するよう、マークアップする必要があることに注意してください。` : ''}`,
                        });
                      } else if (isMultiInput && !openingElement.attributes.find(findRoleGroup)) {
                        context.report({
                          node: n,
                          message: `${name} が複数の入力要素を含んでいます。ラベルと入力要素の紐づけが正しく行われない可能性があるため、以下の方法のいずれかで修正してください。
 - 方法1: 入力要素ごとにラベルを設定できる場合、${name}をsmarthr-ui/Fieldset、もしくはそれを拡張したコンポーネントに変更した上で、入力要素を一つずつsmarthr-ui/FormControlで囲むようにマークアップを変更してください
 - 方法2: 郵便番号や電話番号など、本来一つの概念の入力要素を分割して複数の入力要素にしている場合、一つの入力要素にまとめることを検討してください
   - コピーアンドペーストがしやすくなる、ブラウザの自動補完などがより適切に反映されるなど多大なメリットがあります
 - 方法3: ${name} が smarthr-ui/${matcherFormControl[1]}、もしくはそれを拡張しているコンポーネントではない場合、名称を ${FROM_CONTROLS_REGEX} にマッチしないものに変更してください
 - 方法4: 上記方法のいずれも対応出来ない場合、${name} に 'role="group"' 属性を設定してください`,
                        });
                      }
                    // HINT: 擬似的にラベルが設定されている場合、無視する
                    } else if (!isRadio && !isCheckbox && !isPseudoLabel) {
                      const isSelect = nodeName.match(SELECT_REGEX)

                      context.report({
                        node: n,
                        message: `${name} が ラベルを持たない入力要素(${nodeName})を含んでいます。入力要素が何であるかを正しく伝えるため、以下の方法のいずれかで修正してください。
 - 方法1: ${name} を smarthr-ui/FormControl、もしくはそれを拡張したコンポーネントに変更してください
 - 方法2: ${nodeName} がlabel要素を含むコンポーネントである場合、名称を${FORM_CONTROL_REGEX}にマッチするものに変更してください
   - smarthr-ui/FormControl、smarthr-ui/FormGroup はlabel要素を内包しています
 - 方法3: ${nodeName} がRadioButton、もしくはCheckboxを表すコンポーネントの場合、名称を${LABELED_INPUTS_REGEX}にマッチするものに変更してください
   - smarthr-ui/RadioButton、smarthr-ui/RadioButtonPanel、smarthr-ui/Checkbox はlabel要素を内包しています
 - 方法4: ${name} が smarthr-ui/Fieldset、もしくはそれを拡張しているコンポーネントではない場合、名称を ${FIELDSET_REGEX} にマッチしないものに変更してください
 - 方法5: 別途label要素が存在し、それらと紐づけたい場合はlabel要素のhtmlFor属性、${nodeName}のid属性に同じ文字列を指定してください。この文字列はhtml内で一意である必要があります
 - 方法6: 上記のいずれの方法も適切ではない場合、${nodeName}のtitle属性に "どんな値を${isSelect ? '選択' : '入力'}すれば良いのか" の説明を設定してください
   - 例: <${nodeName} title="${isSelect ? '検索対象を選択してください' : '姓を全角カタカナのみで入力してください'}" />`,
                      });
                    }

                    return
                  } else {
                    const isSection = name.match(SECTIONING_REGEX)
                    const layoutSectionAttribute = !isSection && name.match(LAYOUT_COMPONENT_REGEX) && openingElement.attributes.find(findAsSectioning)

                    if (isSection || layoutSectionAttribute) {
                      // HINT: smarthr-ui/CheckBoxはlabelを単独で持つため、FormControl系でラップをする必要はない
                      // HINT: 擬似的にラベルが設定されている場合、無視する
                      if (!isCheckbox && !isPseudoLabel) {
                        const actualName = isSection ? name : `<${name} ${layoutSectionAttribute.name.name}="${layoutSectionAttribute.value.value}">`
                        const isSelect = !isRadio && nodeName.match(SELECT_REGEX)

                        context.report({
                          node,
                          message: `${nodeName}は${actualName}より先に、smarthr-ui/${wrapComponentName}が入力要素を囲むようマークアップを以下のいずれかの方法で変更してください。
 - 方法1: ${actualName} を${wrapComponentName}、もしくはそれを拡張したコンポーネントに変更してください
   - ${actualName} 内のHeading要素は${wrapComponentName}のtitle属性に変更してください
 - 方法2: ${actualName} と ${nodeName} の間に ${wrapComponentName} が存在するようにマークアップを変更してください${isRadio ? '' : `
 - 方法3: 別途label要素が存在し、それらと紐づけたい場合はlabel要素のhtmlFor属性、${nodeName}のid属性に同じ文字列を指定してください。この文字列はhtml内で一意である必要があります
 - 方法4: 上記のいずれの方法も適切ではない場合、${nodeName}のtitle属性に "どんな値を${isSelect ? '選択' : '入力'}すれば良いのか" の説明を設定してください
   - 例: <${nodeName} title="${isSelect ? '検索対象を選択してください' : '姓を全角カタカナのみで入力してください'}" />`}`,
                        });
                      }

                      return
                    }
                  }
                }

                break
              }
              case 'VariableDeclarator': {
                if (n.parent.parent?.type && n.parent.parent.type.match(IGNORE_INPUT_CHECK_PARENT_TYPE)) {
                  const name = n.id.name

                  // 入力要素系コンポーネントの拡張なので対象外
                  if (name.match(FORM_CONTROL_INPUTS_REGEX) || checkAdditionalMultiInputComponents(name) || checkAdditionalInputComponents(name)) {
                    return
                  }
                }

                break
              }
              case 'FunctionDeclaration': {
                if (n.parent.type.match(IGNORE_INPUT_CHECK_PARENT_TYPE)) {
                  const name = n.id.name

                  // 入力要素系コンポーネントの拡張なので対象外
                  if (name.match(FORM_CONTROL_INPUTS_REGEX) || checkAdditionalMultiInputComponents(name) || checkAdditionalInputComponents(name)) {
                    return
                  }
                }
              }
              case 'Program': {
                // HINT: smarthr-ui/CheckBoxはlabelを単独で持つため、FormControl系でラップをする必要はない
                // HINT: 擬似的にラベルが設定されている場合、無視する
                if (!isCheckbox && !isPseudoLabel) {
                  const isSelect = !isRadio && nodeName.match(SELECT_REGEX)

                  context.report({
                    node,
                    message: `${nodeName} を、smarthr-ui/${wrapComponentName} もしくはそれを拡張したコンポーネントが囲むようマークアップを変更してください。
 - ${wrapComponentName}で入力要素を囲むことでラベルと入力要素が適切に紐づき、操作性が高まります${isRadio ? `
 - FieldsetでRadioButtonを囲むことでグループ化された入力要素に対して適切なタイトル・説明を追加出来ます` : ``}
 - ${nodeName}が入力要素とラベル・タイトル・説明など含む概念を表示するコンポーネントの場合、コンポーネント名を${FROM_CONTROLS_REGEX}とマッチするように修正してください
 - ${nodeName}が入力要素自体を表現するコンポーネントの一部である場合、ルートとなるコンポーネントの名称を${FORM_CONTROL_INPUTS_REGEX}とマッチするように修正してください${isRadio ? '' : `
 - 上記のいずれの方法も適切ではない場合、${nodeName}のtitle属性に "どんな値を${isSelect ? '選択' : '入力'}すれば良いのか" の説明を設定してください
   - 例: <${nodeName} title="${isSelect ? '検索対象を選択してください' : '姓を全角カタカナのみで入力してください'}" />`}`,
                  });
                }

                return
              }
              case 'CallExpression':
                if (n.callee.property?.name === 'map') {
                  isInMap = true
                }

                break
            }

            return search(n.parent)
          }

          return search(node.parent.parent)
        }

        const formControlMatcher = nodeName.match(FROM_CONTROLS_REGEX)

        if (formControlMatcher) {
          const isRoleGrouop = node.attributes.find(findRoleGroup)

          if (!nodeName.match(FORM_CONTROL_REGEX) && isRoleGrouop) {
            const component = formControlMatcher[1]
            const actualComponent = component[0].match(/[a-z]/) ? component : `smarthr-ui/${component}`

            const message = `${nodeName}に 'role="group" が設定されています。${actualComponent} をつかってマークアップする場合、'role="group"' は不要です
 - ${nodeName} が ${actualComponent}、もしくはそれを拡張しているコンポーネントではない場合、名称を ${FROM_CONTROLS_REGEX} にマッチしないものに変更してください`
            context.report({
              node,
              message,
            });

            return
          }

          const searchParent = (n) => {
            switch (n.type) {
              case 'JSXElement': {
                const name = n.openingElement.name.name || ''

                // Fieldset > Dialog > Fieldset のようにDialogを挟んだFormControl系のネストは許容する(Portalで実際にはネストしていないため)
                if (name.match(DIALOG_REGEX)) {
                  return
                }

                const matcher = name.match(FROM_CONTROLS_REGEX)
                if (matcher) {
                  // FormControl > FormControl や FormControl > Fieldset のように複数のFormControl系コンポーネントがネストしてしまっているためエラーにする
                  // Fieldset > Fieldset や Fieldset > FormControl のようにFieldsetが親の場合は許容する
                  if (name.match(FORM_CONTROL_REGEX)) {
                    context.report({
                      node: n,
                      message: `${name} が、${nodeName} を子要素として持っており、マークアップとして正しくない状態になっています。以下のいずれかの方法で修正を試みてください。
 - 方法1: 親要素である${name}をsmarthr-ui/${matcher[1]}、もしくはそれを拡張していないコンポーネントでマークアップしてください
   - ${matcher[1]}ではなく、smarthr-ui/Fieldset、もしくはsmarthr-ui/Section + smarthr-ui/Heading などでのマークアップを検討してください
 - 方法2: 親要素である${name}がsmarthr-ui/${matcher[1]}を拡張したコンポーネントではない場合、コンポーネント名を${FORM_CONTROL_REGEX}と一致しない名称に変更してください`,
                    });
                  }

                  return
                }

                break
              }
              case 'Program': {
                return
              }
            }

            return searchParent(n.parent)
          }

          searchParent(node.parent.parent)

          if (!node.selfClosing && nodeName.match(FORM_CONTROL_REGEX) && isRoleGrouop) {
            const searchChildren = (n, count = 0) => {
              switch (n.type) {
                case 'BinaryExpression':
                case 'Identifier':
                case 'JSXEmptyExpression':
                case 'JSXText':
                case 'Literal':
                case 'VariableDeclaration':
                  // これ以上childrenが存在しないため終了
                  return count
                case 'JSXAttribute':
                  return n.value ? searchChildren(n.value, count) : count
                case 'LogicalExpression':
                  return searchChildren(n.right, count)
                case 'ArrowFunctionExpression':
                  return searchChildren(n.body, count)
                case 'MemberExpression':
                  return searchChildren(n.property, count)
                case 'ReturnStatement':
                case 'UnaryExpression':
                  return searchChildren(n.argument, count)
                case 'ChainExpression':
                case 'JSXExpressionContainer':
                  return searchChildren(n.expression, count)
                case 'BlockStatement': {
                  return forInSearchChildren(n.body, count)
                }
                case 'ConditionalExpression': {
                  const conCount = searchChildren(n.consequent, count)

                  if (conCount > 1) {
                    return conCount
                  }

                  const altCount = searchChildren(n.alternate, count)

                  return conCount > altCount ? conCount : altCount
                }
                case 'CallExpression': {
                  const nextCount = forInSearchChildren(n.arguments, count)

                  if (nextCount > count && n.callee.property?.name === 'map') {
                    return Infinity
                  }

                  return nextCount
                }
                case 'JSXFragment':
                  break
                case 'JSXElement': {
                  const name = n.openingElement.name.name || ''

                  if (name.match(FIELDSET_REGEX) || checkAdditionalMultiInputComponents(name)) {
                    // 複数inputが存在する可能性のあるコンポーネントなので無限カウントとする
                    return Infinity
                  }


                  let nextCount = forInSearchChildren(n.openingElement.attributes, count)

                  if (nextCount > 1) {
                    return nextCount
                  }

                  if (
                    name.match(FORM_CONTROL_INPUTS_REGEX) ||
                    name.match(FORM_CONTROL_REGEX) ||
                    checkAdditionalInputComponents(name)
                  ) {
                    nextCount = nextCount + 1
                  }

                  if (nextCount > count) {
                    return nextCount
                  }

                  break
                }
              }

              return n.children ? forInSearchChildren(n.children, count) : count
            }

            const forInSearchChildren = (ary, initCount) => {
              let r = initCount

              for (const i in ary) {
                r += searchChildren(ary[i])

                if (r > 1) {
                  break
                }
              }

              return r
            }

            const result = forInSearchChildren(node.parent.children, 0)

            if (result < 2) {
              context.report({
                node,
                message: `${nodeName}内に入力要素が2個以上存在しないため、'role="group"'を削除してください。'role="group"'は複数の入力要素を一つのグループとして扱うための属性です。
 - ${nodeName}内に2つ以上の入力要素が存在する場合、入力要素を含むコンポーネント名全てを${FORM_CONTROL_INPUTS_REGEX}、もしくは${FROM_CONTROLS_REGEX}にマッチする名称に変更してください`,
              });
            }
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
