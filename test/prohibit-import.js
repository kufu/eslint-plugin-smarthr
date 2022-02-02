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
      options: [{
        "targets": {
          '^lodash$': true,
        }
      }]
    },
    {
      code: `import { isEqual } from 'lodash-es'`,
      options: [{
        "targets": {
          '^lodash$': ['isEqual'],
        }
      }]
    },
    {
      code: `import { isEqaul } from 'lodash'`,
      options: [{
        "targets": {
          '^lodash$': ['isDeepEqual'],
        }
      }]
    },
    {
      code: `import _ from 'lodash'`,
      options: [{
        "targets": {
          '^lodash$': ['isEqual'],
        }
      }]
    }
  ],
  invalid: [
    {
      code: `import _ from 'lodash'`,
      options: [{
        "targets": {
          '^lodash$': true,
        }
      }],
      errors: [{message: 'lodash は利用しないでください'}]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      options: [{
        "targets": {
          '^lodash$': true,
        }
      }],
      errors: [{message: 'lodash は利用しないでください'}]
    },
    {
      code: `import { isEqual } from 'lodash'`,
      options: [{
        "targets": {
          '^lodash$': ['isEqual'],
        },
      }],
      errors: [{message: 'lodash/isEqual は利用しないでください'}]
    },
    {
      code: `import _ from 'lodash'`,
      options: [{
        "targets": {
          '^lodash$': true,
        },
        "customMessage": "must not use lodash"
      }],
      errors: [{message: 'must not use lodash'}]
    }
  ],
})