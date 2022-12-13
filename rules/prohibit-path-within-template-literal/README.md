# smarthr/prohibit-path-within-template-literal

- URIを管理するオブジェクト(path, localPath, GlobalPath, PATH, etc...)をtemplate-literalで囲むことを禁止するルールです
- query-stringの生成やパスの一部などをtemplate-literalで結合することは責務を拡散させることになります
- それらの責務を指定したオブジェクトに集中させたい場合などに利用出来ます
  - 例
    - NG: `\`${path.xxx}?${queryString}\``
      - pathオブジェクト外でqueryStringが生成されてしまっており、どのようなqueryStringが設定される可能性があるか？という情報が拡散してしまう
    - OK: `path.xxx({ xxxx: 'yyyyy' })`
      - path内でqueryStringを生成するため、URL生成の情報が集約される

## rules

```js
{
  rules: {
    'smarthr/prohibit-path-within-template-literal': [
      'error', // 'warn', 'off'
      // {
      //   pathRegex: '((p|P)ath|PATH)$', // URIを管理するオブジェクトの名称を判定する正規表現
      // },
    ]
  },
}
```

## ❌ Incorrect

```jsx
\`${path.any.hoge}\?${queryString}`
```
```jsx
\`${path.any.hoge(ANY)}\${HOGE}`
```
```jsx
\`${path.any.fuga}\`
```

## ✅ Correct
```jsx
path.any.hoge(queryString)
```
