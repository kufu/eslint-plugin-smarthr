const rule = require('../rules/a11y-required-layout-as-attribute')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

const generateErrorText = (parentName, name) => `${name}は${parentName}内に存在するため、as、もしくはforwardedAs属性を指定し、div以外の要素にする必要があります
 - smarthr-ui/Layoutに属するコンポーネントはデフォルトでdiv要素を出力するため${parentName}内で利用すると、マークアップの仕様に違反します
 - ほぼすべての場合、spanを指定することで適切なマークアップに変更出来ます
 - span以外を指定したい場合、記述コンテンツに属する要素かどうかを確認してください (https://developer.mozilla.org/ja/docs/Web/HTML/Content_categories#%E8%A8%98%E8%BF%B0%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84)`

ruleTester.run('a11y-anchor-has-href-attribute', rule, {
  valid: [
    { code: `<h1><Cluster as="span">ほげ</Cluster></h1>` },
    { code: `<Heading><Cluster as="strong" /></Heading>` },
    { code: `<StyledHeading><AnyCluster forwardedAs="span" /></StyledHeading>` },
    { code: `<FormControl title={<Cluster as="span" />} />` },
    { code: `<StyledFieldset title={<AnyCluster forwardedAs="strong" />} />` },
  ],
  invalid: [
    { code: `<h1><Cluster>ほげ</Cluster></h1>`, errors: [{ message: generateErrorText('h1', 'Cluster') }] },
    { code: `<Heading><Cluster /></Heading>`, errors: [{ message: generateErrorText('Heading', 'Cluster') }] },
    { code: `<StyledHeading><AnyCluster /></StyledHeading>`, errors: [{ message: generateErrorText('StyledHeading', 'AnyCluster') }] },
    { code: `<FormControl title={<Cluster />} />`, errors: [{ message: generateErrorText('FormControlのtitle属性', 'Cluster') }] },
    { code: `<StyledFieldset title={<AnyCluster />} />`, errors: [{ message: generateErrorText('StyledFieldsetのtitle属性', 'AnyCluster') }] },
  ]
})
