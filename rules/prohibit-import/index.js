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
              },
            },
            reportMessage: {
              type: 'string',
            },
          },
          additionalProperties: false
        }
      }
    },
  },
  additionalProperties: true,
}]

const defaultReportMessage = (moduleName, exportName) => `${moduleName}${typeof exportName == 'string' ? `/${exportName}`: ''} は利用しないでください`

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
    const parentDir = (() => {
      const dir = filename.match(/^(.+?)\..+?$/)[1].split('/')
      dir.pop()

      return dir.join('/')
    })()
    const targetPathRegexs = Object.keys(options)
    const targetProhibits = targetPathRegexs.filter((regex) => !!filename.match(new RegExp(regex)))

    if (targetProhibits.length === 0) {
      return {}
    }

    return {
      ImportDeclaration: (node) => {
        targetProhibits.forEach((prohibitKey) => {
          const option = options[prohibitKey]
          const targetModules = Object.keys(option)

          targetModules.forEach((targetModule) => {
            const { imported, reportMessage } = Object.assign({imported: true}, option[targetModule])
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
                message: reportMessage ? reportMessage.replaceAll('{{module}}', node.source.value).replaceAll('{{export}}', useImported) : defaultReportMessage(node.source.value, useImported)
              });
            }
          })
        })
      },
    }
  },
}

module.exports.schema = SCHEMA
