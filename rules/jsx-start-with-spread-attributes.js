module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'jsx-start-with-spread-attributes': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      JSXSpreadAttribute: (node) => {
        let hit = false
        const beforeAttributes = node.parent.attributes.reduce((prev, a) => {
          if (!hit) {
            prev.push(a)
            hit = a === node
          }

          return prev
        }, [])
        const types = beforeAttributes.map((a) => a.type === 'JSXSpreadAttribute' ? 0 : 1)
        const sortedTypes = [...types].sort()

        if (types.join() !== sortedTypes.join()) {
          context.report({
            node,
            messageId: 'jsx-start-with-spread-attributes',
            data: {
              message: `"${sourceCode.getText(node)}" は他の属性より先に記述してください`,
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
