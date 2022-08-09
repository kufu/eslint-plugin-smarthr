const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(b|B)utton$': 'Button$',
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  '^a$': '(Anchor|Link)$',
}

const filterFalsyJSXText = (cs) => cs.filter((c) => (
  !(c.type === 'JSXText' && c.value.match(/^\s*\n+\s*$/))
))

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'format-styled-components': '{{ message }}',
      'a11y-clickable-element-has-text': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXElement: (parentNode) => {
        // HINT: 閉じタグが存在しない === テキストノードが存在しない
        if (!parentNode.closingElement) {
          return
        }

        const node = parentNode.openingElement

        if (!node.name.name || !node.name.name.match(/^(a|(.*?)Anchor(Button)?|(.*?)Link|(b|B)utton)$/)) {
          return
        }

        const recursiveSearch = (c) => {
          if (['JSXText', 'JSXExpressionContainer'].includes(c.type)) {
            return true
          }

          if (c.type === 'JSXElement') {
            if (c.openingElement.attributes.some((a) => (['visuallyHiddenText', 'alt'].includes(a.name.name) && !!a.value.value))) {
              return true
            }

            if (c.children && filterFalsyJSXText(c.children).some(recursiveSearch)) {
              return true
            }
          }

          return false
        }

        const child = filterFalsyJSXText(parentNode.children).find(recursiveSearch)

        if (!child) {
          context.report({
            node,
            messageId: 'a11y-clickable-element-has-text',
            data: {
              message: 'a, button要素にはテキストを設定してください。要素内にアイコン、画像のみを設置する場合はSmartHR UIのvisuallyHiddenText、通常のHTML要素にはaltなどの代替テキスト用属性を指定してください',
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
