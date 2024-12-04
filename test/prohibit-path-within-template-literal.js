const rule = require('../rules/prohibit-path-within-template-literal')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('prohibit-path-within-template-literal', rule, {
  valid: [
    { code: 'path.hoge', },
    { code: 'path.fuga()', },
    { code: 'localPath.any.aaa("hoge")', },
    { code: 'PATH.some({ x })', },
    { code: 'hoge.some({ x })', options: [{ pathRegex: '^hoge$' }] },
  ],
  invalid: [
    {
      code: '`${path.hoge}`',
      errors: [{ message: 'path.hogeは `` で囲まないでください。queryStringを結合するなどのURL生成は path.hoge 内で行います。 (例: path.hoge({ query: { hoge: \'abc\' } })' }]
    },
    {
      code: '`${ABC.hoge()}${hogehoge}`',
      options: [{ pathRegex: '^ABC$' }],
      errors: [{ message: 'ABC.hogeは `` で囲まないでください。queryStringを結合するなどのURL生成は ABC.hoge 内で行います。 (例: ABC.hoge({ query: { hoge: \'abc\' } })' }]
    },
  ]
})
