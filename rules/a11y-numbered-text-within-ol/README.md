# smarthr/a11y-numbered-text-within-ol

- "1. hoge", "2. fuga" ... のように連番のテキストをもつコンポーネントはol要素でマークアップすることを促すルールです
  - ol要素でマークアップすることで連番テキストをもつ要素同士の関係、順番に意味があることを適切に示すことが出来ます

## rules

```js
{
  rules: {
    'smarthr/a11y-numbered-text-within-ol': 'error', // 'warn', 'off',
  },
}
```

## ❌ Incorrect

```jsx
// ol要素で囲まれていないためNG
<Any>1. hoge</Any>
<Any>2. fuga</Any>

// 属性でも同様にチェックする
<Any title="1. hoge" />
<Any title="2. fuga" />

// ol要素内で連番を設定しているとNG
<OrderedList>
  <li>1. hoge</li>
  <li>2. fuga</li>
</OrderedList>

// 同一のol要素で囲まれていないためNG
<OrderedList>
  <li>hoge</li>
</OrderedList>
<OrderedList>
  <li>fuga</li>
</OrderedList>>

```

## ✅ Correct

```jsx
<ol>
  <li>hoge</li>
  <li>fuga</li>
</ol>

<OrderedList>
  <Any title="hoge" />
  <Any title="fuga" />
</OrderedList>

// デフォルトの連番からフォーマット、スタイルを変更したい場合
// counter-reset + counter-increment で表現する
// 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)
<OrderedList>
  <li>
    <NumberedHeading>hoge</NumberedHeading>
    <Any />
  </li>
  <li>
    <NumberedHeading>fuga</NumberedHeading>
    <Any />
  </li>
</OrderedList>

...

const OrderedList = styled.ol`
  list-style: none; // デフォルトのstyleを消す
  counter-reset: hoge; // カウンターの名称。わかりやすいものなら何でもOK
`
const NumberedHeading = styled(Heading)`
  &::before {
    counter-increment: hoge; // hogeカウンターを+1する
    content: "No " counter(hoge) ": "; // 表示される連番のフォーマット
  }
`
```
