const rule = require('../rules/a11y-input-in-form-control')
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

const noLabeledInput = (name) => `${name} を、smarthr-ui/FormControl もしくはそれを拡張したコンポーネントが囲むようマークアップを変更してください。
 - FormControlで入力要素を囲むことでラベルと入力要素が適切に紐づき、操作性が高まります
 - ${name}が入力要素とラベル・タイトル・説明など含む概念を表示するコンポーネントの場合、コンポーネント名を/((FormGroup)$|(FormControl)$|((F|^f)ieldset)$)/とマッチするように修正してください
 - ${name}が入力要素自体を表現するコンポーネントの一部である場合、ルートとなるコンポーネントの名称を/((I|^i)nput$|SearchInput$|(T|^t)extarea$|(S|^s)elect$|InputFile$|Combo(b|B)ox$|DatePicker$|RadioButton$|RadioButtonPanel$|Check(B|b)ox$)/とマッチするように修正してください
 - 上記のいずれの方法も適切では場合、${name}のtitle属性に "どんな値を入力すれば良いのか" の説明を設定してください
   - 例: <${name} title="姓を全角カタカナのみで入力してください" />`
const noLabeledSelect = (name) => `${name} を、smarthr-ui/FormControl もしくはそれを拡張したコンポーネントが囲むようマークアップを変更してください。
 - FormControlで入力要素を囲むことでラベルと入力要素が適切に紐づき、操作性が高まります
 - ${name}が入力要素とラベル・タイトル・説明など含む概念を表示するコンポーネントの場合、コンポーネント名を/((FormGroup)$|(FormControl)$|((F|^f)ieldset)$)/とマッチするように修正してください
 - ${name}が入力要素自体を表現するコンポーネントの一部である場合、ルートとなるコンポーネントの名称を/((I|^i)nput$|SearchInput$|(T|^t)extarea$|(S|^s)elect$|InputFile$|Combo(b|B)ox$|DatePicker$|RadioButton$|RadioButtonPanel$|Check(B|b)ox$)/とマッチするように修正してください
 - 上記のいずれの方法も適切では場合、${name}のtitle属性に "どんな値を選択すれば良いのか" の説明を設定してください
   - 例: <${name} title="検索対象を選択してください" />`
const invalidPureCheckboxInFormControl = (name) => `HogeFormControl が ${name} を含んでいます。smarthr-ui/FormControl を smarthr-ui/Fieldset に変更し、正しくグルーピングされるように修正してください。
 - 可能なら${name}はsmarthr-ui/Checkboxへの変更を検討してください。難しい場合は ${name} と結びつくlabel要素が必ず存在するよう、マークアップする必要があることに注意してください。`
const invalidCheckboxInFormControl = (name) => `HogeFormControl が ${name} を含んでいます。smarthr-ui/FormControl を smarthr-ui/Fieldset に変更し、正しくグルーピングされるように修正してください。`
const invalidPureRadioInFormControl = (name) => `HogeFormControl が ${name} を含んでいます。smarthr-ui/FormControl を smarthr-ui/Fieldset に変更し、正しくグルーピングされるように修正してください。
 - Fieldsetで同じname属性のラジオボタン全てを囲むことで正しくグループ化され、適切なタイトル・説明を追加出来ます
 - 可能なら${name}はsmarthr-ui/RadioButton、smarthr-ui/RadioButtonPanelへの変更を検討してください。難しい場合は ${name} と結びつくlabel要素が必ず存在するよう、マークアップする必要があることに注意してください。`
const invalidRadioInFormControl = (name) => `HogeFormControl が ${name} を含んでいます。smarthr-ui/FormControl を smarthr-ui/Fieldset に変更し、正しくグルーピングされるように修正してください。
 - Fieldsetで同じname属性のラジオボタン全てを囲むことで正しくグループ化され、適切なタイトル・説明を追加出来ます`
const invalidMultiInputsInFormControl = () => `HogeFormControl が複数の入力要素を含んでいます。ラベルと入力要素の紐づけが正しく行われない可能性があるため、以下の方法のいずれかで修正してください。
 - 方法1: 入力要素ごとにラベルを設定できる場合、HogeFormControlをsmarthr-ui/Fieldset、もしくはそれを拡張したコンポーネントに変更した上で、入力要素を一つずつsmarthr-ui/FormControlで囲むようにマークアップを変更してください
 - 方法2: 郵便番号や電話番号など、本来一つの概念の入力要素を分割して複数の入力要素にしている場合、一つの入力要素にまとめることを検討してください
   - コピーアンドペーストがしやすくなる、ブラウザの自動補完などがより適切に反映されるなど多大なメリットがあります
 - 方法3: HogeFormControl が smarthr-ui/FormControl、もしくはそれを拡張しているコンポーネントではない場合、名称を /((FormGroup)$|(FormControl)$|((F|^f)ieldset)$)/ にマッチしないものに変更してください
 - 方法4: 上記方法のいずれも対応出来ない場合、HogeFormControl に 'role="group"' 属性を設定してください`
const noLabeledInputInFieldset = (name) => `HogeFieldset が ラベルを持たない入力要素(${name})を含んでいます。入力要素が何であるかを正しく伝えるため、以下の方法のいずれかで修正してください。
 - 方法1: HogeFieldset を smarthr-ui/FormControl、もしくはそれを拡張したコンポーネントに変更してください
 - 方法2: ${name} がlabel要素を含むコンポーネントである場合、名称を/(Form(Control|Group))$/にマッチするものに変更してください
   - smarthr-ui/FormControl、smarthr-ui/FormGroup はlabel要素を内包しています
 - 方法3: ${name} がRadioButton、もしくはCheckboxを表すコンポーネントの場合、名称を/(RadioButton$|RadioButtonPanel$|Check(B|b)ox$)/にマッチするものに変更してください
   - smarthr-ui/RadioButton、smarthr-ui/RadioButtonPanel、smarthr-ui/Checkbox はlabel要素を内包しています
 - 方法4: HogeFieldset が smarthr-ui/Fieldset、もしくはそれを拡張しているコンポーネントではない場合、名称を /Fieldset$/ にマッチしないものに変更してください
 - 方法5: 上記のいずれの方法も適切では場合、${name}のtitle属性に "どんな値を入力すれば良いのか" の説明を設定してください
   - 例: <${name} title="姓を全角カタカナのみで入力してください" />`
const noLabeledInputInFieldsetWithSelect = (name) => `HogeFieldset が ラベルを持たない入力要素(${name})を含んでいます。入力要素が何であるかを正しく伝えるため、以下の方法のいずれかで修正してください。
 - 方法1: HogeFieldset を smarthr-ui/FormControl、もしくはそれを拡張したコンポーネントに変更してください
 - 方法2: ${name} がlabel要素を含むコンポーネントである場合、名称を/(Form(Control|Group))$/にマッチするものに変更してください
   - smarthr-ui/FormControl、smarthr-ui/FormGroup はlabel要素を内包しています
 - 方法3: ${name} がRadioButton、もしくはCheckboxを表すコンポーネントの場合、名称を/(RadioButton$|RadioButtonPanel$|Check(B|b)ox$)/にマッチするものに変更してください
   - smarthr-ui/RadioButton、smarthr-ui/RadioButtonPanel、smarthr-ui/Checkbox はlabel要素を内包しています
 - 方法4: HogeFieldset が smarthr-ui/Fieldset、もしくはそれを拡張しているコンポーネントではない場合、名称を /Fieldset$/ にマッチしないものに変更してください
 - 方法5: 上記のいずれの方法も適切では場合、${name}のtitle属性に "どんな値を選択すれば良いのか" の説明を設定してください
   - 例: <${name} title="検索対象を選択してください" />`
const useFormControlInsteadOfSection = (name, section) => `${name}は${section}より先に、smarthr-ui/FormControlが入力要素を囲むようマークアップを以下のいずれかの方法で変更してください。
 - 方法1: ${section} をFormControl、もしくはそれを拡張したコンポーネントに変更してください
   - ${section} 内のHeading要素はFormControlのtitle属性に変更してください
 - 方法2: ${section} と ${name} の間に FormControl が存在するようにマークアップを変更してください
 - 方法3: 上記のいずれの方法も適切では場合、${name}のtitle属性に "どんな値を入力すれば良いのか" の説明を設定してください
   - 例: <${name} title="姓を全角カタカナのみで入力してください" />`
const useFormControlInsteadOfSectionInRadio = (name, section) => `${name}は${section}より先に、smarthr-ui/Fieldsetが入力要素を囲むようマークアップを以下のいずれかの方法で変更してください。
 - 方法1: ${section} をFieldset、もしくはそれを拡張したコンポーネントに変更してください
   - ${section} 内のHeading要素はFieldsetのtitle属性に変更してください
 - 方法2: ${section} と ${name} の間に Fieldset が存在するようにマークアップを変更してください`
const invalidFieldsetHasRoleGroup = (fieldset, base) => `${fieldset}に 'role="group" が設定されています。${base} をつかってマークアップする場合、'role="group"' は不要です
 - ${fieldset} が ${base}、もしくはそれを拡張しているコンポーネントではない場合、名称を /((FormGroup)$|(FormControl)$|((F|^f)ieldset)$)/ にマッチしないものに変更してください`
const invalidChildreninFormControl = (children) => `FormControl が、${children} を子要素として持っており、マークアップとして正しくない状態になっています。以下のいずれかの方法で修正を試みてください。
 - 方法1: 親要素であるFormControlをsmarthr-ui/FormControl、もしくはそれを拡張していないコンポーネントでマークアップしてください
   - FormControlではなく、smarthr-ui/Fieldset、もしくはsmarthr-ui/Section + smarthr-ui/Heading などでのマークアップを検討してください
 - 方法2: 親要素であるFormControlがsmarthr-ui/FormControlを拡張したコンポーネントではない場合、コンポーネント名を/(Form(Control|Group))$/と一致しない名称に変更してください`
const requireMultiInputInFormControlWithRoleGroup = () => `HogeFormControl内に入力要素が2個以上存在しないため、'role=\"group\"'を削除してください。'role=\"group\"'は複数の入力要素を一つのグループとして扱うための属性です。
 - HogeFormControl内に2つ以上の入力要素が存在する場合、入力要素を含むコンポーネント名全てを/((I|^i)nput$|SearchInput$|(T|^t)extarea$|(S|^s)elect$|InputFile$|Combo(b|B)ox$|DatePicker$|RadioButton$|RadioButtonPanel$|Check(B|b)ox$)/、もしくは/((FormGroup)$|(FormControl)$|((F|^f)ieldset)$)/にマッチする名称に変更してください`

ruleTester.run('a11y-input-in-form-control', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: `import { HogeAInput as FugaInput } from './hoge'` },
    { code: `import { Textarea as HogeTextarea } from './hoge'` },
    { code: 'const HogeInput = styled.input``' },
    { code: 'const HogeTextarea = styled.textarea``' },
    { code: 'const HogeSelect = styled(Select)``' },
    { code: 'const HogeRadioButton = styled(FugaRadioButton)``' },
    { code: 'const HogeRadioButtonPanel = styled(FugaRadioButtonPanel)``' },
    { code: 'const HogeCheckBox = styled(FugaCheckbox)``' },
    { code: 'const DatePicker = styled(AnyDatePicker)``' },
    { code: '<input title="any"/>' },
    { code: '<HogeInput title="any"/>' },
    { code: '<textarea title="any"/>' },
    { code: '<HogeTextarea title="any"/>' },
    { code: '<select title="any"/>' },
    { code: '<HogeSelect title="any"/>' },
    { code: '<HogeInputFile title="any"/>' },
    { code: '<HogeComboBox title="any"/>' },
    { code: '<HogeDatePicker title="any"/>' },
    { code: '<HogeFormGroup />' },
    { code: '<HogeFormControl />' },
    { code: '<HogeFieldset />' },
    { code: '<HogeFormGroup><input /></HogeFormGroup>' },
    { code: '<HogeFormGroup><input title="any" /></HogeFormGroup>' },
    { code: '<HogeFormGroup><Input type="checkbox" /></HogeFormGroup>' },
    { code: '<HogeFormGroup><CheckBox /></HogeFormGroup>' },
    { code: '<HogeFormControl><HogeSelect /></HogeFormControl>' },
    { code: '<HogeFormControl><HogeComboBox title="any" /></HogeFormControl>' },
    { code: '<HogeFieldset><Input type="checkbox" /><Input type="checkbox" /></HogeFieldset>' },
    { code: '<HogeFieldset><HogeCheckBox /><HogeCheckBox /></HogeFieldset>' },
    { code: '<HogeFieldset><input type="radio" /></HogeFieldset>' },
    { code: '<HogeFieldset><RadioButton /></HogeFieldset>' },
    { code: '<HogeFieldset><HogeRadioButtonPanel /></HogeFieldset>' },
    { code: '<HogeFormControl role="group"><HogeInput /><HogeSelect /></HogeFormControl>' },
    { code: '<FugaSection><HogeFormControl><HogeInput /></HogeFormControl></FugaSection>' },
    { code: '<Stack as="section"><HogeFormControl><HogeInput /></HogeFormControl></Stack>' },
    { code: `const AnyComboBox = () => <input />` },
    { code: `<Fieldset><HogeFieldset /><HogeFormControl /></Fieldset>` },
    { code: '<HogeFieldset><HogeCheckBox /><HogeInput id="any" /></HogeFieldset>' },
    { code: '<FugaSection><HogeInput id="any" /></FugaSection>' },
    { code: '<HogeTextarea id="any" />' },
    { code: '<HogeFieldset><HogeCheckBox /><HogeInput title="any" /></HogeFieldset>' },
    { code: '<FugaSection><HogeInput title="any" /></FugaSection>' },
    { code: '<HogeTextarea title="any" />' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { ComboBox as ComboBoxHoge } from './hoge'`, errors: [ { message: `ComboBoxHogeを正規表現 "/(ComboBox)$/" がmatchする名称に変更してください。
 - ComboBoxが型の場合、'import type { ComboBox as ComboBoxHoge }' もしくは 'import { type ComboBox as ComboBoxHoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: 'const RadioButton = styled(FugaRadioButtonPanel)``', errors: [
      { message: `RadioButtonを正規表現 "/(RadioButtonPanel)$/" がmatchする名称に変更してください。` },
      { message: `RadioButton は /RadioButton$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - RadioButton の名称の末尾が"RadioButton" という文字列ではない状態にしつつ、"FugaRadioButtonPanel"を継承していることをわかる名称に変更してください
 - もしくは"FugaRadioButtonPanel"を"RadioButton"の継承元であることがわかるような名称に変更するか、適切な別コンポーネントに差し替えてください
   - 修正例1: const Xxxx = styled(FugaRadioButtonPanel)
   - 修正例2: const RadioButtonXxxx = styled(FugaRadioButtonPanel)
   - 修正例3: const RadioButton = styled(XxxxRadioButton)` } ] },
    { code: `<input />`, errors: [ { message: noLabeledInput('input') } ] },
    { code: `<HogeInput />`, errors: [ { message: noLabeledInput('HogeInput') } ] },
    { code: '<textarea />', errors: [ { message: noLabeledInput('textarea') } ] },
    { code: '<HogeTextarea />', errors: [ { message: noLabeledInput('HogeTextarea') } ] },
    { code: '<select />', errors: [ { message: noLabeledSelect('select') } ] },
    { code: '<HogeSelect />', errors: [ { message: noLabeledSelect('HogeSelect') } ] },
    { code: '<HogeInputFile />', errors: [ { message: noLabeledInput('HogeInputFile') } ] },
    { code: '<HogeComboBox />', errors: [ { message: noLabeledInput('HogeComboBox') } ] },
    { code: '<HogeDatePicker />', errors: [ { message: noLabeledInput('HogeDatePicker') } ] },
    { code: '<HogeFormControl><Input type="checkbox" /><Input type="checkbox" /></HogeFormControl>', errors: [ { message: invalidPureCheckboxInFormControl('Input') } ] },
    { code: '<HogeFormControl><HogeCheckBox /><Input /></HogeFormControl>', errors: [ { message: invalidMultiInputsInFormControl() } ] },
    { code: '<HogeFormControl><HogeCheckBox /><HogeCheckBox /></HogeFormControl>', errors: [ { message: invalidCheckboxInFormControl('HogeCheckBox') } ] },
    { code: '<HogeFormControl><input type="radio" /></HogeFormControl>', errors: [ { message: invalidPureRadioInFormControl('input') } ] },
    { code: '<HogeFormControl><RadioButton /></HogeFormControl>', errors: [ { message: invalidRadioInFormControl('RadioButton') } ] },
    { code: '<HogeFormControl><HogeRadioButtonPanel /></HogeFormControl>', errors: [ { message: invalidRadioInFormControl('HogeRadioButtonPanel') } ] },
    { code: '<HogeFieldset><HogeCheckBox /><HogeInput /></HogeFieldset>', errors: [ { message: noLabeledInputInFieldset('HogeInput') } ] },
    { code: '<HogeFieldset><HogeCheckBox /><HogeSelect /></HogeFieldset>', errors: [ { message: noLabeledInputInFieldsetWithSelect('HogeSelect') } ] },
    { code: '<FugaSection><HogeInput /></FugaSection>', errors: [ { message: useFormControlInsteadOfSection('HogeInput', 'FugaSection') } ] },
    { code: '<Stack as="section"><HogeInput /></Stack>', errors: [ { message: useFormControlInsteadOfSection('HogeInput', '<Stack as="section">') } ] },
    { code: '<Center forwardedAs="aside"><HogeInput /></Center>', errors: [ { message: useFormControlInsteadOfSection('HogeInput', '<Center forwardedAs="aside">') } ] },
    { code: '<FugaSection><HogeRadioButton /></FugaSection>', errors: [ { message: useFormControlInsteadOfSectionInRadio('HogeRadioButton', 'FugaSection') } ] },
    { code: `const AnyHoge = () => <input />`, errors: [ { message: noLabeledInput('input') } ] },
    { code: '<HogeFieldset role="group"><HogeFormControl /><HogeRadioButton /></HogeFieldset>', errors: [ { message: invalidFieldsetHasRoleGroup('HogeFieldset', 'smarthr-ui/Fieldset') } ] },
    { code: '<fieldset role="group"><HogeFormControl /><HogeRadioButton /></fieldset>', errors: [ { message: invalidFieldsetHasRoleGroup('fieldset', 'fieldset') } ] },
    { code: '<FormControl><HogeFieldset /></FormControl>', errors: [ { message: invalidChildreninFormControl('HogeFieldset') } ] },
    { code: '<FormControl><HogeFormControl /></FormControl>', errors: [ { message: invalidChildreninFormControl('HogeFormControl') } ] },
    { code: '<HogeFormControl role="group"><HogeInput /></HogeFormControl>', errors: [ { message: requireMultiInputInFormControlWithRoleGroup() } ] },
  ]
})
