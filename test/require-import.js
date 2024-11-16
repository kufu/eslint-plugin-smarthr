const rule = require('../rules/require-import')
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

ruleTester.run('require-import', rule, {
  valid: [
    {
      code: `import _ from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: true,
            },
          },
        }
      ],
    },
    {
      code: ``,
      filename: 'hoge.js',
      options: [
        {
          '^fuga.js$': {
            'lodash': {
              imported: true,
            },
          },
        }
      ],
    },
    {
      code: `import _ from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: true,
              reportMessage: '{{module}} を絶対使ってください'
            },
          },
        }
      ],
    },
    {
      code: `import { isEqual } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: ['isEqual'],
              reportMessage: '{{module}}/{{export}} を絶対使ってください'
            },
          },
        }
      ],
      errors: [{ message: 'lodash/isEqual を絶対使ってください' }],
    },
    {
      code: `import { chunk } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: true,
            },
          },
        }
      ],
    },
    {
      code: `import { isEqual } from './module/validator'`,
      filename: 'page/hoge.js',
      options: [
        {
          '^.+$': {
            './page/module/validator': {
              imported: ['isEqual'],
            },
          },
        }
      ],
    },
  ],
  invalid: [
    {
      code: ``,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: true,
            },
          },
        }
      ],
      errors: [{ message: 'lodash をimportしてください' }],
    },
    {
      code: ``,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: true,
            },
          },
        }
      ],
      errors: [{ message: 'lodash をimportしてください' }],
    },
    {
      code: ``,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: true,
              reportMessage: '{{module}} を絶対使ってください'
            },
          },
        }
      ],
      errors: [{ message: 'lodash を絶対使ってください' }],
    },
    {
      code: ``,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: ['isEqual'],
              reportMessage: '{{module}}/{{export}} を絶対使ってください'
            },
          },
        }
      ],
      errors: [{ message: 'lodash/isEqual を絶対使ってください' }],
    },
    {
      code: `import { chunk } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^hoge.js$': {
            'lodash': {
              imported: ['isEqual'],
              reportMessage: '{{module}}/{{export}} を絶対使ってください'
            },
          },
        }
      ],
      errors: [{ message: 'lodash/isEqual を絶対使ってください' }],
    },
    {
      code: `import { isEqual } from './module/validator'`,
      filename: 'page/hoge.js',
      options: [
        {
          '^.+$': {
            './module/validator': {
              imported: ['isEqual'],
            },
          },
        }
      ],
      errors: [{ message: /module\/validator\/isEqual をimportしてください$/ }],
    },
  ]
})
