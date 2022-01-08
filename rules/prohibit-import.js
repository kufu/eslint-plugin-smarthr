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

const generateDefaultReportMessage = (source, imported) => `${source}/${imported} は利用しないでください`

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
    const generateReportMessage = option.generateReportMessage || generateDefaultReportMessage

    return {
      ImportDeclaration: (node) => {
        parsedOption.forEach(([matchText, importNames]) => {
          if (!node.source.value.match(new RegExp(matchText))) {
            return
          }

          const specifier = node.specifiers.find((s) => importNames.includes(s.imported.name))

          if (specifier) {
            context.report({
              node,
              messageId: 'prohibit_import',
              data: {
                message: generateReportMessage(node.source.value, specifier.imported.name),
              },
            });
          }
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
