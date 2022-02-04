const SCHEMA = [
  {
    type: 'object',
    properties: {
      targets: { type: 'object', default: {} },
      generateReportMessage: { type: 'function' },
    },
    additionalProperties: false,
  }
]

const defaultReportMessage = '${prohibit} は利用しないでください'

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

    return {
      ImportDeclaration: (node) => {
        parsedOption.forEach(([matchText, config]) => {
          if (!node.source.value.match(new RegExp(matchText))) {
            return
          }

          const imported = (() => {
            if (!Array.isArray(config.imported)) {
              return !!config.imported
            }
            const specifier = node.specifiers.find((s) => config.imported.includes(s.imported.name))

            return specifier ? specifier.imported.name : false
          })()

          if (imported) {
            context.report({
              node,
              messageId: 'prohibit_import',
              data: {
                message: (config.reportMessage || defaultReportMessage).replace('${prohibit}', `${node.source.value}${imported === true ? '' : `/${imported}`}`),
              },
            });
          }
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
