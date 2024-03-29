const rule = require('../rules/a11y-form-control-in-form')
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

const generateErrorText = (elementName) => `${elementName}をform要素で囲むようにマークアップしてください。
 - form要素で囲むことでスクリーンリーダーに入力フォームであることが正しく伝わる、入力要素にfocusした状態でEnterを押せばsubmitできる、inputのpattern属性を利用できるなどのメリットがあります
 - 以下のいずれかの方法で修正をおこなってください
   - 方法1: form要素で ${elementName} を囲んでください。smarthr-ui/ActionDialog、もしくはsmarthr-ui/RemoteTriggerActionDialogを利用している場合、smarthr-ui/FormDialog、smarthr-ui/RemoteTriggerFormDialogに置き換えてください
   - 方法2: ${elementName} がコンポーネント内の一要素であり、かつその親コンポーネントがFormControl、もしくはFieldsetを表現するものである場合、親コンポーネント名を "((Fieldset)$|(Fieldsets)$|(FormGroup)$|(FormControl)$|(FormControls)$)" とマッチするものに変更してください`

ruleTester.run('a11y-form-control-in-form', rule, {
  valid: [
    { code: '<input />' },
    { code: '<Select />' },
    { code: '<form><FormControl /></form>' },
    { code: '<Form><fieldset /></Form>' },
    { code: '<StyledForm><AnyFieldset /></StyledForm>' },
    { code: 'const HogeFormControl = <><AnyFormControl /></>' },
    { code: 'const HogeFieldset = <><AnyFieldset /></>' },
  ],
  invalid: [
    { code: '<FormControl />', errors: [ { message: generateErrorText('FormControl') } ] },
    { code: '<fieldset />', errors: [ { message: generateErrorText('fieldset') } ] },
    { code: '<AnyFieldset />', errors: [ { message: generateErrorText('AnyFieldset') } ] },
    { code: 'const Hoge = <><AnyFormControl /></>', errors: [ { message: generateErrorText('AnyFormControl') } ] },
  ]
})
