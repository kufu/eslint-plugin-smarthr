const rule = require('../rules/a11y-clickable-element-has-text')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

const defaultErrorMessage = 'a, button要素にはテキストを設定してください。要素内にアイコン、画像のみを設置する場合はSmartHR UIのvisuallyHiddenText、通常のHTML要素にはaltなどの代替テキスト用属性を指定してください'

ruleTester.run('a11y-clickable-element-has-text', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: 'const HogeAnchor = styled.a``' },
    { code: 'const HogeLink = styled.a``' },
    { code: 'const HogeButton = styled.button``' },
    { code: 'const HogeAnchor = styled(Anchor)``' },
    { code: 'const HogeLink = styled(Link)``' },
    { code: 'const HogeButton = styled(Button)``' },
    { code: 'const FugaAnchor = styled(HogeAnchor)``' },
    { code: 'const FugaSmartHRLogo = styled(SmartHRLogo)``' },
    {
      code: `<a>ほげ</a>`,
    },
    {
      code: `<Link>ほげ</Link>`,
    },
    {
      code: `<HogeLink>ほげ</HogeLink>`,
    },
    {
      code: `<Anchor>ほげ</Anchor>`,
    },
    {
      code: `<FugaAnchor>ほげ</FugaAnchor>`,
    },
    {
      code: `<AnchorButton>ほげ</AnchorButton>`,
    },
    {
      code: `<HogaAnchorButton>ほげ</HogaAnchorButton>`,
    },
    {
      code: `<Button>ほげ</Button>`,
    },
    {
      code: `<a />`,
    },
    {
      code: `<button />`,
    },
    {
      code: `<Anchor />`,
    },
    {
      code: `<Link />`,
    },
    {
      code: `<Button />`,
    },
    {
      code: `<HogeButton />`,
    },
    {
      code: `<a><span>ほげ</span></a>`,
    },
    {
      code: `<a><AnyComponent>ほげ</AnyComponent></a>`,
    },
    {
      code: `<a><img src="hoge.jpg" alt="ほげ" /></a>`,
    },
    {
      code: `<a><Icon visuallyHiddenText="ほげ" /></a>`,
    },
    {
      code: `<a><AnyComponent><Icon visuallyHiddenText="ほげ" /></AnyComponent></a>`,
    },
    {
      code: `<a>{any}</a>`,
    },
    {
      code: `<a><span>{any}</span></a>`,
    },
    {
      code: `<a><SmartHRLogo /></a>`,
    },
    {
      code: `<a><PrefixSmartHRLogo /></a>`,
    },
    {
      code: `<a><>ほげ</></a>`,
    },
    {
      code: `<a><svg role="img" aria-label="hoge" /></a>`,
    },
    {
      code: `<a><AnyComponent /></a>`,
      options: [{
        componentsWithText: ['AnyComponent']
      }],
    },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`" } ] },
    { code: 'const Hoge = styled.a``', errors: [ { message: `Hogeを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.button``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(Anchor)``', errors: [ { message: `Hogeを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(Link)``', errors: [ { message: `Hogeを正規表現 "/Link$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(Button)``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Fuga = styled(HogeAnchor)``', errors: [ { message: `Fugaを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Fuga = styled(HogeAnchor)``', errors: [ { message: `Fugaを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Fuga = styled(SmartHRLogo)``', errors: [ { message: `Fugaを正規表現 "/SmartHRLogo$/" がmatchする名称に変更してください` } ]  },
    {
      code: `<a><img src="hoge.jpg" /></a>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<a><Any /></a>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<a><span><Any /></span></a>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<a><img src="hoge.jpg" alt="" /></a>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<a><AnyComponent><Icon visuallyHiddenText="" /></AnyComponent></a>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<button><img src="hoge.jpg" /></button>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<button><Any /></button>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<button><span><Any /></span></button>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<button><img src="hoge.jpg" alt="" /></button>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<button><AnyComponent><Icon visuallyHiddenText="" /></AnyComponent></button>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<button><SmartHRLogoSuffix /></button>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<a><div role="article" aria-label="hoge" /></a>`,
      errors: [{ message: defaultErrorMessage }]
    },
    {
      code: `<a><AnyComponent /></a>`,
      options: [{
        componentsWithText: ['HogeComponent']
      }],
      errors: [{ message: defaultErrorMessage }]
    },
  ]
})
