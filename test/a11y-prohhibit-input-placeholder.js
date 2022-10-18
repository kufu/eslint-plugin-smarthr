const rule = require('../rules/a11y-prohibit-input-placeholder')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

ruleTester.run('a11y-prohibit-input-placeholder', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: 'const HogeInput = styled.input``' },
    { code: 'const HogeTextarea = styled.textarea``' },
    { code: 'const HogeInput = styled(Input)``' },
    { code: 'const HogeInput = styled(StyledInput)``' },
    { code: 'const HogeTextarea = styled(Textarea)``' },
    { code: 'const hoge = styled.fieldset``' },
    { code: 'const HogeFieldSet = styled(FieldSet)``' },
    { code: 'const HogeComboBox = styled(ComboBox)``' },
    { code: 'const HogeSearchInput = styled(SearchInput)``' },
    { code: `<input />` },
    { code: `<textarea />` },
    { code: `<FieldSet />` },
    { code: `<ComboBox />` },
    { code: `<StyledInput />` },
    { code: `<HogeTextarea />` },
    { code: `<FugaFieldSet />` },
    { code: `<CustomComboBox />` },
    { code: `<SearchInput />` },
    { code: `<CustomSearchInput tooltipMessage="hoge" />` },
    { code: `<CustomSearchInput tooltipMessage="hoge" placeholder="fuga" />` },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`" } ] },
    { code: 'const Hoge = styled.input``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(StyledInput)``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.textarea``', errors: [ { message: `Hogeを正規表現 "/Textarea$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(StyledTextarea)``', errors: [ { message: `Hogeを正規表現 "/Textarea$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(FieldSet)``', errors: [ { message: `Hogeを正規表現 "/FieldSet$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(ComboBox)``', errors: [ { message: `Hogeを正規表現 "/ComboBox$/" がmatchする名称に変更してください` } ] },
    { 
      code: 'const Hoge = styled(SearchInput)``',
      errors: [
        { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください` },
        { message: `Hogeを正規表現 "/SearchInput$/" がmatchする名称に変更してください` },
      ],
    },
    { code: `<input placeholder />`, errors: [ { message: `input にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><input /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<textarea placeholder="hoge" />`, errors: [ { message: `textarea にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><textarea /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<StyledInput placeholder={any} />`, errors: [ { message: `StyledInput にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><StyledInput /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeTextarea placeholder="any" />`, errors: [ { message: `HogeTextarea にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><HogeTextarea /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeFieldSet placeholder="any" />`, errors: [ { message: `HogeFieldSet にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><HogeFieldSet /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeComboBox placeholder="any" />`, errors: [ { message: `HogeComboBox にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><HogeComboBox /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<SearchInput placeholder="any" />`, errors: [ { message: `SearchInput にはplaceholder属性を単独で利用せず、tooltipMessageオプションのみ、もしくはplaceholderとtooltipMessageの併用を検討してください。 (例: '<SearchInput tooltipMessage="ヒント" />', '<SearchInput tooltipMessage={hint} placeholder={hint} />')` } ] },
  ]
})
