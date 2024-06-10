# smarthr/best-practice-for-data-test-attribute

- テスト用の `data-spec` と `data-testid` 属性の利用を控え、代替手段の検討を推奨するルールです。
- `data-spec` 等の利用を控えることで、テスト環境標準のメソッドを利用することでアクセシビリティのテストも同時に行えるためテストコードの価値が高まります。

## rules

```js
{
  rules: {
    'smarthr/best-practice-for-data-test-attribute': 'warn', // 'error', 'off'
  },
}
```

## ❌ Incorrect

```jsx
<Any data-spec="hoge">ほげ</Any>
```

```jsx
<Any data-testid="hoge">ほげ</Any>
```

## ✅ Correct

```jsx
<Any data-hoge="true">...</Any>
```

```jsx
<Any>...</Any>
```
