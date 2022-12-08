# smarthr/trim-props

- このルールはCLIオプションの`--fix`で自動的に修正可能です
- 文字列型のpropsについて、先頭末尾に空白文字を含む文字列の設定を禁止させたい場合に利用します

## rules

```js
{
  rules: {
    'smarthr/trim-props': 'error', // 'warn', 'off',
  },
}
```

## ❌ Incorrect

```jsx
<a href=" https://www.google.com">google</a>
<img src={"/sample.jpg "} alt={" sample "} />
<div data-spec=" info-area ">....</div>
```

## ✅ Correct

```jsx
<a href="https://www.google.com">google</a>
<img src={"/sample.jpg"} alt={"sample"} />
<div data-spec="info-area">....</div>
```
