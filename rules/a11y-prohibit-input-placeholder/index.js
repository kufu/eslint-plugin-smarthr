const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(i|I)nput$': 'Input$',
  '(t|T)extarea$': 'Textarea$',
  'FieldSet$': 'FieldSet$',
  'ComboBox$': 'ComboBox$',
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

        const match = node.name.name.match(/((i|I)nput|(t|T)extarea|FieldSet|ComboBox)$/)

        if (!match) {
          return
        }

        const placeholder = node.attributes.find((a) => a.name?.name === 'placeholder')

        if (placeholder) {
          context.report({
              node: placeholder,
              messageId: 'a11y-prohibit-input-placeholder',
              data: {
                message: `${node.name.name} にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。検索ボックス等、ヒント用要素の領域が確保できない場合のみ、Tooltipの利用を検討してください (例: '<><Input /><Hint>ヒント</Hint></>', '<Tooltip message="ヒント"><Textarea/></Tooltip>')`,
              },
            })
        }
      },
    }
  },
}
module.exports.schema = []
