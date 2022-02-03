const SCHEMA = [
  {
    type: 'array',
    items: {
      properties: {
        targets: { type: 'object', default: {} },
        customMessage: { type: 'string'},
      },
      reportMessage: false,
    }
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
    const options = context.options[0]
    return {
      ImportDeclaration: (node) => {
        options.forEach((option) => {
          const parsedOption = Object.entries(option.targets)
          const reportMessage = option.reportMessage
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
                  message: reportMessage ? reportMessage.replace('$moduleName', node.source.value).replace('$exportName', imported) : generateDefaultReportMessage(node.source.value, imported),
                },
              });
            }
          })
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
