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

const expectedErrorMessage = (elName) => `${elName}にmaxLength属性を設定しないでください。
- maxLength属性がついた要素に、テキストをペーストすると、maxLength属性の値を超えた範囲が意図せず切り捨てられてしまう場合がある
- 以下のいずれかの方法で修正をおこなってください
  - 方法1: pattern属性とtitle属性を組み合わせ、form要素でラップする
  - 方法2: JavaScriptを用いたバリデーションを実装する`

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
    { code: `<input maxLength={30} />`, errors: [{ message: expectedErrorMessage('input') }] },
    { code: `<Input type="text" maxLength={40} />`, errors: [{ message: expectedErrorMessage('Input') }] },
    { code: `<HogeInput maxLength value="hoge" />`, errors: [{ message: expectedErrorMessage('HogeInput') }] },
    { code: `<textarea maxLength={50}>hoge</textarea>`, errors: [{ message: expectedErrorMessage('textarea') }]},
    { code: `<Textarea type="text" maxLength={60} />`, errors: [{ message: expectedErrorMessage('Textarea') }]},
    { code: `<HogeTextarea maxLength={70} value="hoge" />`, errors: [{ message: expectedErrorMessage('HogeTextarea') }]}
  ]
})
