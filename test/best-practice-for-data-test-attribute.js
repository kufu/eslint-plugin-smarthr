const rule = require('../rules/best-practice-for-data-test-attribute')
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
const generateErrorMessage = (attr) => `テストのために要素を指定するために、${attr} 属性を利用するのではなく、他の方法で要素を指定することを検討してください。
 - 方法1: click_link, click_button等を利用したりすることで、利用しているテスト環境に準じた方法で要素を指定することを検討してください。
   - 参考(Testing Library): https://testing-library.com/docs/queries/about
   - 参考(Capybara): https://rubydoc.info/github/jnicklas/capybara/Capybara/Node/Finders
 - 方法2: テスト環境のメソッド等で要素が指定できない場合はrole属性、name属性、id属性等を利用した方法で要素を指定することを検討してください。
 - 方法3: 上記の方法でも要素が指定できない場合は、'eslint-disable-next-line' 等を利用して、このルールを無効化してください。`


ruleTester.run('best-practice-for-data-test-attribute', rule, {
  valid: [
    { code: '<Any>ほげ</Any>'},
    { code: '<Any name="hoge">ほげ</Any>'},
    { code: '<Any data-any="fuga">ほげ</Any>'},
  ],
  invalid: [
    { code: '<Any data-spec="hijklmn">ほげ</Any>', errors: [{message: generateErrorMessage("data-spec")}] },
    { code: '<Any data-spec>ほげ</Any>', errors: [{message: generateErrorMessage("data-spec")}] },
    { code: '<Any data-testid="abcdefg">ほげ</Any>', errors: [{message: generateErrorMessage("data-testid")}] },
    { code: '<Any data-testid>ほげ</Any>', errors: [{message: generateErrorMessage("data-testid")}] },
  ]
})
