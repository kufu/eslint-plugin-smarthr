const STYLED_COMPONENTS_METHOD = 'styled'
const STYLED_COMPONENTS = `${STYLED_COMPONENTS_METHOD}-components`

const findInvalidImportNameNode = (s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== STYLED_COMPONENTS_METHOD

const generateTagFormatter = ({ context, EXPECTED_NAMES }) => {
  const entriesesTagNames = Object.entries(EXPECTED_NAMES).map(([b, e]) => [ new RegExp(b), new RegExp(e) ])

  return {
    ImportDeclaration: (node) => {
      if (node.source.value !== STYLED_COMPONENTS) {
        return
      }

      const invalidNameNode = node.specifiers.find(findInvalidImportNameNode)

      if (invalidNameNode) {
        context.report({
          node: invalidNameNode,
          message: `${STYLED_COMPONENTS} をimportする際は、名称が"${STYLED_COMPONENTS_METHOD}" となるようにしてください。例: "import ${STYLED_COMPONENTS_METHOD} from '${STYLED_COMPONENTS}'"`,
        });
      }
    },
    VariableDeclarator: (node) => {
      if (!node.init) {
        return
      }

      const tag = node.init.tag || node.init

      let base = null

      if (tag.object?.name === STYLED_COMPONENTS_METHOD) {
        base = tag.property.name
      } else if (tag.callee) {
        const callee = tag.callee

        switch (STYLED_COMPONENTS_METHOD) {
          case callee.name: {
            const arg = tag.arguments[0]
            base = arg.name || arg.value
            break
          }
          case callee.callee?.name: {
            const arg = callee.arguments[0]
            base = arg.name || arg.value
            break
          }
          case callee.object?.name:
            base = callee.property.name
            break
        }
      }

      if (base) {
        const extended = node.id.name

        entriesesTagNames.forEach(([b, e]) => {
          if (base.match(b) && !extended.match(e)) {
            context.report({
              node,
              message: `${extended}を正規表現 "${e.toString()}" がmatchする名称に変更してください`,
            });
          }
        })
      }
    },
  }
}

module.exports = { generateTagFormatter }
