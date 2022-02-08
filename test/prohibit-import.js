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
      options: [
        {
          '^lodash$': {
            imported: true,
          },
        }
      ]
    },
    {
      code: `import { isEqual } from 'lodash-es'`,
      options: [
        {
          '^lodash$': {
            imported: ['isEqual']
          },
        }
      ]
    },
    {
      code: `import { isEqaul } from 'lodash'`,
      options: [
        {
          '^lodash$': {
            imported: ['isEqual']
          },
        }
      ]
    },
    {
      code: `import _ from 'lodash'`,
      options: [
        {
          '^lodash$': {
            imported: ['isEqual']
          },
        }
      ]
    }
  ],
  invalid: [
    {
      code: `import _ from 'lodash'`,
      options: [
        {
          '^lodash$': {
            imported: true
          },
        }
      ],
      errors: [{ message: 'lodash は利用しないでください' }]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      options: [
        {
          '^lodash$': {
            imported: true
          },
        }
      ],
      errors: [{ message: 'lodash は利用しないでください' }]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      options: [
        {
          '^lodash$': {
            imported: ['isEqual']
          },
        }
      ],
      errors: [{message: 'lodash/isEqual は利用しないでください'}]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      options: [
        {
          '^lodash$': {
            imported: ['isEqual'],
            "reportMessage": "must not use {{module}}/{{export}}"
          },
        }
      ],
      errors: [{message: 'must not use lodash/isEqual'}]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      options: [
        {
          'example': {
            imported: true,
          },
          '^lodash$': {
            imported: ['isEqual'],
            reportMessage: "must not use {{module}}/{{export}}",
          },
        }
      ],
      errors: [{message: 'must not use lodash/isEqual'}]
    }
  ]
})