# eslint-plugin-smarthr

## smarthr/a11y-clickable-element-has-text

- ButtonやAnchor,Link コンポーネントにテキスト要素が設定されていない場合、アクセシビリティの問題が発生する可能性を防ぐルールです

### rules

```js
{
  rules: {
    'smarthr/a11y-clickable-element-has-text': 'error', // 'warn', 'off'
  },
}
```

### ❌ Incorrect

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

### ✅ Correct

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

## smarthr/format-import-path

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/format-import-path)

## smarthr/jsx-start-with-spread-attributes

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/jsx-start-with-spread-attributes)

## smarthr/no-import-other-domain

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/no-import-other-domain)

## smarthr/prohibit-import

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/prohibit-import)

## smarthr/require-import

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-import)

## smarthr/require-export

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-export)

## smarthr/require-barrel-import

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-barrel-import)

## smarthr/redundant-name

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/redundant-name)

## smarthr/format-translate-component

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/format-translate-component)
