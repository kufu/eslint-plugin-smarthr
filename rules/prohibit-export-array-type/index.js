module.exports = {
  meta: {
    type: 'suggestion',
    schema: [],
  },
  create(context) {
    const checker = (node) => {
      if (node.declaration?.typeAnnotation?.type === 'TSArrayType') {
        context.report({
          node,
          message: '利用する際、配列かどうかわかりにくいため、配列ではない状態でexportしてください',
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
