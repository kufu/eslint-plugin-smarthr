const rule = require('../rules/a11y-input-has-name-attribute');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
});

const MESSAGE_SUFFIX = `
 - ブラウザの自動補完が有効化されるなどのメリットがあります
 - より多くのブラウザが自動補完を行える可能性を上げるため、\"/^[a-zA-Z0-9_\\[\\]]+$/\"にmatchするフォーマットで命名してください`
const MESSAGE_RADIO_SUFFIX = `
 - 適切に指定することで同じname属性を指定したinput[radio]とグループが確立され、適切なキーボード操作を行えるようになります${MESSAGE_SUFFIX}`

ruleTester.run('a11y-input-has-name-attribute', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: 'const HogeInput = styled.input``' },
    { code: 'const HogeInput = styled(Input)``' },
    { code: 'const HogeRadioButton = styled(RadioButton)``' },
    { code: 'const HogeSelect = styled(Select)``' },
    { code: 'const HogeSelect = styled.select``' },
    { code: 'const HogeTextarea = styled(Textarea)``' },
    { code: 'const HogeTextarea = styled.textarea``' },
    { code: '<input type="radio" name="hoge" />' },
    { code: '<HogeInput type="radio" name="hoge" />' },
    { code: '<HogeRadioButton name="hoge" />' },
    { code: '<textarea name="hoge" />' },
    { code: '<HogeTextarea name="hoge" />' },
    { code: '<select name="hoge" />' },
    { code: '<Select name="hoge[0][Fuga]" />' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: 'const Hoge = styled.input``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.Input``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(RadioButton)``', errors: [ { message: `Hogeを正規表現 "/RadioButton$/" がmatchする名称に変更してください` } ] },
    { code: '<input />', errors: [ { message: `input にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<input type="date" />', errors: [ { message: `input にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<Input type="checkbox" />', errors: [ { message: `Input にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<input type="radio" />', errors: [ { message: `input にグループとなる他のinput[radio]と同じname属性を指定してください${MESSAGE_RADIO_SUFFIX}` } ] },
    { code: '<HogeInput type="radio" />', errors: [ { message: `HogeInput にグループとなる他のinput[radio]と同じname属性を指定してください${MESSAGE_RADIO_SUFFIX}` } ] },
    { code: '<HogeInput type="text" />', errors: [ { message: `HogeInput にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<HogeRadioButton />', errors: [ { message: `HogeRadioButton にグループとなる他のinput[radio]と同じname属性を指定してください${MESSAGE_RADIO_SUFFIX}` } ] },
    { code: '<select />', errors: [ { message: `select にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<HogeSelect />', errors: [ { message: `HogeSelect にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<textarea />', errors: [ { message: `textarea にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<HogeTextarea />', errors: [ { message: `HogeTextarea にname属性を指定してください${MESSAGE_SUFFIX}` } ] },
    { code: '<input type="radio" name="ほげ" />', errors: [ { message: 'input のname属性の値(ほげ)はブラウザの自動補完が適切に行えない可能性があるため"/^[a-zA-Z0-9_\\[\\]]+$/"にmatchするフォーマットで命名してください' } ] },
    { code: '<select name="hoge[fuga][0][あいうえお]" />', errors: [ { message: 'select のname属性の値(hoge[fuga][0][あいうえお])はブラウザの自動補完が適切に行えない可能性があるため"/^[a-zA-Z0-9_\\[\\]]+$/"にmatchするフォーマットで命名してください' } ] },
  ],
});
