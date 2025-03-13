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
        const tagName = getTagName(node)
        if (node.name.type === 'JSXIdentifier' && INPUT_COMPONENT_NAMES.test(tagName)) {
          const checkHasMaxLength = (attr) => attr.name?.name === 'maxLength'
          const maxLengthAttr = node.attributes.find(checkHasMaxLength)
          if (maxLengthAttr) {
            context.report({
              node,
              message: `${tagName}にmaxLength属性を設定しないでください。
- maxLength属性がついた要素に、テキストをペーストすると、maxLength属性の値を超えた範囲が意図せず切り捨てられてしまう場合があります
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
