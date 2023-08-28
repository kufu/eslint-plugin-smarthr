const { dependencies } = require('../../libs/common')

const OPTION = {
  dayjs: dependencies.includes('dayjs')
}

const DAYJS = 'dayjs'
const findInvalidImportNameNode = (s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== DAYJS

const fixAction = (method, fixer, context, node, importedDayjs, lastImportDeclaration) => {
  const sourceCode = context.getSourceCode()
  let result = []

  if (!importedDayjs) {
    const importCode = sourceCode.getText(lastImportDeclaration)

    result = [
      fixer.replaceTextRange(
        lastImportDeclaration.range,
        `${importCode}\nimport dayjs from 'dayjs'`,
      )
    ]
  }

  return [
    ...result,
    fixer.replaceTextRange(
      node.range,
      `dayjs(${node.arguments[0].raw}).${method}()`,
    )
  ]
}

const MESSAGE_NEW_DATE = `'new Date(arg)' のように引数一つのみの指定でのDate instanceの生成は、実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31)' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例:  'dayjs(arg).toDate()')`
const MESSAGE_PARSE = `Date.parse は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31).getTime()' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例:  'dayjs(arg).valueOf()')`


module.exports = {
  meta: {
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  create(context) {
    let importedDayjs = false
    let lastImportDeclaration = null

    return {
      ImportDeclaration: (node) => {
        lastImportDeclaration = node

        if (node.source.value !== DAYJS) {
          return
        }

        importedDayjs = true

        const invalidNameNode = node.specifiers.find(findInvalidImportNameNode)

        if (invalidNameNode) {
          context.report({
            node: invalidNameNode,
            message: `${DAYJS} をimportする際は、名称が"${DAYJS}" となるようにしてください。例: "import ${DAYJS} from '${DAYJS}'"`,
          });
        }
      },
      NewExpression: (node) => {
        if (
          node.callee.name === 'Date' &&
          node.arguments.length == 1
        ) {
          context.report({
            node,
            message: MESSAGE_NEW_DATE,
            fix: OPTION.dayjs ? (fixer) => fixAction('toDate', fixer, context, node, importedDayjs, lastImportDeclaration) : null
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
            fix: OPTION.dayjs ? (fixer) => fixAction('valueOf', fixer, context, node, importedDayjs, lastImportDeclaration) : null
          });
        }
      },
    }
  },
}
module.exports.schema = []
