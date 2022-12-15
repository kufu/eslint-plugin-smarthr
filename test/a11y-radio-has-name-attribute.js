const rule = require('../rules/a11y-radio-has-name-attribute');
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

ruleTester.run('a11y-radio-has-name-attribute', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: 'const HogeInput = styled.input``' },
    { code: 'const HogeInput = styled(Input)``' },
    { code: 'const HogeRadioButton = styled(RadioButton)``' },
    { code: '<input type="radio" name="hoge" />' },
    { code: '<HogeInput type="radio" name="hoge" />' },
    { code: '<HogeRadioButton name="hoge" />' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`" } ] },
    { code: 'const Hoge = styled.input``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.Input``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(RadioButton)``', errors: [ { message: `Hogeを正規表現 "/RadioButton$/" がmatchする名称に変更してください` } ] },
    { code: '<input type="radio" />', errors: [ { message: 'ラジオボタンにはname属性を指定してください。' } ] },
    { code: '<HogeInput type="radio" />', errors: [ { message: 'ラジオボタンにはname属性を指定してください。' } ] },
    { code: '<HogeRadioButton />', errors: [ { message: 'ラジオボタンにはname属性を指定してください。' } ] },
  ],
});
