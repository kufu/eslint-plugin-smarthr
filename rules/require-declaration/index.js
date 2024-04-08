const SCHEMA = [
  {
    type: 'object',
    patternProperties: {
      '.+': {
        type: 'object',
        patternProperties: {
          '.+': {
            type: 'object',
            required: ['type'],
            properties: {
              type: {
                type: 'string',
                pattern: '^(type|const|let|class|function|arrow-function)$',
              },
              use: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              reportMessage: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: true,
      },
    },
    additionalProperties: true,
  },
]

const find = (type, ds, rd) => ds.find((d) => d.type === type && d.id.name === rd)
const codeSeparator = '[^a-zA-Z0-1_$]'
const useRegex = (use) => {
  const actualUse = use.replaceAll('.', '\.')
  return new RegExp(`((${codeSeparator}(${actualUse})${codeSeparator})|(^(${actualUse})${codeSeparator})|${codeSeparator}(${actualUse})$)`)
}

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    schema: SCHEMA,
  },
  create(context) {
    const options = context.options[0]
    const filename = context.getFilename()
    const targetPathRegexs = Object.keys(options)
    const targetRequires = targetPathRegexs.filter((regex) => !!filename.match(new RegExp(regex)))

    if (targetRequires.length === 0) {
      return {}
    }

    return {
      Program: (node) => {
        const declarations = node.body.filter((i) => i.type.match(/Declaration$/)).map((d) => d.declaration || d)

        if (declarations.length === 0) {
          return
        }

        targetRequires.forEach((requireKey) => {
          const option = options[requireKey]

          Object.keys(option).forEach((requireDeclaration) => {
            const localOption = option[requireDeclaration]
            let hit

            switch (localOption.type) {
              case 'type':
                hit = find('TSTypeAliasDeclaration', declarations, requireDeclaration)
                break
              case 'class':
                hit = find('ClassDeclaration', declarations, requireDeclaration)
                break
              case 'function':
                hit = find('FunctionDeclaration', declarations, requireDeclaration)
                break
              case 'const':
              case 'let':
                hit = declarations.find((d) => d.type === 'VariableDeclaration' && d.kind === localOption.type && d.declarations.some((dd) => {
                  if (dd.id.name) {
                    return dd.id.name === requireDeclaration
                  }

                  // const { hoge } = fuga パターン
                  return dd.id.properties.some((p) => p.key.name === requireDeclaration)
                }))
                break
              case 'arrow-function':
                hit = declarations.find((d) => d.type === 'VariableDeclaration' && d.declarations.some((dd) => dd.id.name === requireDeclaration && dd.init.type === 'ArrowFunctionExpression'))
                break
            }

            if (!hit) {
              context.report({
                node,
                message: localOption.reportMessage || `${localOption.type} ${requireDeclaration}が宣言されていません`,
              })
            } else if (localOption.use) {
              const code = context.getSourceCode().getText(hit)
              let reported = false

              localOption.use.forEach((u) => {
                if (!code.match(useRegex(u)) && (!localOption.reportMessage || !reported)) {
                  context.report({
                    node: hit,
                    message: localOption.reportMessage || `${localOption.type} ${requireDeclaration} では ${u} を利用してください`,
                  })
                  reported = true
                }
              })
            }
          })
        })
      },
    }
  },
}

module.exports.schema = SCHEMA
