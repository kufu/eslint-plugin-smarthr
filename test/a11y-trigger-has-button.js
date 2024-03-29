const rule = require('../rules/a11y-trigger-has-button')
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

ruleTester.run('a11y-trigger-has-button', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: `import { DropdownTrigger as HogeDropdownTrigger } from './hoge'` },
    { code: `import { FugaDialogTrigger as HogeDialogTrigger } from './hoge'` },
    { code: `import { AbcButton as HogeAbcButton } from './hoge'` },
    { code: `import { AnchorButton as FugaAnchorButton } from './hoge'` },
    { code: `import { HogeAnchor as HogeFugaAnchor } from './hoge'` },
    { code: `import { FugaLink as HogeLink } from './hoge'` },
    { code: 'const HogeButton = styled.button``' },
    { code: 'const HogeAnchor = styled.a``' },
    { code: 'const HogeLink = styled.a``' },
    { code: 'const HogeButton = styled(Button)``' },
    { code: 'const HogeButtonAnchor = styled(ButtonAnchor)``' },
    { code: 'const HogeAnchorButton = styled(AnchorButton)``' },
    { code: 'const HogeLink = styled(FugaLink)``' },
    { code: 'const HogeAnchor = styled(FugaAnchor)``' },
    { code: 'const HogeDialogTrigger = styled(DialogTrigger)``' },
    { code: 'const HogeDropdownTrigger = styled(DropdownTrigger)``' },
    { code: '<DropdownTrigger><button>hoge</button></DropdownTrigger>' },
    { code: '<DialogTrigger><button>{hoge}</button></DialogTrigger>' },
    { code: '<DropdownTrigger>{hoge}</DropdownTrigger>' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { DropdownTrigger as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/DropdownTrigger$/" がmatchする名称に変更してください。
 - DropdownTriggerが型の場合、'import type { DropdownTrigger as Hoge }' もしくは 'import { type DropdownTrigger as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { DialogTrigger as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/DialogTrigger$/" がmatchする名称に変更してください。
 - DialogTriggerが型の場合、'import type { DialogTrigger as Hoge }' もしくは 'import { type DialogTrigger as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { Button as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください。
 - Buttonが型の場合、'import type { Button as Hoge }' もしくは 'import { type Button as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { AbcAnchorButton as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください。
 - AbcAnchorButtonが型の場合、'import type { AbcAnchorButton as Hoge }' もしくは 'import { type AbcAnchorButton as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` }, { message: `Hogeを正規表現 "/AnchorButton$/" がmatchする名称に変更してください。
 - AbcAnchorButtonが型の場合、'import type { AbcAnchorButton as Hoge }' もしくは 'import { type AbcAnchorButton as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { Anchor as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/Anchor$/" がmatchする名称に変更してください。
 - Anchorが型の場合、'import type { Anchor as Hoge }' もしくは 'import { type Anchor as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { Link as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/Link$/" がmatchする名称に変更してください。
 - Linkが型の場合、'import type { Link as Hoge }' もしくは 'import { type Link as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: 'const Hoge = styled.button``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.a``', errors: [ { message: `Hogeを正規表現 "/(Anchor|Link)$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Button)``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(AnchorButton)``', errors: [ { message: `Hogeを正規表現 "/Button$/" がmatchする名称に変更してください。` },{ message: `Hogeを正規表現 "/AnchorButton$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(ButtonAnchor)``', errors: [ { message: `Hogeを正規表現 "/ButtonAnchor$/" がmatchする名称に変更してください。` }, { message: `Hogeを正規表現 "/Anchor$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Anchor)``', errors: [ { message: `Hogeを正規表現 "/Anchor$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Link)``', errors: [ { message: `Hogeを正規表現 "/Link$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(DropdownTrigger)``', errors: [ { message: `Hogeを正規表現 "/DropdownTrigger$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(DialogTrigger)``', errors: [ { message: `Hogeを正規表現 "/DialogTrigger$/" がmatchする名称に変更してください。` } ] },
    { code: '<DropdownTrigger>ほげ</DropdownTrigger>', errors: [ { message: 'DropdownTrigger の直下にはbuttonコンポーネントのみ設置してください' } ] },
    { code: '<DialogTrigger><span><Button>ほげ</Button></span></DialogTrigger>', errors: [ { message: 'DialogTrigger の直下にはbuttonコンポーネントのみ設置してください' } ] },
    { code: '<DropdownTrigger><AnchorButton>ほげ</AnchorButton></DropdownTrigger>', errors: [ { message: 'DropdownTrigger の直下にはbuttonコンポーネントのみ設置してください' } ] },
    { code: '<DropdownTrigger><ButtonAnchor>ほげ</ButtonAnchor></DropdownTrigger>', errors: [ { message: 'DropdownTrigger の直下にはbuttonコンポーネントのみ設置してください' } ] },
    { code: '<DialogTrigger><button>{hoge}</button>{hoge}</DialogTrigger>', errors: [ { message: 'DialogTrigger の直下には複数のコンポーネントを設置することは出来ません。buttonコンポーネントが一つだけ設置されている状態にしてください' } ] },
    { code: '<DropdownTrigger>{hoge}<span>text</span></DropdownTrigger>', errors: [ { message: 'DropdownTrigger の直下には複数のコンポーネントを設置することは出来ません。buttonコンポーネントが一つだけ設置されている状態にしてください' } ] },
  ]
})
