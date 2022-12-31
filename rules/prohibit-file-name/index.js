const SCHEMA = [{
  type: 'object',
  patternProperties: {
    '.+': {
      type: 'string',
    },
  },
  additionalProperties: true,
}]


module.exports = {
  meta: {
    type: 'suggestion',
    schema: SCHEMA,
  },
  create(context) {
    const options = context.options[0]
    const filename = context.getFilename()
    const targetPaths = Object.keys(options).filter((regex) => !!filename.match(new RegExp(regex)))


    if (targetPaths.length === 0) {
      return {}
    }

    const messages = []

    targetPaths.forEach((path) => {
      const message = options[path]

      matcher = filename.match(new RegExp(path))

      if (matcher) {
        messages.push([...matcher].reduce(((prev, k, index) => prev.replaceAll(`\$${index}`, k)), message))
      }
    })

    if (messages.length === 0) {
      return {}
    }

    return {
      Program: (node) => {
        messages.forEach((message) => {
          context.report({
            node,
            message,
          })
        })
      },
    }
  },
}
module.exports.schema = SCHEMA
