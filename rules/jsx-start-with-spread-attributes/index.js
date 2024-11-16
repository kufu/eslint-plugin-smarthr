const SCHEMA = [
  {
    type: 'object',
    properties: {
      fix: { type: 'boolean', default: false },
    },
    additionalProperties: false,
  }
]

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: SCHEMA,
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      JSXSpreadAttribute: (node) => {
        // HINT: -2: 計算中 -1: 見つからなかった >= 0: 見つかった
        const insertIndex = node.parent.attributes.reduce((h, a, i) => {
          if (h === -2) {
            if (a === node) {
              return -1
            }

            return a.type !== 'JSXSpreadAttribute' ? i : h
          }

          return h
        }, -2)

        if (insertIndex >= 0) {
          const option = context.options[0]
          const attributeCode = sourceCode.getText(node)

          context.report({
            node,
            message: `"${attributeCode}" は意図しない上書きを防ぐため、spread attributesでない属性より先に記述してください`,
            fix: option?.fix ? (fixer) => {
              const elementNode = node.parent
              const sortedAttributes = [...elementNode.attributes].reduce((p, a, i) => {
                if (insertIndex === i) {
                  p = [attributeCode, ...p]
                }

                if (a !== node) {
                  p = [...p, sourceCode.getText(a)]
                }

                return p
              }, [])

              return fixer.replaceText(
                elementNode,
                `<${elementNode.name.name} ${sortedAttributes.join(' ')}${elementNode.selfClosing ? '/' : ''}>`
              )
            } : null
          });
        }
      },
    };
  },
}
module.exports.schema = SCHEMA
