# smarthr/a11y-replace-unreadable-symbol

- 一部記号はスクリーンリーダーで読み上げられない、もしくは記号名そのままで読み上げられてしまい、意図が正しく伝えられない場合があります
- それらの記号を適切に読み上げられるコンポーネントに置き換えることを促すルールです

## rules

```js
{
  rules: {
    'smarthr/a11y-replace-unreadable-symbol': 'error', // 'warn', 'off',
  },
}
```

## ❌ Incorrect

```jsx
<>XXXX年YY月ZZ日 〜 XXXX年YY月ZZ日</>
// スクリーンリーダーは "XXXX年YY月ZZ日XXXX年YY月ZZ日" と読み上げる場合があります

<p>選択できる数値の範囲は 0 ~ 9999 です</p>
// スクリーンリーダーは "選択できる数値の範囲は09999です" と読み上げる場合があります
```

## ✅ Correct

```jsx
//
<>XXXX年YY月ZZ日 <RangeSeparator /> XXXX年YY月ZZ日</>
// スクリーンリーダーは "XXXX年YY月ZZ日からXXXX年YY月ZZ日" と読み上げます

<p>選択できる数値の範囲は 0 <RangeSeparator /> 9999 です</p>
// スクリーンリーダーは "選択できる数値の範囲は0から9999です" と読み上げます

<p>入力できる記号は <RangeSeparator decorators={{ text: '~', visuallyHiddenText: '半角チルダ' }} /> です</p>
// スクリーンリーダーは "入力できる記号は半角チルダです" と読み上げます
```
