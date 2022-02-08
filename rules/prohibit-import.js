const SCHEMA = [{
  type: "object",
  patternProperties: {
    ".+": {
      type: "object",
      required: [
        "imported",
      ],
      properties: {
        imported: {
            type: ["boolean", "array"],
            items: {
              type: "string"
            }
        },
        reportMessage: {
            type: "string"
        }
      },
      additionalProperties: false
      }
    },
    additionalProperties: true,
  }
]

const defaultReportMessage = (moduleName, exportName) => `${moduleName}${typeof exportName == 'string' ? `/${exportName}`: ''} は利用しないでください`

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
    const targetModules = Object.keys(options)
    return {
      ImportDeclaration: (node) => {
        targetModules.forEach((targetModule) => {
          if (!node.source.value.match(new RegExp(targetModule))) {
            return
          }
          
          const {imported, reportMessage} = Object.assign({imported: true}, options[targetModule])
          const useImported = (() => {
            if (!Array.isArray(imported)) {
              return !!imported
            }

            const specifier = node.specifiers.find((s) => s.imported && imported.includes(s.imported.name))

            return specifier ? specifier.imported.name : false
          })()

          if (useImported) {
            context.report({
              node,
              messageId: 'prohibit_import',
              data: {
                message: reportMessage ? reportMessage.replace('{{module}}', node.source.value).replace('{{export}}', useImported) : defaultReportMessage(node.source.value, useImported)
              },
            });
          }
        })
      },
    }
  },
}

module.exports.schema = SCHEMA
