const rule = require('../rules/a11y-anchor-has-href-attribute')
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

const generateErrorText = (name) => `${name} に href 属性を正しく設定してください
 - onClickなどでページ遷移する場合でもhref属性に遷移先のURIを設定してください
   - Cmd + clickなどのキーボードショートカットに対応出来ます
 - onClickなどの動作がURLの変更を行わない場合、button要素でマークアップすることを検討してください
   - href属性に空文字(""など)や '#' が設定されている場合、実質画面遷移を行わないため、同様にbutton要素でマークアップすることを検討してください
 - リンクが存在せず無効化されていることを表したい場合、href属性に undefined を設定してください
   - button要素のdisabled属性が設定された場合に相当します`

ruleTester.run('a11y-anchor-has-href-attribute', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: `import { HogeAnchor as FugaAnchor } from './hoge'` },
    { code: `import { Link as FugaLink } from './hoge'` },
    { code: 'const HogeAnchor = styled.a``' },
    { code: 'const HogeLink = styled.a``' },
    { code: 'const HogeAnchor = styled(Anchor)``' },
    { code: 'const HogeLink = styled(Link)``' },
    { code: `<a href="hoge">ほげ</a>` },
    { code: `<a href={hoge}>ほげ</a>` },
    { code: `<a href={undefined}>ほげ</a>` },
    { code: `<HogeAnchor href={hoge}>ほげ</HogeAnchor>` },
    { code: `<Link href="hoge">ほげ</Link>` },
    { code: `<Link href="#fuga">ほげ</Link>` },
    { code: '<AnyAnchor {...args1} />', options: [{ checkType: 'allow-spread-attributes' }] },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { Anchor as AnchorHoge } from './hoge'`, errors: [ { message: `AnchorHogeを正規表現 "/Anchor$/" がmatchする名称に変更してください。
 - Anchorが型の場合、'import type { Anchor as AnchorHoge }' もしくは 'import { type Anchor as AnchorHoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeLink as HogeLinkFuga } from './hoge'`, errors: [ { message: `HogeLinkFugaを正規表現 "/Link$/" がmatchする名称に変更してください。
 - HogeLinkが型の場合、'import type { HogeLink as HogeLinkFuga }' もしくは 'import { type HogeLink as HogeLinkFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: 'const Hoge = styled.a``', errors: [ { message: `Hogeを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Anchor)``', errors: [ { message: `Hogeを正規表現 "/Anchor$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Link)``', errors: [ { message: `Hogeを正規表現 "/Link$/" がmatchする名称に変更してください。` } ] },
    { code: 'const FugaAnchor = styled.div``', errors: [ { message: `FugaAnchor は /(Anchor|^a)$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - FugaAnchor の名称の末尾が"Anchor" という文字列ではない状態にしつつ、"div"を継承していることをわかる名称に変更してください
 - もしくは"div"を"FugaAnchor"の継承元であることがわかるような適切なタグや別コンポーネントに差し替えてください
   - 修正例1: const FugaXxxx = styled.div
   - 修正例2: const FugaAnchorXxxx = styled.div
   - 修正例3: const FugaAnchor = styled(XxxxAnchor)` } ] },
    { code: 'const FugaLink = styled.p``', errors: [ { message: `FugaLink は /(Link|^a)$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - FugaLink の名称の末尾が"Link" という文字列ではない状態にしつつ、"p"を継承していることをわかる名称に変更してください
 - もしくは"p"を"FugaLink"の継承元であることがわかるような適切なタグや別コンポーネントに差し替えてください
   - 修正例1: const FugaXxxx = styled.p
   - 修正例2: const FugaLinkXxxx = styled.p
   - 修正例3: const FugaLink = styled(XxxxLink)` } ] },
    { code: `<a></a>`, errors: [{ message: generateErrorText('a') }] },
    { code: `<a>hoge</a>`, errors: [{ message: generateErrorText('a') }] },
    { code: `<Anchor>hoge</Anchor>`, errors: [{ message: generateErrorText('Anchor') }] },
    { code: `<HogeLink>hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href>hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href="hoge"><a>hoge</a></HogeLink>`, errors: [{ message: generateErrorText('a') }] },
    { code: `<HogeLink to="hoge">hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href="">hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href={""}>hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href={''}>hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href="#">hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: `<HogeLink href={'#'}>hoge</HogeLink>`, errors: [{ message: generateErrorText('HogeLink') }] },
    { code: '<AnyAnchor {...args1} />', errors: [{ message: generateErrorText('AnyAnchor') }] },
    { code: '<AnyAnchor {...args1} />', options: [{ checkType: 'always' }], errors: [{ message: generateErrorText('AnyAnchor') }] },
  ]
})
