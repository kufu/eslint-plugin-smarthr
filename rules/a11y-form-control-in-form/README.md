# smarthr/a11y-form-control-in-form

- fieldset, Fieldset, FormControl を利用する場合、form要素で囲むことを促すルールです
- form要素で囲むことで以下のようなメリットがあります
  - 適切にマークアップできるようになり、フォームの範囲などがスクリーンリーダーに正しく伝わる
  - 入力要素にfocusした状態でEnterを押せばフォームをsubmitできる
  - inputのrequired属性、pattern属性を利用した入力チェックをブラウザの機能として実行できる
- smarthr/a11y-input-in-form-control と組み合わせることでより厳密なフォームのマークアップを行えます


## rules

```js
{
  rules: {
    'smarthr/a11y-form-control-in-form': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
// formで囲まれていないためNG
const AnyComponent = <>
  <FormControl />
  <HogeFieldset />
  <fieldset />
</>
```

## ✅ Correct

```jsx
// formで囲まれているためOK
const AnyComponent = <StyledForm>
  <FormControl />
  <HogeFieldset />
  <fieldset />
</StyledForm>
const AnyComponent = <Hoge as="form">
  <FormControl />
  <HogeFieldset />
  <fieldset />
</Hoge>
const AnyComponent = <Hoge forwardedAs="form">
  <FormControl />
  <HogeFieldset />
  <fieldset />
</Hoge>

// Dialogの場合、FormDialog・RemoteTriggerFormDialogで囲めばOK
const AnyComponent = <FormDialog>
  <FugaFormControl />
</FormDialog>
const AnyComponent = <RemoteTriggerAnyFormDialog>
  <FugaFormControl />
</RemoteTriggerAnyFormDialog>

// 対象のFormControl、Fieldsetがコンポーネントの一要素であり、その親コンポーネント名がFormControl、もしくはFieldsetの場合OK
const AnyFormControl = <>
  <StyledFormControl />
</>
const AnyFieldset = <>
  <StyledFieldset />
</>
```
