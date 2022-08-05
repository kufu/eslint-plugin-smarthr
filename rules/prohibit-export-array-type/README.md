# smarthr/prohibit-export-array-type

- 配列の型をexport出来ないように制御するルールです
- 利用するファイルで `ItemProps[]` のように配列指定を強制する目的などで利用できます

## rules

```js
{
  rules: {
    'smarthr/prohibit-export-array-type': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```js
type Item = { attr: string }
export type Items = Item[]
```

## ✅ Correct


```js
export type Item = { attr: string }
```
