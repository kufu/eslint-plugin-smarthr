const SCHEMA = [
  {
    type: 'object',
    properties: {
      targets: { type: 'object', default: {} },
      customMessage: { type: 'string'},
    },
    additionalProperties: false,
  }
]

const generateDefaultReportMessage = (source, imported) => `${source}${typeof imported == 'string' ? `/${imported}`: ''} は利用しないでください`

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'prohibit_import': '{{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0]
    const parsedOption = Object.entries(option.targets)
    const customMessage = option.customMessage

    return {
      ImportDeclaration: (node) => {
        parsedOption.forEach(([matchText, importNames]) => {
          if (!node.source.value.match(new RegExp(matchText))) {
            return
          }

          const imported = (() => {
            if (!Array.isArray(importNames)) {
              return !!importNames
            }
            const specifier = node.specifiers.find((s) => s.imported && importNames.includes(s.imported.name))

            return specifier ? specifier.imported.name : false
          })()

          if (imported) {
            context.report({
              node,
              messageId: 'prohibit_import',
              data: {
                message: customMessage ? customMessage : generateDefaultReportMessage(node.source.value, imported),
              },
            });
          }
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
