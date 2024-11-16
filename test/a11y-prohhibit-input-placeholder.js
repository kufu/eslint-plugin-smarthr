const rule = require('../rules/a11y-prohibit-input-placeholder')
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
ruleTester.run('a11y-prohibit-input-placeholder', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: `import { Input as HogeInput } from './hoge'` },
    { code: `import { HogeSearchInput as FugaSearchInput } from './hoge'` },
    { code: `import { HogeTextarea as FugaHogeTextarea } from './hoge'` },
    { code: `import { ComboBox as FugaHogeComboBox } from './hoge'` },
    { code: `import { AbcDatePicker as StyledDatePicker } from './hoge'` },
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
    { code: `<DatePicker />` },
    { code: `<TimePicker />` },
    { code: `<CustomSearchInput tooltipMessage="hoge" />` },
    { code: `<CustomSearchInput tooltipMessage="hoge" placeholder="fuga" />` },
    { code: `<ComboBox defaultItem={items[0]} />` },
    { code: `<ComboBox defaultItem={items[0]} dropdownHelpMessage="fuga" />` },
    { code: `<ComboBox placeholder="hoge" dropdownHelpMessage="fuga" />` },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { Input as InputHoge } from './hoge'`, errors: [ { message: `InputHogeを正規表現 "/Input$/" がmatchする名称に変更してください。
 - Inputが型の場合、'import type { Input as InputHoge }' もしくは 'import { type Input as InputHoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { SearchInput as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください。
 - SearchInputが型の場合、'import type { SearchInput as Hoge }' もしくは 'import { type SearchInput as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` }, { message: `Hogeを正規表現 "/SearchInput$/" がmatchする名称に変更してください。
 - SearchInputが型の場合、'import type { SearchInput as Hoge }' もしくは 'import { type SearchInput as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeTextarea as HogeTextareaFuga } from './hoge'`, errors: [ { message: `HogeTextareaFugaを正規表現 "/Textarea$/" がmatchする名称に変更してください。
 - HogeTextareaが型の場合、'import type { HogeTextarea as HogeTextareaFuga }' もしくは 'import { type HogeTextarea as HogeTextareaFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeComboBox as ComboBoxFuga } from './hoge'`, errors: [ { message: `ComboBoxFugaを正規表現 "/ComboBox$/" がmatchする名称に変更してください。
 - HogeComboBoxが型の場合、'import type { HogeComboBox as ComboBoxFuga }' もしくは 'import { type HogeComboBox as ComboBoxFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { DatePicker as HogeDatePickerFuga } from './hoge'`, errors: [ { message: `HogeDatePickerFugaを正規表現 "/DatePicker$/" がmatchする名称に変更してください。
 - DatePickerが型の場合、'import type { DatePicker as HogeDatePickerFuga }' もしくは 'import { type DatePicker as HogeDatePickerFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: 'const Hoge = styled.input``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(StyledInput)``', errors: [ { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.textarea``', errors: [ { message: `Hogeを正規表現 "/Textarea$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(StyledTextarea)``', errors: [ { message: `Hogeを正規表現 "/Textarea$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(FieldSet)``', errors: [ { message: `Hogeを正規表現 "/FieldSet$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(ComboBox)``', errors: [ { message: `Hogeを正規表現 "/ComboBox$/" がmatchする名称に変更してください。` } ] },
    {
      code: 'const Hoge = styled(SearchInput)``',
      errors: [
        { message: `Hogeを正規表現 "/Input$/" がmatchする名称に変更してください。` },
        { message: `Hogeを正規表現 "/SearchInput$/" がmatchする名称に変更してください。` },
      ],
    },
    { code: `<input placeholder />`, errors: [ { message: `input にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><input /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<textarea placeholder="hoge" />`, errors: [ { message: `textarea にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><textarea /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<StyledInput placeholder={any} />`, errors: [ { message: `StyledInput にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><StyledInput /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeTextarea placeholder="any" />`, errors: [ { message: `HogeTextarea にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><HogeTextarea /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeFieldSet placeholder="any" />`, errors: [ { message: `HogeFieldSet にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><HogeFieldSet /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeDatePicker placeholder="any" />`, errors: [ { message: `HogeDatePicker にはplaceholder属性は設定せず、別途ヒント用要素の利用を検討してください。(例: '<div><HogeDatePicker /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<HogeComboBox placeholder="any" />`, errors: [ { message: `HogeComboBox にはplaceholder属性は設定せず、以下のいずれか、もしくは組み合わせての対応を検討してください。
 - 選択肢をどんな値で絞り込めるかの説明をしたい場合は dropdownHelpMessage 属性に変更してください。
 - 空の値の説明のためにplaceholderを利用している場合は defaultItem 属性に変更してください。
 - 上記以外の説明を行いたい場合、ヒント用要素を設置してください。(例: '<div><HogeComboBox /><Hint>ヒント</Hint></div>')` } ] },
    { code: `<SearchInput placeholder="any" />`, errors: [ { message: `SearchInput にはplaceholder属性を単独で利用せず、tooltipMessageオプションのみ、もしくはplaceholderとtooltipMessageの併用を検討してください。 (例: '<SearchInput tooltipMessage="ヒント" />', '<SearchInput tooltipMessage={hint} placeholder={hint} />')` } ] },
    { code: `<ComboBox defaultItem={items[0]} placeholder="any" />`, errors: [ { message: `ComboBox にはdefaultItemが設定されているため、placeholder属性を閲覧出来ません。削除してください。` } ] },
  ]
})
