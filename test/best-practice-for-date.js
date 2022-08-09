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

const errorNewDate = "'new Date(arg)' のように引数一つのみの指定方は実行環境により結果が変わる可能性があるため 'new Date(2022, 12 - 1, 31)' のようにparseするなど他の方法を検討してください。"
const errorDateParse = 'Date.parse は日付形式の解釈がブラウザによって異なるため、他の手段を検討してください'

ruleTester.run('best-practice-for-date', rule, {
  valid: [
    { code: `new Date()` },
    { code: `new Date(2022, 11, 31)` },
    { code: `new Date('2022', '11', '31')` },
    { code: `const year = 2022; const month = 11; const date = 31; new Date(year, month, date)` },
  ],
  invalid: [
    { code: 'new Date("2022/12/31")', errors: [ { message: errorNewDate } ] },
    { code: 'const arg = "2022/12/31"; new Date(arg)', errors: [ { message: errorNewDate } ] },
    { code: 'Date.parse("2022/12/31")', errors: [ { message: errorDateParse } ] },
    { code: 'const arg = "2022/12/31"; Date.parse(arg)', errors: [ { message: errorDateParse } ] },
  ]
})
