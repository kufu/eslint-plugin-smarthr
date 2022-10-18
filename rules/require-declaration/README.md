# smarthr/require-declaration

- 対象ファイルに宣言してほしい、変数・関数・class・型などを定義するルールです
- コードの規約などを決める際に便利です
- import, exportを強制したい場合は以下を利用してください
  - https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-import
  - https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-export

## rules

```js
{
  rules: {
    'smarthr/require-declaration': [
      'error', // 'warn', 'off'
      {
        '\crews\/index\/slices\/': { // パスに合致する正規表現でファイル指定
          'ActionCreatorsProps': { // 定義してほしい名称
            type: 'type', // 定義したい種類 type | const | let | class | function | arrow-function
            use: ['payload', 'AnyAction'], // 定義対象の内部で利用を強制したいものを指定する
            reportMessage: `'type ActionCreatorsProps = { xxxYyy: (payload: XxxProps) => AnyAction }' というフォーマットで型を作成してください` // 省略可能
          },
        },
        '^(?=.*\/slices\/[a-zA-Z0-9]+\.ts)(?!.*(\/modules\/|mock\.)).*$': { // slices以下のファイルで、かつフルパスにmodulesや `mock.` を含まないもの
          'slice': {
            type: 'const',
            use: ['createSlice', 'path', 'initialState', 'reducers'],
            reportMessage: `'const slice = createSlice({ name: path.xxxx, initialState, reducers })' というフォーマットでsliceを作成してください`
          },
        },
      },
    ]
  },
}
```

## ❌ Incorrect

```jsx
// crews/index/slice/index.ts

type Actions = {
  hoge: (payload: hogeProps) => any
}
```


## ✅ Correct

```jsx
// crews/index/slice/index.ts

type ActionCreatorsProps = {
  hoge: (payload: hogeProps) => AnyAction
}

const slice = createSlice({
  name: path.hoge,
  initialState,
  reducers,
})
```
