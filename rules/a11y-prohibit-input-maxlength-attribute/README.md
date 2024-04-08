# smarthr/a11y-prohibit-input-maxlength-attribute

TODO: ここを書く

- a, Anchor, Link コンポーネントに href 属性を設定することを促すルールです
  - href が設定されていないanchor要素は `遷移先が存在しない無効化されたリンク` という扱いになります
  - URLの変更を行わない場合、責務としても a より button が適切です
  - URL遷移を行う場合、hrefが設定されていないとキーボード操作やコンテキストメニューからの遷移ができなくなります
    - これらの操作は href属性を参照します
  - 無効化されたリンクであることを表したい場合 `href={undefined}` を設定してください
- checkTypeオプションに 'allow-spread-attributes' を指定することで spread attributeが設定されている場合はcorrectに出来ます
- react-router-dom packageを利用している場合、a要素にto属性が指定されている場合、href属性が指定されているものとして許容します
- next/link コンポーネント直下のa要素にhref属性が指定されていないことを許容します

## rules

```js
{
  rules: {
    'smarthr/a11y-prohibit-input-maxlength-attribute': [
      'error', // 'warn', 'off'
      // { checkType: 'always' } /* 'always' || 'allow-spread-attributes' */
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

// checkType: 'allow-spread-attributes'
<XxxAnchor {...args} />
<XxxLink {...args} any="any" />
```
