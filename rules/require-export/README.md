# smarthr/require-export

- 対象ファイルにexportを強制させたい場合に利用します
  - 例: Page.tsx ではページタイトルを設定させたいので useTitle を必ずexportさせたい

## rules

```js
{
  rules: {
    'smarthr/require-export': [
      'error',
      {
        'adapter\/.+\.ts': ['Props', 'generator'],
        // slice以下のファイルかつmodulesディレクトリに属さずファイル名にmockを含まないもの
        '^(?=.*\/slices\/[a-zA-Z0-9]+\.ts)(?!.*(\/modules\/|mock\.)).*$': [ 'default' ],
      },
    ]
  },
}
```

## ❌ Incorrect

```js
// adapter/index.ts
export type Type = { abc: string }

// slice/index.ts
export const slice = { method: () => 'any action' }
```

## ✅ Correct


```js
// adapter/index.ts
export type Props = { abc: string }

// slice/index.ts
const slice = { method: () => 'any action' }
export default slice
```
