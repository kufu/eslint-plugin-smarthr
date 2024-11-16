const rule = require('../rules/require-declaration')
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
const options = [
  {
    '^.+$': {
      hoge: {
        type: 'const',
      },
    },
  }
]

ruleTester.run('format-translate-component', rule, {
  valid: [
    {
      code: 'const hoge = any',
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            hoge: {
              type: 'const',
            },
          },
        }
      ]
    },
    {
      code: 'const hoge = any',
      filename: 'hoge.js',
      options: [
        {
          'fuga\.': {
            hoge: {
              type: 'const',
            },
          },
        }
      ]
    },
    {
      code: 'function abc(arg1) { return arg1 * 10 }',
      filename: 'hoge.js',
      options: [
        {
          'hoge\.': {
            abc: {
              type: 'function',
              use: [ 'arg1' ]
            },
          },
        }
      ]
    },
    {
      code: 'const fuga = () => { return undefined }',
      filename: 'hoge.js',
      options: [
        {
          'hoge\.': {
            fuga: {
              type: 'arrow-function',
              use: [ 'return undefined' ]
            },
          },
        }
      ]
    },
  ],
  invalid: [
    {
      code: 'const hoge = any',
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            fuga: {
              type: 'const',
            },
          },
        }
      ],
      errors: [{ message: 'const fugaが宣言されていません' }],
    },
    {
      code: 'const hoge = any',
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            fuga: {
              type: 'const',
              reportMessage: 'fugaを定義しろ！',
            },
          },
        }
      ],
      errors: [{ message: 'fugaを定義しろ！' }],
    },
    {
      code: 'const hoge = abc',
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            hoge: {
              type: 'const',
              use: ['fuga'],
            },
          },
        }
      ],
      errors: [{ message: 'const hoge では fuga を利用してください' }],
    },
    {
      code: 'let hoge = () => undefined',
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            hoge: {
              type: 'arrow-function',
              use: ['num', 'parseInt(num, 10)'],
            },
          },
        }
      ],
      errors: [{ message: 'arrow-function hoge では num を利用してください' }, { message: 'arrow-function hoge では parseInt(num, 10) を利用してください' }],
    },
    {
      code: 'let hoge = () => undefined',
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            hoge: {
              type: 'arrow-function',
              use: ['num', 'temp', 'parseInt(num, 10)'],
              reportMessage: 'hoge関数は `const hoge = (num) => { const temp = parseInt(num, 10); /* any code. */ }` のように定義してください'
            },
          },
        }
      ],
      errors: [{ message: 'hoge関数は `const hoge = (num) => { const temp = parseInt(num, 10); /* any code. */ }` のように定義してください' }],
    },
  ]
})
