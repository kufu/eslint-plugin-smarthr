# smarthr/a11y-prohibit-input-maxlength-attribute

- input, textarea 要素に maxLength 属性を設定することを禁止するルールです
  - maxLength属性がついた要素に、テキストをペーストすると、maxLength属性の値を超えた範囲が意図せず切り捨てられてしまう場合があります。
- maxLength 属性ではなく、pattern 属性と title 属性を組み合わせて form 要素でラップすることで、入力時でなく、submit 時にバリデーションすることができます。

## rules

```js
{
  rules: {
    'smarthr/a11y-prohibit-input-maxlength-attribute': [
      'error', // 'warn', 'off'
    ]
  },
}
```

## ❌ Incorrect

```jsx
<input maxLength={30} />
<XxxInput maxLength={40} />
<textarea maxLength={50} />
<XxxTextarea maxLength={60} />
```

## ✅ Correct

```jsx
<input />
<XxxInput />
<textarea />
<XxxTextarea />
```
