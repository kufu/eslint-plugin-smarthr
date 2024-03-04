# smarthr/a11y-delegate-element-has-role-presentation

- 'role="presentation"'を適切に設定することを促すルールです
- インタラクティブな要素に対して'role="presentation"'が設定されている場合、エラーになります
  - インタラクティブな要素とは form, inputなどの入力要素、button, a などのクリッカブルな要素を指します
- インタラクティブな要素から発生するイベントを親要素でキャッチする場合、親要素に 'role="presentation"' を設定することを促します
  - インタラクティブではない要素でイベントをキャッチしており、かつ'role="presentation"'を設定しているにも関わらず、子要素にインタラクティブな要素がない場合はエラーになります
- additionalInteractiveComponentRegexオプションに独自コンポーネントの名称を正規表現で設定することで、インタラクティブな要素として判定することが可能です

## rules

```js
{
  rules: {
    'smarthr/a11y-delegate-element-has-role-presentation': [
      'error', // 'warn', 'off'
      // { additionalInteractiveComponentRegex: ['^InteractiveComponent%'] }
    ]
  },
}
```

## ❌ Incorrect

```jsx
// インタラクティブな要素に対して role="presentation" は設定できない
<Button role="presentation">text.</Button>
<input type="text" role="presentation" />

// インタラクティブな要素で発生するイベントを非インタラクティブな要素でキャッチする場合
// role="presentation" を設定する必要がある
<div onClick={hoge}>
  <Button>text.</Button>
</div>

// 非インタラクティブな要素でイベントをキャッチする場合、
// 子要素にインタラクティブな要素がない場合はエラー
<div onClick={hoge} role="presentation">
  <Text>hoge.</Text>
</div>
```

## ✅ Correct

```jsx
// インタラクティブな要素で発生するイベントを非インタラクティブな要素でキャッチする場合
// role="presentation" を設定する
<div onClick={hoge} role="presentation">
  <Button>text.</Button>
</div>

<div onClick={hoge} role="presentation">
  <AnyForm />
</div>
```
