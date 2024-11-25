# smarthr/a11y-required-layout-as-attribute

- smarthr-ui/Layoutに属するコンポーネントはデフォルトではdiv要素を出力します
- そのため他の一部コンポーネントとの組み合わせによってはinvalidなマークアップになる場合が起こり得ます
  - 例: FormControlのtitle属性内でClusterを使うと `label > div` の構造になるためinvalid
- 対象コンポーネントの使用方法をチェックし、適切なマークアップになるよう、as・forwardedAs属性の利用を促します

## rules

```js
{
  rules: {
    'smarthr/a11y-required-layout-as-attribute': [
      'error', // 'warn', 'off'
    ]
  },
}
```

## ❌ Incorrect

```jsx
<Heading>
  <Cluster>any</Cluster>
</Heading>

<HogeFormControl title={
  <FugaCluster>any</FugaCluster>
} />

<StyledFieldset title={
  <Cluster>any</Cluster>
}>
  // any
</StyledFieldset>
```

## ✅ Correct

```jsx
<Heading>
  <Cluster as="span">any</Cluster>
</Heading>

<HogeFormControl title={
  <FugaCluster forwardedAs="span">any</FugaCluster>
} />

<StyledFieldset title={
  <Cluster as="strong">any</Cluster>
}>
  // any
</StyledFieldset>
```
