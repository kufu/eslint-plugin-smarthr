const path = require('path')
const SCHEMA = [{
  type: "object",
  patternProperties: {
    ".+": {
      type: "object",
      required: [
        "imported",
        "targetRegex",
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
        },
        targetRegex: 'string'
      },
      additionalProperties: false
      }
    },
    additionalProperties: true,
  }
]

const defaultReportMessage = '{{module}}/{{export}} をimportしてください'

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'require_import': '{{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    const options = context.options[0]
    const targetModules = Object.keys(options)

    return {
      Program: (node) => {
        const importDeclarations = node.body.filter((item) => item.type === 'ImportDeclaration')
        const filename = context.getFilename()
        const parentDir = (() => {
          const dir = filename.match(/^(.+?)\..+?$/)[1].split('/')
          dir.pop()

          return dir.join('/')
        })()

        targetModules.forEach((targetModule) => {
          const { imported, reportMessage, targetRegex } = Object.assign({imported: true}, options[targetModule])

          if (targetRegex && !filename.match(new RegExp(targetRegex))) {
            return
          }

          const actualTarget = targetModule[0] !== '.' ? targetModule : path.resolve(`${process.cwd()}/${targetModule}`)
          const importDeclaration = importDeclarations.find(
            actualTarget[0] !== '/' ? (
              (id) => id.source.value === actualTarget
            ) : (
              (id) => path.resolve(`${parentDir}/${id.source.value}`) === actualTarget
            )
          )
          const reporter = (item) => {
            context.report({
              node,
              messageId: 'require_import',
              data: {
                message: (reportMessage || defaultReportMessage).replace('{{module}}', actualTarget).replace('{{export}}', item)
              },
            })
          }

          if (!importDeclaration) {
            if (Array.isArray(imported)) {
              imported.forEach((i) => {
                reporter(i)
              })
            } else if (imported) {
              reporter('')
            }
          } else if (Array.isArray(imported)) {
            imported.forEach((i) => {
              if (!importDeclaration.specifiers.find((s) => s.imported && s.imported.name === i)) {
                reporter(i)
              }
            })
          }
        })
      },
    }
  },
}

module.exports.schema = SCHEMA
