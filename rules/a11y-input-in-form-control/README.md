# smarthr/a11y-input-in-form-control

- 入力要素をsmarthr-ui/FormControl、もしくはsmarthr-ui/Fieldsetで囲むことを促すルールです
  - SectioningContent + Heading でのマークアップではなく、FormControl・Fieldsetを使うように促します
  - FormControl・Fieldsetを使うことでlabelと入力要素が適切に紐づいたり、RadioButtonなどが適切にグルーピングされるようになり、アクセシビリティ的メリットが得られます

## rules

```js
{
  rules: {
    'smarthr/a11y-input-in-form-control': [
      'error', // 'warn', 'off',
      // {
      //   additionalInputComponents: ['^HogeSelector$'], // 単一の入力要素として扱いたいコンポーネント名を正規表現で入力する
      //   additionalMultiInputComponents: ['Inputs$'], // 複数の入力要素として扱いたいコンポーネント名を正規表現で入力する
      // }
    ]
  },
}
```

## ❌ Incorrect

```jsx
// FormControlで囲まれていないためNG
<Input />

// FormControl・FieldsetではなくSectionでマークアップされているためNG
<Section>
  <Heading />
  <Select />
</Section>

// RadioButton, CheckBoxはFieldsetでグルーピングする必要があるためNG
<FormControl title="any heading">
  <RadioButton>{a.label}</RadioButton>
</FormControl>

// FormControlが複数の入力要素を持ってしまっているのでNG
<FormControl title="any heading">
  <Input />
  <ComboBox />
</FormControl>


// FormControlがネストしてしまっているのでNG
<FormControl>
  <SubFormControl>
    <CheckBox />
  </SubFormControl>
</FormControl>


// Fieldsetには role="group" がデフォルトで設定されているのでNG
<Fieldset  role="group" />
```

## ✅ Correct

```jsx
<FormControl title="any heading">
  <Input />
</FormControl>

<Fieldset title="any heading">
  {radios.map((a) => (
    <RadioButton>{a.label}</RadioButton>
  ))}
</Fieldset>

<FormControl title="any heading" role="group">
  <DatePicker />
  ~
  <DatePicker />
</Fieldset>

<Fieldset title="any heading">
  <FormControl role="group">
    <DatePicker />
    ~
    <DatePicker />
  </FormControl>>
</Fieldset>

// childrenを持たないFieldset、FormControlは入力要素として扱うためOK
<Fieldset title="any heading">
  <HogeFieldset />
  <FugaFormControl />
</Fieldset>

// Sectionより先にFormControl・Fieldsetで囲んでいるためOK
<Section>
  <Heading />
  <FormControl title="any heading">
    <Input />
  </FormControl>
</Section>

// smarthr-ui/CheckBox はlabelを含むため、なんの入力要素かが単独で伝えられるので
// FormControl・Fieldsetで囲む必要はない (囲んでも問題はない)
<CheckBox />
```
