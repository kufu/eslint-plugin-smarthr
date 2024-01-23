# smarthr/a11y-prohibit-useless-sectioning-fragment

- Headingレベルの自動計算用のコンポーネントであるSectioningFragmentが不必要に利用されている場合を検知し、修正を促します
- Sectioninigされるコンポーネントを直接SectioningFragmentで囲んでいる場合エラーになります

## rules

```js
{
  rules: {
    'smarthr/a11y-prohibit-useless-sectioning-fragment': 'error', // 'warn', 'off',
  },
}
```

## ❌ Incorrect

```jsx
<SectioninigFragment>
  <Section>
    any
  </Section>
</SectioninigFragment>

<SectioninigFragment>
  <Stack as="aside">
    any
  </Stack>
</SectioninigFragment>

<SectioninigFragment>
  <HogeCenter forwardedas="nav">
    any
  </HogeCenter>
</SectioninigFragment>
```

## ✅ Correct

```jsx
<Section>
  any
</Section>

<Stack as="aside">
  any
</Stack>

<HogeCenter forwardedas="nav">
  any
</HogeCenter>

<SectioningFragment>
  <Any />
</SectioningFragment>

<Aside>
  <SectioningFragment>{any}</SectioningFragment>>
</Aside>
```
