# smarthr/date-with-parsed-number

- `new Date(arg)` と `Date.parse(arg)` を禁止するルールです
  - `new Date()` と`new Date(year, month, date)` などのように引数が1つ以外の場合は許容します
- これらはブラウザの実装によっては意図しない日付として解釈されてしまう問題を回避するためのものです
  - [Date オブジェクトを生成するいくつかの方法](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date#date_%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E7%94%9F%E6%88%90%E3%81%99%E3%82%8B%E3%81%84%E3%81%8F%E3%81%A4%E3%81%8B%E3%81%AE%E6%96%B9%E6%B3%95)
  - [Date.parse](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date#date.parse)

## rules

```js
{
  rules: {
    'smarthr/date-with-parsed-number': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```js
new Date('2022/12/31')

new Date(arg)

Date.parse(value)
```

## ✅ Correct


```js
new Date(2022, 11, 31)

const args = arg.split('/')
new Date(args[0], parseInt(args[1], 10) - 1, args[2])

// use dayjs
dayjs(arg)
```
