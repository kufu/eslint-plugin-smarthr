# smarthr/jsx-start-with-spread-attributes

- jsxを記述する際、意図しない属性の上書きを防ぐため、spread-attributesを先に指定するように強制するruleです
- eslint を `--fix` オプション付きで実行する際、 fix option を true にすると自動修正します

## rules

```js
{
  rules: {
    'smarthr/jsx-start-with-spread-attributes': [
      'error', // 'warn', 'off'
      {
        fix: false, // true
      },
    ]
  },
}
```

## ❌ Incorrect

```jsx
<AnyComponent hoge="hoge" {...props} />
```

## ✅ Correct

```jsx
<AnyComponent {...props} hoge="hoge" />
```
