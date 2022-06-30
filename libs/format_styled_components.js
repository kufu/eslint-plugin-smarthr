const generateTagFormatter = ({ context, EXPECTED_NAMES }) => ({
  ImportDeclaration: (node) => {
    if (node.source.value !== 'styled-components') {
      return
    }

    const invalidNameNode = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== 'styled')

    if (invalidNameNode) {
      context.report({
        node: invalidNameNode,
        messageId: 'a11y-clickable-element-has-text',
        data: {
          message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`",
        },
      });
    }
  },
  TaggedTemplateExpression: (node) => {
    const { tag } = node
    const base = (() => {
      if (tag.type === 'CallExpression' && tag.callee.name === 'styled') {
        return tag.arguments[0].name
      }

      if (tag?.object?.name === 'styled') {
        return tag.property.name
      }

      return null
    })()

    if (!base) {
      return
    }

    const extended = node.parent.id.name

    Object.entries(EXPECTED_NAMES).forEach(([b, e]) => {
      if (base.match(new RegExp(b))) {
        const extendedregex = new RegExp(e)

        if (!extended.match(extendedregex)) {
          context.report({
            node: node.parent,
            messageId: 'a11y-clickable-element-has-text',
            data: {
              message: `${extended}を正規表現 "${extendedregex.toString()}" がmatchする名称に変更してください`,
            },
          });
        }
      }
    })
  },
})

module.exports = { generateTagFormatter }
