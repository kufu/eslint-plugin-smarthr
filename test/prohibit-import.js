const rule = require("../rules/prohibit-import")
const RuleTester = require("eslint").RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015
  },
})

ruleTester.run("prohibit-import-lodash", rule, {
  valid: [
    {
      code: `import _ from 'lodash-es'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: true,
            },
          },
        }
      ]
    },
    {
      code: `import { isEqual } from 'lodash-es'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: ['isEqual']
            },
          },
        }
      ]
    },
    {
      code: `import { isEqaul } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: ['isEqual']
            },
          },
        }
      ]
    },
    {
      code: `import _ from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: ['isEqual']
            },
          },
        }
      ]
    }
  ],
  invalid: [
    {
      code: `import _ from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: true
            },
          },
        }
      ],
      errors: [{ message: 'lodash は利用しないでください' }]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: true
            },
          },
        }
      ],
      errors: [{ message: 'lodash は利用しないでください' }]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: ['isEqual']
            },
          },
        }
      ],
      errors: [{message: 'lodash/isEqual は利用しないでください'}]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'lodash': {
              imported: ['isEqual'],
              "reportMessage": "must not use {{module}}/{{export}}"
            },
          },
        }
      ],
      errors: [{message: 'must not use lodash/isEqual'}]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      filename: 'hoge.js',
      options: [
        {
          '^.+$': {
            'example': {
              imported: true,
            },
            'lodash': {
              imported: ['isEqual'],
              reportMessage: "must not use {{module}}/{{export}}",
            },
          },
        }
      ],
      errors: [{message: 'must not use lodash/isEqual'}]
    }
  ]
})
