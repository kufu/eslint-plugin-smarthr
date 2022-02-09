const path = require('path')

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
    const filename = context.getFilename()
    const parentDir = (() => {
      const dir = filename.match(/^(.+?)\..+?$/)[1].split('/')
      dir.pop()

      return dir.join('/')
    })()
    const targetModules = Object.keys(options)

    return {
      ImportDeclaration: (node) => {
        targetModules.forEach((targetModule) => {
          const { imported, reportMessage, targetRegex } = Object.assign({imported: true}, options[targetModule])

          if (targetRegex && !filename.match(new RegExp(targetRegex))) {
            return
          }

          const actualTarget = targetModule[0] !== '.' ? targetModule : path.resolve(`${process.cwd()}/${targetModule}`)
          let sourceValue = node.source.value

          if (actualTarget[0] === '/') {
            sourceValue = path.resolve(`${parentDir}/${sourceValue}`)
          }

          if (actualTarget !== sourceValue) {
            return
          }
          
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
