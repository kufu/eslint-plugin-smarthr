# smarthr/a11y-prohibit-input-placeholder

- input や textarea などの入力要素に対して placeholder を設定することを禁止するルールです
  - placeholder は入力要素に値を設定すると閲覧が不可能になるため、アクセシビリティの観点からは基本的に非推奨です
- Tooltip や 別途ヒント用の要素を作成し、そちらを表示することで基本的にユーザーが閲覧する必要のあるタイミングで常に見ることができるようにしてください

## rules

```js
{
  rules: {
    'smarthr/a11y-prohibit-input-placeholder': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
<Input placeholder="hoge" />
```
```jsx
<CustomTextarea placeholder="hoge" />
```

## ✅ Correct

```jsx
<CustomInput tooltip="hoge" />
```
```jsx
<Wrapper>
  <Textarea />
  <Hint>hoge</Hint>
</Wrapper>
```
