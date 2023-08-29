const MESSAGE_NEW_DATE = `'new Date(arg)' のように引数を一つだけ指定したDate instanceの生成は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31)' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例:  'dayjs(arg).toDate()')`
const MESSAGE_PARSE = `Date.parse は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31).getTime()' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例:  'dayjs(arg).valueOf()')`

module.exports = {
  meta: {
    type: 'problem',
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
            message: MESSAGE_NEW_DATE,
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
            message: MESSAGE_PARSE,
          });
        }
      },
    }
  },
}
module.exports.schema = []
