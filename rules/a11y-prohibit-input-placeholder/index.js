const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(i|I)nput$': 'Input$',
  '(t|T)extarea$': 'Textarea$',
}

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'format-styled-components': '{{ message }}',
      'a11y-prohibit-input-placeholder': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        if (!node.name.name) {
          return
        }

        const match = node.name.name.match(/((i|I)nput|(t|T)extarea)$/)

        if (!match) {
          return
        }

        const placeholder = node.attributes.find((a) => a.name?.name === 'placeholder')

        if (placeholder) {
          context.report({
              node: placeholder,
              messageId: 'a11y-prohibit-input-placeholder',
              data: {
                message: 'input, textarea要素のplaceholder属性は設定せず、smarthr-ui/Tooltip や別途ヒント用要素の利用を検討してください (例: `<><Input /><Hint>ヒント</Hint></>`, `<Tooltip message="ヒント"><Textarea/></Tooltip>`)',
              },
            })
        }
      },
    }
  },
}
module.exports.schema = []
