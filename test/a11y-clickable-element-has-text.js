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

const defaultErrorMessage = `a, buttonなどのクリッカブルな要素内にはテキストを設定してください
 - 要素内にアイコン、画像のみを設置する場合はaltなどの代替テキスト用属性を指定してください
  - SVG component の場合、altを属性として受け取れるようにした上で '<svg role="img" aria-label={alt}>' のように指定してください
 - クリッカブルな要素内に設置しているコンポーネントがテキストを含んでいる場合、"XxxxText" のように末尾に "Text" もしくは "Message" という名称を設定してください`

ruleTester.run('a11y-clickable-element-has-text', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: `import { SmartHRLogo as HogeSmartHRLogo } from './hoge'` },
    { code: `import { AbcButton as StyledAbcButton } from './hoge'` },
    { code: `import { HogeAnchor as FugaAnchor } from './hoge'` },
    { code: `import { Link as FugaLink } from './hoge'` },
    { code: `import { FugaText as HogeFugaText } from './hoge'` },
    { code: `import { FugaMessage as HogeFugaMessage } from './hoge'` },
    { code: 'const HogeAnchor = styled.a``' },
    { code: 'const HogeLink = styled.a``' },
    { code: 'const HogeButton = styled.button``' },
    { code: 'const HogeAnchor = styled(Anchor)``' },
    { code: 'const HogeLink = styled(Link)``' },
    { code: 'const HogeButton = styled(Button)``' },
    { code: 'const FugaAnchor = styled(HogeAnchor)``' },
    { code: 'const FugaSmartHRLogo = styled(SmartHRLogo)``' },
    { code: 'const HogeAnchor = styled.a(() => ``)' },
    { code: 'const HogeAnchor = styled("a")(() => ``)' },
    { code: 'const HogeAnchor = styled(Anchor)(() => ``)' },
    { code: 'const FugaText = styled(HogeText)(() => ``)' },
    { code: 'const FugaMessage = styled(HogeMessage)(() => ``)' },
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
      code: `<a><Text /></a>`,
    },
    {
      code: `<a><HogeText /></a>`,
    },
    {
      code: `<a><FormattedMessage /></a>`,
    },
    {
      code: `<a><AnyComponent /></a>`,
      options: [{
        componentsWithText: ['AnyComponent']
      }],
    },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { SmartHRLogo as SmartHRLogoHoge } from './hoge'`, errors: [ { message: `SmartHRLogoHogeを正規表現 "/SmartHRLogo$/" がmatchする名称に変更してください` } ] },
    { code: `import { AbcButton as AbcButtonFuga } from './hoge'`, errors: [ { message: `AbcButtonFugaを正規表現 "/Button$/" がmatchする名称に変更してください` } ] },
    { code: `import { Anchor as AnchorHoge } from './hoge'`, errors: [ { message: `AnchorHogeを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ] },
    { code: `import { HogeLink as HogeLinkFuga } from './hoge'`, errors: [ { message: `HogeLinkFugaを正規表現 "/Link$/" がmatchする名称に変更してください` } ] },
    { code: `import { FugaText as FugaTextFuga } from './hoge'`, errors: [ { message: `FugaTextFugaを正規表現 "/Text$/" がmatchする名称に変更してください` } ] },
    { code: `import { FugaMessage as FugaMessageFuga } from './hoge'`, errors: [ { message: `FugaMessageFugaを正規表現 "/Message$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.a``', errors: [ { message: `Hogeを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.button``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(Anchor)``', errors: [ { message: `Hogeを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(Link)``', errors: [ { message: `Hogeを正規表現 "/Link$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(Button)``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Fuga = styled(HogeAnchor)``', errors: [ { message: `Fugaを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Fuga = styled(HogeAnchor)``', errors: [ { message: `Fugaを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Fuga = styled(SmartHRLogo)``', errors: [ { message: `Fugaを正規表現 "/SmartHRLogo$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Piyo = styled.a(() => ``)', errors: [ { message: `Piyoを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Piyo = styled("a")(() => ``)', errors: [ { message: `Piyoを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Piyo = styled("a")``', errors: [ { message: `Piyoを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Piyo = styled(Anchor)(() => ``)', errors: [ { message: `Piyoを正規表現 "/Anchor$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(Text)``', errors: [ { message: `Hogeを正規表現 "/Text$/" がmatchする名称に変更してください` } ]  },
    { code: 'const Hoge = styled(HogeMessage)``', errors: [ { message: `Hogeを正規表現 "/Message$/" がmatchする名称に変更してください` } ]  },
    { code: 'const StyledButton = styled.div``', errors: [ { message: `StyledButton は /(B|^b)utton$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - StyledButton の名称の末尾が"Button" という文字列ではない状態にしつつ、"div"を継承していることをわかる名称に変更してください
 - もしくは"div"を"StyledButton"の継承元であることがわかるような適切なタグや別コンポーネントに差し替えてください
   - 修正例1: const StyledXxxx = styled.div
   - 修正例2: const StyledButtonXxxx = styled.div
   - 修正例3: const StyledButton = styled(XxxxButton)` } ]  },
    { code: 'const HogeAnchor = styled(Fuga)``', errors: [ { message: `HogeAnchor は /(Anchor|^a)$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - HogeAnchor の名称の末尾が"Anchor" という文字列ではない状態にしつつ、"Fuga"を継承していることをわかる名称に変更してください
 - もしくは"Fuga"を"HogeAnchor"の継承元であることがわかるような名称に変更するか、適切な別コンポーネントに差し替えてください
   - 修正例1: const HogeXxxx = styled(Fuga)
   - 修正例2: const HogeAnchorXxxx = styled(Fuga)
   - 修正例3: const HogeAnchor = styled(XxxxAnchor)` } ]  },
    { code: 'const HogeLink = styled.p``', errors: [ { message: `HogeLink は /(Link|^a)$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - HogeLink の名称の末尾が"Link" という文字列ではない状態にしつつ、"p"を継承していることをわかる名称に変更してください
 - もしくは"p"を"HogeLink"の継承元であることがわかるような適切なタグや別コンポーネントに差し替えてください
   - 修正例1: const HogeXxxx = styled.p
   - 修正例2: const HogeLinkXxxx = styled.p
   - 修正例3: const HogeLink = styled(XxxxLink)` } ]  },
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
      code: `<a><TextWithHoge /></a>`,
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
