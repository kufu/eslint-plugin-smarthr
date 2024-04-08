const MESSAGE_NEW_DATE = `'new Date(arg)' のように引数を一つだけ指定したDate instanceの生成は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31)' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例:  'dayjs(arg).toDate()')`
const MESSAGE_PARSE = `Date.parse は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31).getTime()' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例: 'dayjs(arg).valueOf()')`

const SEPARATOR = '(\/|-)'
const DATE_REGEX = new RegExp(`^([0-9]{4})${SEPARATOR}([0-9]{1,2})${SEPARATOR}([0-9]{1,2})`)

const fixAction = (fixer, node, replacedSuffix = '') => {
  const arg = node.arguments[0]

  if (arg.type == 'Literal') {
    const parsedArgs = arg.value.match(DATE_REGEX)

    if (parsedArgs) {
      return fixer.replaceText(
        node,
        `new Date(${parsedArgs[1] * 1}, ${parsedArgs[3] * 1} - 1, ${parsedArgs[5] * 1})${replacedSuffix}`
      )
    }
  }
}

const SCHEMA = []

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: SCHEMA,
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
            fix: (fixer) => fixAction(fixer, node),
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
            fix: (fixer) => fixAction(fixer, node, '.getTime()'),
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
