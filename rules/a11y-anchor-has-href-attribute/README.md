# smarthr/a11y-anchor-has-href-attribute

- a, Anchor, Link コンポーネントに href 属性を設定することを促すルールです
  - href が設定されていないanchor要素は `遷移先が存在しない無効化されたリンク` という扱いになります
  - URLの変更を行わない場合、責務としても a より button が適切です
  - URL遷移を行う場合、hrefが設定されていないとキーボード操作やコンテキストメニューからの遷移ができなくなります
    - これらの操作は href属性を参照します
  - 無効化されたリンクであることを表したい場合 `href={undefined}` を設定してください
- checkTypeオプションに 'smart' を指定することで spread attributeが設定されている場合はcorrectに出来ます。

## rules

```js
{
  rules: {
    'smarthr/a11y-anchor-has-href-attribute': [
      'error', // 'warn', 'off'
      // { checkType: 'always' } /* 'always' || 'smart' */
    ]
  },
}
```

## ❌ Incorrect

```jsx
<a>any</a>
<XxxAnchor>any</XxxAnchor>
<XxxLink>any</XxxLink>
<XxxLink href>any</XxxLink>

// checkType: 'always'
<XxxAnchor {...args} />
<XxxLink {...args} any="any" />
```

## ✅ Correct

```jsx
<a href="https://www.google.com/search">any</a>
<XxxAnchor href={hoge}>any</XxxAnchor>
<XxxLink href={undefined}>any</XxxLink>

// nextを利用している場合
<Link href={hoge}><a>any</a></Link>

// react-router-domを利用している場合
<Link to={hoge}>any</Link>

// checkType: 'smart'
<XxxAnchor {...args} />
<XxxLink {...args} any="any" />
```
