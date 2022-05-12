const filterFalsyJSXText = (cs) => cs.filter((c) => (
  !(c.type === 'JSXText' && c.value.match(/^\s*\n+\s*$/))
))

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'a11y-anchor-has-text': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement: (node) => {
        if (!node.name.name || !node.name.name.match(/^(a|(.*?)Anchor(Button)?|(.*?)Link)$/)) {
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

        const child = filterFalsyJSXText(node.parent.children).find(recursiveSearch)

        if (!child) {
          context.report({
            node,
            messageId: 'a11y-anchor-has-text',
            data: {
              message: 'リンク要素にはテキストを設定してください。リンク要素内にアイコン、画像を設置する場合はvisuallyHiddenText、altなどの代替テキスト用属性を指定してください',
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
