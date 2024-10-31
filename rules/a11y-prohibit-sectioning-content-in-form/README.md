# smarthr/a11y-prohibit-sectioning-content-in-form

- form, fieldset, smarthr-ui/Fieldset 以下でSectioningContent(section, aside, article, nav)が利用されている場合、smarthr-ui/Fieldsetに置き換えることを促すルールです
- このルールを適用することで以下のようなメリットがあります
  - form要素内からHeadingが取り除かれ、Fieldsetに統一されることにより、見出しを表現する要素がlegend, label要素のみになります
  - これによってマークアップのルールが統一され、スクリーンリーダーのジャンプ機能などの利便性が向上します
    - ジャンプ機能ではheading, legendは区別されるため統一されることで操作方法が単純化されます
- a11y-form-control-in-form と組み合わせることでより厳密なフォームのマークアップを行えます


## rules

```js
{
  rules: {
    'smarthr/a11y-prohibit-sectioning-content-in-form': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
// form要素以下にSectionが存在するためNG
const AnyComponent = <form>
  <Section>
    <Heading>ANY TITLE.</Heading>
  </Section>
</form>

// fieldset要素以下にAsideが存在するためNG
const AnyComponent = <Fieldset>
  <Aside>
    <Heading>ANY TITLE.</Heading>
  </Aside>
</Fieldset>

// ファイル名、もしくは所属するディレクトリがform, fieldsetなどフォームに関連する名称になっている場合
// 内部でArticleを使っているとNG
const AnyComponent = <>
  <Article>
    <Heading>ANY TITLE.</Heading>
  </Article>
</>
```

## ✅ Correct

```jsx
// form内でSectioningContentを利用していないのでOK
const AnyComponent = <form>
  <Fieldset title="ANY TITLE.">
    Hoge.
    <Fieldset title="ANY TITLE.">
      Fuga.
      <FormControl  title="ANY TITLE.">
        Piyo.
      </FormControl>
    </Fieldset>
  </Fieldset>
</form>
```
