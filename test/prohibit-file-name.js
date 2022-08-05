const rule = require('../rules/prohibit-file-name')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  },
})

ruleTester.run('prohibit-file-name', rule, {
  valid: [
    {
      code: 'const any = "code"',
      filename: 'hoge.js',
      options: [
        {
          'fuga\.js': 'any message.',
        }
      ]
    },
  ],
  invalid: [
    {
      code: 'const any = "code"',
      filename: 'hoge.js',
      options: [
        {
          'hoge\.js': 'any message.',
        }
      ],
      errors: [{ message: 'any message.' }]
    },
    {
      code: 'const any = "code"',
      filename: 'hoge.js',
      options: [
        {
          '(hoge|fuga)\.js': '$1.jsは作成しないで！',
        }
      ],
      errors: [{ message: 'hoge.jsは作成しないで！' }]
    },
  ]
})
