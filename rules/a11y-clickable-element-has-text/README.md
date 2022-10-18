# smarthr/a11y-clickable-element-has-text

- ButtonやAnchor,Link コンポーネントにテキスト要素が設定されていない場合、アクセシビリティの問題が発生する可能性を防ぐルールです

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
<YyyAnchoor />
```

```jsx
/*
rules: {
  'smarthr/a11y-clickable-element-has-text': [
    'error',
    {
      componentsWithText: ['AnyComponent'],
    },
  ]
},
*/

<XxxButton>
  <AnyComponent />
</XxxButton>
```
