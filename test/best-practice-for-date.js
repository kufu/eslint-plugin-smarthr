const rule = require('../rules/best-practice-for-date')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

const errorNewDate = `'new Date(arg)' のように引数を一つだけ指定したDate instanceの生成は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31)' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例:  'dayjs(arg).toDate()')`
const errorDateParse = `Date.parse は実行環境によって結果が異なるため、以下のいずれかの方法に変更してください
 - 'new Date(2022, 12 - 1, 31).getTime()' のように数値を個別に指定する
 - dayjsなど、日付系ライブラリを利用する (例: 'dayjs(arg).valueOf()')`

ruleTester.run('best-practice-for-date', rule, {
  valid: [
    { code: `new Date()` },
    { code: `new Date(2022, 11, 31)` },
    { code: `new Date('2022', '11', '31')` },
    { code: `const year = 2022; const month = 11; const date = 31; new Date(year, month, date)` },
  ],
  invalid: [
    { code: 'new Date("2022/12/31")', errors: [ { message: errorNewDate } ], output: 'new Date(2022, 12 - 1, 31)' },
    { code: 'const arg = "2022/12/31"; new Date(arg)', errors: [ { message: errorNewDate } ] },
    { code: 'Date.parse("2022/12/31")', errors: [ { message: errorDateParse } ], output: 'new Date(2022, 12 - 1, 31).getTime()' },
    { code: 'const arg = "2022/12/31"; Date.parse(arg)', errors: [ { message: errorDateParse } ] },
  ]
})
