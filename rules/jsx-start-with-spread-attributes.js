module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'jsx-start-with-spread-attributes': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXSpreadAttribute: (node) => {
        // HINT: 0: 計算中 1: 見つからなかった 2: 見つかった 
        const hit = node.parent.attributes.reduce((h, a) => {
          if (h === 0) {
            if (a === node) {
              return 1
            }

            return a.type !== 'JSXSpreadAttribute' ? 2 : 0
          }

          return h
        }, 0)

        if (hit === 2) {
          context.report({
            node,
            messageId: 'jsx-start-with-spread-attributes',
            data: {
              message: `"${context.getSourceCode().getText(node)}" は他の属性より先に記述してください`,
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
