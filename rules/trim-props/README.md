# smarthr/trim-props

- 文字列型のpropsについて、先頭末尾に空白文字を含む文字列の設定を禁止させたい場合に利用します

## rules

```js
{
  rules: {
    'smarthr/trim-props': [
      'error', // 'warn', 'off'
    ]
  },
}
```

## ❌ Incorrect

```jsx
<a href=" https://www.google.com">google</a>
<a href="https://www.amazon.co.jp ">amazon</a>
<a href=" https://www.facebook.com ">facebook</a>

<a href={" https://www.apple.com"}>apple</a>
<a href={"https://www.microsoft.com "}>microsoft</a>
<a href={" https://smarthr.jp "}>smarthr</a>
```

## ✅ Correct

```jsx
<a href="https://www.google.com">google</a>
<a href="https://www.amazon.co.jp">amazon</a>
<a href="https://www.facebook.com">facebook</a>

<a href={"https://www.apple.com"}>apple</a>
<a href={"https://www.microsoft.com"}>microsoft</a>
<a href={"https://smarthr.jp"}>smarthr</a>
```
