# smarthr/a11y-heading-in-sectioning-content

- Headingコンポーネントをsmarthr-ui/SectioningContent(Article, Aside, Nav, Section, SectioningFragment) のいずれかで囲むことを促すルールです
  - article, aside, nav, section で Heading とHeadingの対象となる範囲を囲むとブラウザが正確に解釈できるようになるメリットがあります
  - またsmarthr-ui/SectioningContentで smarthr-ui/Headingを囲むことで、Headingのレベル(h1~h6)を自動的に計算するメリットもあります

## rules

```js
{
  rules: {
    'smarthr/a11y-heading-in-sectioning-content': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
<div>
  <Heading>
    hoge
  </Heading>
  <Heading>
    fuga
  </Heading>
</div>
```
```jsx
<section> // styled-components の sectionをそのまま利用するとNG
  <Heading>
    hoge
  </Heading>
</section>
<section>
  <Heading>
    fuga
  </Heading>
</section>
```

## ✅ Correct

```jsx
<div>
  <Heading>hoge</Heading> // コンポーネント内にHeadingが一つのみの場合はOK
</div>
```

```jsx
<Section>
  <Heading>hoge</Heading>
  <Section>
    <Heading>fuga</Heading>
  </Section>
</Section>
```

```jsx
<Section>
  <Heading>
    hoge
  </Heading>
</Section>
<StyledSection>
  <Heading>
    fuga
  </Heading>
</StyledSection>
```
