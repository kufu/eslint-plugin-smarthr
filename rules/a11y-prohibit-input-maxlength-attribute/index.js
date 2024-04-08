const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(Input|^input)$': '(Input)$',
  '(Textarea|^textarea)$': '(Textarea)$',
}

const UNEXPECTED_NAMES = EXPECTED_NAMES

const INPUT_COMPONENT_NAMES = new RegExp(`(${Object.keys(EXPECTED_NAMES).join('|')})`)

const SCHEMA = []

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const name = node.name?.name
        if (name && INPUT_COMPONENT_NAMES.test(name)) {
          const attributes = node.attributes
          const maxLengthAttr = attributes.find(a => a.name?.name === 'maxLength')
          if (maxLengthAttr) {
            context.report({
              node,
              message: `input要素及びtextarea要素にmaxLength属性を設定しないでください。
- maxLength属性がついた要素に、テキストをペーストすると、maxLength属性の値を超えた範囲が意図せず切り捨てられてしまいます。
- 以下のいずれかの方法で修正をおこなってください
  - 方法1: pattern属性とtitle属性を組み合わせ、form要素でラップする
  - 方法2: JavaScriptを用いたバリデーションを実装する`,
            })
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA