const recursiveFetchName = (obj, chained = '') => {
  const o = obj.callee || obj
  const name = o.name || o.property.name || ''
  const nextChained = chained ? `${name}.${chained}` : name

  if (o.property && o.object) {
    return recursiveFetchName(o.object, nextChained)
  }

  return [name, nextChained]
}

const recursiveFetchRootNameIsPath = (obj, regex) => {
  const [name, chained] = recursiveFetchName(obj, '')

  return name.match(regex) ? chained : null
}

const SCHEMA = [
  {
    type: 'object',
    properties: {
      pathRegex: { type: 'string', default: '((p|P)ath|PATH)$' },
    },
    additionalProperties: false,
  },
]

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'prohibit-path-within-template-literal': '{{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0]
    const nameRegex = new RegExp(option?.pathRegex || SCHEMA[0].properties.pathRegex.default)

    return {
      TemplateLiteral: (node) => {
        node.expressions.forEach((exp) => {
          const name = recursiveFetchRootNameIsPath(exp, nameRegex)

          if (name) {
            context.report({
              node: exp,
              messageId: 'prohibit-path-within-template-literal',
              data: {
                message: `${name}は \`\` で囲まないでください。queryStringを結合するなどのURL生成は ${name} 内で行います。 (例: ${name}({ query: { hoge: 'abc' } })`,
              },
            });
          }
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
