# smarthr/a11y-clickable-element-has-text

- ButtonやAnchor,Link コンポーネントにテキスト要素が設定されていない場合、スクリーンリーダーで押したものが何だったのかわからない等の問題が発生する可能性を防ぐルールです
- a要素やbutton要素の中身にtextがあることを担保するルール
- 画像要素の場合は `visuallyHiddenText`や `alt`等代替テキストを設定する
- SVGの場合はrole="img" と aria-labelを設定する
- linkとかanchorのchildrenを含まない要素はチェックしない
  - 例） `<YyyAnchor />`

## rules

```js
{
  rules: {
    'smarthr/a11y-clickable-element-has-text': [
      'error', // 'warn', 'off'
      // {
      //   componentsWithText: ['AnyComponentName'],
      // },
    ]
  },
}
```

## ❌ Incorrect

```jsx
<XxxAnchor>
  <Xxx />
</XxxAnchor>
```

```jsx
<XxxLink>
  <Yyy />
</XxxLink>
```

```jsx
<XxxButton>
  <Zzz />
</XxxButton>
```

```jsx
<XxxAnchor>>
  <XxxTextYyyy />
</XxxAnchor>
```

## ✅ Correct

```jsx
<XxxAnchor>
  Hoge
</XxxAnchor>
```
```jsx
<XxxLink>
  <YyyIcon />
  Fuga
</XxxLink>
```
```jsx
<XxxAnchor>>
  <YyyIcon visuallyHiddenText="hoge" />
</XxxAnchor>
```
```jsx
<XxxButton>
  <YyyImage alt="fuga" />
</XxxButton>
```

```jsx
<YyyAnchor />
```

```jsx
<XxxAnchor>>
  <XxxText />
</XxxAnchor>
```

```jsx
/*
rules: {
  'smarthr/a11y-clickable-element-has-text': [
    'error',
    {
      componentsWithText: ['Hoge'],
    },
  ]
},
*/

<XxxButton>
  <Hoge />
</XxxButton>
```
