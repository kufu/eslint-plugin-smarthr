const path = require('path')
const SCHEMA = [{
  type: 'object',
  patternProperties: {
    '.+': {
      type: 'object',
      patternProperties: {
        '.+': {
          type: 'object',
          required: [
            'imported',
          ],
          properties: {
            imported: {
              type: ['boolean', 'array'],
              items: {
                type: 'string',
              }
            },
            reportMessage: {
              type: 'string',
            },
          },
          additionalProperties: false,
        }
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
}]

const defaultReportMessage = '{{module}}/{{export}} をimportしてください'
// const defaultReportMessage = (moduleName, exportName) => `${moduleName}${typeof exportName == 'string' ? `/${exportName}`: ''} は利用しないでください`

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
    const filename = context.getFilename()
    const targetPathRegexs = Object.keys(options)
    const targetRequires = targetPathRegexs.filter((regex) => !!filename.match(new RegExp(regex)))

    if (targetRequires.length === 0) {
      return {}
    }

    return {
      Program: (node) => {
        const importDeclarations = node.body.filter((item) => item.type === 'ImportDeclaration')
        const parentDir = (() => {
          const dir = filename.match(/^(.+?)\..+?$/)[1].split('/')
          dir.pop()

          return dir.join('/')
        })()

        targetRequires.forEach((requireKey) => {
          const option = options[requireKey]

          Object.keys(option).forEach((targetModule) => {
            const { imported, reportMessage, targetRegex } = Object.assign({imported: true}, option[targetModule])

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
        })
      },
    }
  },
}

module.exports.schema = SCHEMA
