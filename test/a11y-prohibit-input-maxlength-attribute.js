const rule = require('../rules/a11y-prohibit-input-maxlength-attribute')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

ruleTester.run('a11y-prohibit-input-maxlength-attribute', rule, {
  valid: [
    { code: `<input />` },
    { code: `<Input type="text" />` },
    { code: `<HogeInput value="hoge" />` },
    { code: `<textarea>hoge</textarea>` },
    { code: `<Textarea type="text" />` },
    { code: `<HogeTextarea value="hoge" />` }
  ],
  invalid: [
    { code: `<input maxLength="30" />`, errors: [{ message: 'input要素にはmaxLength属性を設定しないでください' }] },
    { code: `<Input type="text" />` },
    { code: `<HogeInput value="hoge" />` },
    { code: `<textarea>hoge</textarea>` },
    { code: `<Textarea type="text" />` },
    { code: `<HogeTextarea value="hoge" />` }
  ]
})
