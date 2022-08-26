const getExtendedComponentName = (node) => {
  if (!node.parent) {
    return null
  }

  return node.parent.id?.name || getExtendedComponentName(node.parent)
}
const getBaseComponentName = (node) => {
  if (!node) {
    return null
  }

  if (node.type === 'CallExpression') {
    if (node.callee.name === 'styled') {
      return node.arguments[0].name
    }
    if (node.callee.object?.name === 'styled') {
      return node.callee.property.name
    }
  }

  if (node?.object?.name === 'styled') {
    return node.property.name
  }

  return getBaseComponentName(node.parent)
}

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
    const extended = getExtendedComponentName(node)

    if (extended) {
      const base = getBaseComponentName(node.tag)

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
