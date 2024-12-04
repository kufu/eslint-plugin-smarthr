const rule = require('../rules/require-export')
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

ruleTester.run('require-export', rule, {
  valid: [
    {
      code: `const hoge = {}; export { hoge }`,
      options: [
        {
          '^.+$': ['hoge'],
        }
      ],
    },
    {
      code: `const hoge = {}, fuga = {}; export { hoge, fuga }`,
      options: [
        {
          '^.+$': ['hoge', 'fuga'],
        }
      ],
    },
    {
      code: `const hoge = {}, fuga = {}; export { hoge, fuga }`,
      options: [
        {
          '^.+$': ['fuga'],
        }
      ],
    },
    {
      code: `export const hoge = {}`,
      options: [
        {
          '^.+$': ['hoge'],
        }
      ],
    },
    {
      code: `const hoge = {}; export default hoge`,
      options: [
        {
          '^.+$': ['default'],
        }
      ],
    },
  ],
  invalid: [
    {
      code: `const hoge ={}; export { hoge }`,
      options: [
        {
          '^.+$': ['fuga'],
        }
      ],
      errors: [{ message: 'fuga をexportしてください' }],
    },
    {
      code: `export const hoge = {}`,
      options: [
        {
          '^.+$': ['fuga'],
        }
      ],
      errors: [{ message: 'fuga をexportしてください' }],
    },
    {
      code: `const hoge = {}; export { hoge }`,
      options: [
        {
          '^.+$': ['default'],
        }
      ],
      errors: [{ message: 'default をexportしてください' }],
    },
  ]
})
