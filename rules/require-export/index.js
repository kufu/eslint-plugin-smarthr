const SCHEMA = [{
  type: 'object',
  patternProperties: {
    '.+': {
      type: 'array',
      items: { type: 'string' },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
}]

const fetchEdgeDeclaration = (node) => {
  const { declaration } = node

  if (!declaration) {
    return node
  }

  return fetchEdgeDeclaration(declaration)
}

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
        targetRequires.forEach((requireKey) => {
          const option = options[requireKey]
          let existDefault = false
          const exports =
            node.body
              .filter((i) => {
                if (i.type == 'ExportDefaultDeclaration') {
                  existDefault = true

                  return false
                }

                return i.type == 'ExportNamedDeclaration'
              })
              .map((i) => {
                const declaration = fetchEdgeDeclaration(i)

                if (declaration.id) {
                  return declaration.id.name
                }
                if (declaration.specifiers) {
                  return declaration.specifiers.map((s) => s.exported.name)
                }
                if (declaration.declarations) {
                  return declaration.declarations.map((d) => d.id.name || d.id.properties.map((p) => p.key.name))
                }

                return declaration
              })
              .flat(2)

          let notExistsExports = [...(!existDefault && option.includes('default') ? ['default'] : []), ...option.filter((o) => o !== 'default' && !exports.includes(o))]

          if (notExistsExports.length) {
            context.report({
              node,
              message: `${notExistsExports.join(', ')} をexportしてください`,
            })
          }
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
