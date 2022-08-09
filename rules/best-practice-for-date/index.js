module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'best-practice-for-date': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      NewExpression: (node) => {
        if (
          node.callee.name === 'Date' &&
          node.arguments.length == 1
        ) {
          context.report({
            node,
            messageId: 'best-practice-for-date',
            data: {
              message: "'new Date(arg)' のように引数一つのみの指定方は実行環境により結果が変わる可能性があるため 'new Date(2022, 12 - 1, 31)' のようにparseするなど他の方法を検討してください。",
            },
          });
        }
      },
      CallExpression: (node) => {
        if (
          node.callee.object?.name === 'Date' &&
          node.callee.property?.name === 'parse'
        ) {
          context.report({
            node,
            messageId: 'best-practice-for-date',
            data: {
              message: 'Date.parse は日付形式の解釈がブラウザによって異なるため、他の手段を検討してください',
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
