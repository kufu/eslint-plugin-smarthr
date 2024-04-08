const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(Input|^input)$': '(Input)$',
  '(Textarea|^textarea)$': '(Textarea)$',
}

const UNEXPECTED_NAMES = EXPECTED_NAMES

const INPUT_COMPONENT_NAMES = new RegExp(`(${Object.keys(EXPECTED_NAMES).join('|')})`)

const SCHEMA = []

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
              message: `input要素にはmaxLength属性を設定しないでください。
pattern属性とtitle属性を組み合わせ、form要素でラップするか、JavaScriptでバリデーションしてください。
              `,
            })
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
