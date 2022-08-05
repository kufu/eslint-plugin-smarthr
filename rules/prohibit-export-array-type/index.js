module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'prohibit-export-array-type': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    const checker = (node) => {
      if (node.declaration?.typeAnnotation?.type === 'TSArrayType') {
        context.report({
          node,
          messageId: 'prohibit-export-array-type',
          data: {
            message: '利用する際、配列かどうかわかりにくいため、配列ではない状態でexportしてください',
          },
        })
      }
    }

    return {
      ExportDefaultDeclaration: checker,
      ExportNamedDeclaration: checker,
    }
  },
}
module.exports.schema = []
