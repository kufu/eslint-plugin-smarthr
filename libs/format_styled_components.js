const STYLED_COMPONENTS_METHOD = 'styled'
const STYLED_COMPONENTS = `${STYLED_COMPONENTS_METHOD}-components`

const findInvalidImportNameNode = (s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== STYLED_COMPONENTS_METHOD

const generateTagFormatter = ({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }) => {
  const entriesesTagNames = Object.entries(EXPECTED_NAMES).map(([b, e]) => [ new RegExp(b), new RegExp(e) ])
  const entriesesUnTagNames = UNEXPECTED_NAMES ? Object.entries(UNEXPECTED_NAMES).map(([b, e]) => {
    const [ auctualE, messageTemplate ] = Array.isArray(e) ? e : [e, '']

    return [ new RegExp(b), new RegExp(auctualE), messageTemplate ]
  }) : []

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
          case callee.object?.callee?.name:
            const arg = callee.object.arguments[0]
            base = arg.name || arg.value
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

        entriesesUnTagNames.forEach(([b, e, m]) => {
          const matcher = extended.match(e)

          if (matcher && !base.match(b)) {
            const expected = matcher[1]
            const isBareTag = base === base.toLowerCase()
            const sampleFixBase = `styled${isBareTag ? `.${base}` : `(${base})`}`

            context.report({
              node,
              message: m ? m
              .replaceAll('{{extended}}', extended)
              .replaceAll('{{expected}}', expected) : `${extended} は ${b.toString()} にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - ${extended} の名称の末尾が"${expected}" という文字列ではない状態にしつつ、"${base}"を継承していることをわかる名称に変更してください
 - もしくは"${base}"を"${extended}"の継承元であることがわかるような${isBareTag ? '適切なタグや別コンポーネントに差し替えてください' : '名称に変更するか、適切な別コンポーネントに差し替えてください'}
   - 修正例1: const ${extended.replace(expected, '')}Xxxx = ${sampleFixBase}
   - 修正例2: const ${extended}Xxxx = ${sampleFixBase}
   - 修正例3: const ${extended} = styled(Xxxx${expected})`
            })
          }
        })
      }
    },
  }
}

module.exports = { generateTagFormatter, STYLED_COMPONENTS_METHOD }
