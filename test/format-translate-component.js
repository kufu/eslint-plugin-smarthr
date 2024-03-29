const rule = require('../rules/format-translate-component')
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

const options = [
  {
    componentPath: '@/any/path/Translate',
    componentName: 'Translate',
    prohibitAttributies: ['data-translate'],
  }
]

ruleTester.run('format-translate-component', rule, {
  valid: [
    { code: '<Any data-wovn-enable="true">ほげ</Any>', options },
    { code: '<Translate>ほげ</Translate>', options },
    { code: '<Translate>ほげ<br />ふが</Translate>', options },
    { code: '<Translate>{any}</Translate>', options },
    { code: '<Translate dangerouslySetInnerHTML={{ __html: "ほげ" }} />', options },
  ],
  invalid: [
    { code: '<Any data-translate="true">ほげ</Any>', options, errors: [ { message: 'data-translate 属性は使用せず、 @/any/path/Translate コンポーネントを利用してください' } ] },
    { code: '<Translate><Any>ほげ</Any></Translate>', options, errors: [ { message: 'Translate 内では <br /> 以外のタグは使えません' } ] },
    { code: '<Translate><Any /></Translate>', options, errors: [ { message: 'Translate 内では <br /> 以外のタグは使えません' } ] },
    { code: '<Translate></Translate>', options, errors: [ { message: 'Translate 内には必ずテキストを設置してください' } ] },
  ]
})
