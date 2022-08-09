# smarthr/prohibit-file-name

- 正規表現に合致するファイル、ディレクトリの作成を阻害するルールです

## rules

```js
{
  rules: {
    'smarthr/prohibit-file-name': [
      'error', // 'warn', 'off'
      {
        '\/(actions|reducers)\/$': 'slicesディレクトリ内でcreateSliceを利用してください',
        '\/views\/(page|template)\.(ts(x)?)$': 'index.$2、もしくはTemplate.$2にリネームしてください',
        '\/modules\/(adapters|entities|repositories|slices)\/index\.ts(x)?$': '利用目的が推測出来ない為、リネームしてください(例: new, edit用ならform.tsなど)',
      },
    ]
  },
}
```

## ❌ Incorrect

```js
// src/pages/actions/index.ts
// src/modules/entities/index.ts
```

## ✅ Correct


```js
// src/pages/slices/index.ts
// src/modules/entities/item.ts
```
