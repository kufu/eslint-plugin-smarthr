const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(i|I)nput$': 'Input$',
  'SearchInput$': 'SearchInput$',
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
        const name = node.name.name

        if (!name) {
          return
        }

        if (!name.match(/((i|I)nput|(t|T)extarea|FieldSet|ComboBox)$/)) {
          return
        }

        const placeholder = node.attributes.find((a) => a.name?.name === 'placeholder')

        if (placeholder) {
          if (name.match(/SearchInput$/)) {
            const tooltipMessage = node.attributes.find((a) => a.name?.name === 'tooltipMessage')

            if (!tooltipMessage) {
              context.report({
                node: placeholder,
                messageId: 'a11y-prohibit-input-placeholder',
                data: {
                  message: `${name} にはplaceholder属性を単独で利用せず、tooltipMessageオプションのみ、もしくはplaceholderとtooltipMessageの併用を検討してください。 (例: '<${name} tooltipMessage="ヒント" />', '<${name} tooltipMessage={hint} placeholder={hint} />')`,
                },
              })
            }
          } else {
            context.report({
              node: placeholder,
              messageId: 'a11y-prohibit-input-placeholder',
              data: {
                message: `${name} にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><${name} /><Hint>ヒント</Hint></div>')`,
              },
            })
          }
        }
      },
    }
  },
}
module.exports.schema = []
