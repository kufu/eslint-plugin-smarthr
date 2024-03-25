# smarthr/best-practice-for-layouts

- smarthr-ui/Layoutsに属するコンポーネントの利用方法をチェックするルールです

## rules

```js
{
  rules: {
    'smarthr/best-practice-for-layouts': 'error', // 'warn', 'off',
  },
}
```

## ❌ Incorrect

```jsx
// 子が複数無いためエラー
<Cluster>
  <Any />
</Cluster>
<StyledStack>
  {flg ? 'a' : 'b'}
</StyledStack>
```

## ✅ Correct

```jsx
// 子が複数あるのでOK
<Cluster>
  <Any />
  <Any />
</Cluster>

<StyledStack>
  {flg ? 'a' : (
    <>
      <Any />
      <Any />
    </>
  )}
</StyledStack>

// Cluster、かつ右寄せをしている場合は子一つでもOK
<Cluster justify="end">
  <Any />
</Cluster>
<Cluster justify="flex-end">
  <Any />
  <Any />
</Cluster>
```
