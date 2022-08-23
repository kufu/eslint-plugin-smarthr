const generateTagFormatter = ({ context, EXPECTED_NAMES }) => ({
  ImportDeclaration: (node) => {
    if (node.source.value !== 'styled-components') {
      return
    }

    const invalidNameNode = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== 'styled')

    if (invalidNameNode) {
      context.report({
        node: invalidNameNode,
        messageId: 'format-styled-components',
        data: {
          message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`",
        },
      });
    }
  },
  TaggedTemplateExpression: (node) => {
    const { tag } = node
    const extended = node.parent.id?.name

    if (extended) {
      let base = null

      if (tag.type === 'CallExpression' && tag.callee.name === 'styled') {
        base = tag.arguments[0].name
      } else if (tag?.object?.name === 'styled') {
        base = tag.property.name
      }

      if (base) {
        Object.entries(EXPECTED_NAMES).forEach(([b, e]) => {
          if (base.match(new RegExp(b))) {
            const extendedregex = new RegExp(e)

            if (!extended.match(extendedregex)) {
              context.report({
                node: node.parent,
                messageId: 'format-styled-components',
                data: {
                  message: `${extended}を正規表現 "${extendedregex.toString()}" がmatchする名称に変更してください`,
                },
              });
            }
          }
        })
      }
    }
  },
})

module.exports = { generateTagFormatter }
