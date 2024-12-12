const rule = require('../rules/a11y-heading-in-sectioning-content');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

const lowerMessage = `smarthr-ui/Headingと紐づく内容の範囲（アウトライン）が曖昧になっています。
 - smarthr-uiのArticle, Aside, Nav, SectionのいずれかでHeadingコンポーネントと内容をラップしてHeadingに対応する範囲を明確に指定してください。`
const message = `${lowerMessage}
 - Headingをh1にしたい場合(機能名、ページ名などこのページ内でもっとも重要な見出しの場合)、smarthr-ui/PageHeadingを利用してください。その場合はSectionなどでアウトラインを示す必要はありません。`
const pageMessage = 'smarthr-ui/PageHeading が同一ファイル内に複数存在しています。PageHeadingはh1タグを出力するため最も重要な見出しにのみ利用してください。'
const pageInSectionMessage = 'smarthr-ui/PageHeadingはsmarthr-uiのArticle, Aside, Nav, Sectionで囲まないでください。囲んでしまうとページ全体の見出しではなくなってしまいます。'
const noTagAttrMessage = `tag属性を指定せず、smarthr-uiのArticle, Aside, Nav, Sectionのいずれかの自動レベル計算に任せるよう、tag属性を削除してください。
 - tag属性を指定することで意図しないレベルに固定されてしまう可能性があります。`
const notHaveHeadingMessage = (elementName) => `${elementName} はHeading要素を含んでいません。
 - SectioningContentはHeadingを含むようにマークアップする必要があります
 - ${elementName}に設定しているいずれかの属性がHeading，もしくはHeadingのテキストに該当する場合、その属性の名称を /^(heading|title)$/ にマッチする名称に変更してください
 - Headingにするべき適切な文字列が存在しない場合、 ${elementName} は削除するか、SectioningContentではない要素に差し替えてください`

ruleTester.run('a11y-heading-in-sectioning-content', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import { PageHeading as HogePageHeading } from './hoge'` },
    { code: `import { HogeHeading as FugaHeading } from './hoge'` },
    { code: `import { HogeArticle as FugaArticle } from './hoge'` },
    { code: `import { HogeAside as FugaAside } from './hoge'` },
    { code: `import { HogeNav as FugaNav } from './hoge'` },
    { code: `import { HogeSection as FugaSection } from './hoge'` },
    { code: `import { ModelessDialog as FugaModelessDialog } from './hoge'` },
    { code: 'const HogePageHeading = styled.h1``' },
    { code: 'const HogeHeading = styled.h2``' },
    { code: 'const HogeHeading = styled.h3``' },
    { code: 'const HogeHeading = styled.h4``' },
    { code: 'const HogeHeading = styled.h5``' },
    { code: 'const HogeHeading = styled.h6``' },
    { code: 'const FugaHeading = styled(Heading)``' },
    { code: 'const FugaHeading = styled(HogeHeading)``' },
    { code: 'const FugaArticle = styled(HogeArticle)``' },
    { code: 'const FugaAside = styled(HogeAside)``' },
    { code: 'const FugaNav = styled(HogeNav)``' },
    { code: 'const FugaSection = styled(HogeSection)``' },
    { code: "const FugaHeading = styled(Heading).attrs(() => ({ type: 'blockTitle' }))``" },
    { code: 'const FugaCenter = styled(HogeCenter)``' },
    { code: 'const FugaReel = styled(HogeReel)``' },
    { code: 'const FugaSidebar = styled(HogeSidebar)``' },
    { code: 'const FugaStack = styled(HogeStack)``' },
    { code: '<PageHeading>hoge</PageHeading>' },
    { code: '<Section><Heading>hoge</Heading></Section>' },
    { code: '<FugaSection heading={<Heading>hoge</Heading>}>abc</FugaSection>' },
    { code: '<FugaSection heading="hoge">abc</FugaSection>' },
    { code: '<FugaSection title="hoge">abc</FugaSection>' },
    { code: '<><Section><Heading>hoge</Heading></Section><Section><Heading>fuga</Heading></Section></>' },
    { code: 'const HogeHeading = () => <FugaHeading anyArg={abc}>hoge</FugaHeading>' },
    { code: 'export const HogeHeading = () => <FugaHeading anyArg={abc}>hoge</FugaHeading>' },
    { code: 'function FugaHeading() { return <PiyoHeading anyArg={abc}>hoge</PiyoHeading> }' },
    { code: 'export function FugaHeading() { return <PiyoHeading anyArg={abc}>hoge</PiyoHeading> }' },
    { code: '<Center as="section"><div><Heading>hoge</Heading></div></Center>' },
    { code: '<Cluster as="section"><div><Heading>hoge</Heading></div></Cluster>' },
    { code: '<Reel as="aside"><div><Heading>hoge</Heading></div></Reel>' },
    { code: '<Sidebar as="nav"><div><Heading>hoge</Heading></div></Sidebar>' },
    { code: '<Stack as="section"><div><Heading>hoge</Heading></div></Stack>' },
    { code: '<HogeCenter forwardedAs="section"><div><Heading>hoge</Heading></div></HogeCenter>' },
    { code: '<HogeCluster forwardedAs="section"><div><Heading>hoge</Heading></div></HogeCluster>' },
    { code: '<HogeReel forwardedAs="aside"><div><Heading>hoge</Heading></div></HogeReel>' },
    { code: '<HogeSidebar forwardedAs="nav"><div><Heading>hoge</Heading></div></HogeSidebar>' },
    { code: '<HogeStack forwardedAs="section"><div><Heading>hoge</Heading></div></HogeStack>' },
    { code: '<HogeBase as="aside"><Heading>hoge</Heading></HogeBase>' },
    { code: '<HogeBaseColumn forwardedAs="nav"><Heading>hoge</Heading></HogeBaseColumn>' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { HogePageHeading as PageHeadingAbc } from './hoge'`, errors: [ { message: `PageHeadingAbcを正規表現 "/PageHeading$/" がmatchする名称に変更してください。
 - HogePageHeadingが型の場合、'import type { HogePageHeading as PageHeadingAbc }' もしくは 'import { type HogePageHeading as PageHeadingAbc }' のように明示的に型であることを宣言してください。名称変更が不要になります` }, { message: `PageHeadingAbcを正規表現 "/Heading$/" がmatchする名称に変更してください。
 - HogePageHeadingが型の場合、'import type { HogePageHeading as PageHeadingAbc }' もしくは 'import { type HogePageHeading as PageHeadingAbc }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { Heading as HeadingHoge } from './hoge'`, errors: [ { message: `HeadingHogeを正規表現 "/Heading$/" がmatchする名称に変更してください。
 - Headingが型の場合、'import type { Heading as HeadingHoge }' もしくは 'import { type Heading as HeadingHoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeArticle as HogeArticleFuga } from './hoge'`, errors: [ { message: `HogeArticleFugaを正規表現 "/Article$/" がmatchする名称に変更してください。
 - HogeArticleが型の場合、'import type { HogeArticle as HogeArticleFuga }' もしくは 'import { type HogeArticle as HogeArticleFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeAside as HogeAsideFuga } from './hoge'`, errors: [ { message: `HogeAsideFugaを正規表現 "/Aside$/" がmatchする名称に変更してください。
 - HogeAsideが型の場合、'import type { HogeAside as HogeAsideFuga }' もしくは 'import { type HogeAside as HogeAsideFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeNav as HogeNavFuga } from './hoge'`, errors: [ { message: `HogeNavFugaを正規表現 "/Nav$/" がmatchする名称に変更してください。
 - HogeNavが型の場合、'import type { HogeNav as HogeNavFuga }' もしくは 'import { type HogeNav as HogeNavFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeSection as HogeSectionFuga } from './hoge'`, errors: [ { message: `HogeSectionFugaを正規表現 "/Section$/" がmatchする名称に変更してください。
 - HogeSectionが型の場合、'import type { HogeSection as HogeSectionFuga }' もしくは 'import { type HogeSection as HogeSectionFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeModelessDialog as HogeModelessDialogFuga } from './hoge'`, errors: [ { message: `HogeModelessDialogFugaを正規表現 "/ModelessDialog$/" がmatchする名称に変更してください。
 - HogeModelessDialogが型の場合、'import type { HogeModelessDialog as HogeModelessDialogFuga }' もしくは 'import { type HogeModelessDialog as HogeModelessDialogFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: 'const Hoge = styled.h1``', errors: [ { message: `Hogeを正規表現 "/PageHeading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.h2``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.h3``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.h4``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.h5``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.h6``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(Heading)``', errors: [ { message: `Fugaを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeHeading)``', errors: [ { message: `Fugaを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeHeading).attrs(() => ({ type: "blockTitle" }))``', errors: [ { message: `Fugaを正規表現 "/Heading$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeArticle)``', errors: [ { message: `Fugaを正規表現 "/Article$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeAside)``', errors: [ { message: `Fugaを正規表現 "/Aside$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeNav)``', errors: [ { message: `Fugaを正規表現 "/Nav$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeSection)``', errors: [ { message: `Fugaを正規表現 "/Section$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeCenter)``', errors: [ { message: `Fugaを正規表現 "/Center$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeReel)``', errors: [ { message: `Fugaを正規表現 "/Reel$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeSidebar)``', errors: [ { message: `Fugaを正規表現 "/Sidebar$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Fuga = styled(HogeStack)``', errors: [ { message: `Fugaを正規表現 "/Stack$/" がmatchする名称に変更してください。` } ] },
    { code: 'const StyledArticle = styled.article``', errors: [ { message: `"article"を利用せず、smarthr-ui/Articleを拡張してください。Headingのレベルが自動計算されるようになります。(例: "styled.article" -> "styled(Article)")` } ] },
    { code: 'const StyledAside = styled.aside``', errors: [ { message: `"aside"を利用せず、smarthr-ui/Asideを拡張してください。Headingのレベルが自動計算されるようになります。(例: "styled.aside" -> "styled(Aside)")` } ] },
    { code: 'const StyledNav = styled.nav``', errors: [ { message: `"nav"を利用せず、smarthr-ui/Navを拡張してください。Headingのレベルが自動計算されるようになります。(例: "styled.nav" -> "styled(Nav)")` } ] },
    { code: 'const StyledSection = styled.section``', errors: [ { message: `"section"を利用せず、smarthr-ui/Sectionを拡張してください。Headingのレベルが自動計算されるようになります。(例: "styled.section" -> "styled(Section)")` } ] },
    { code: 'const StyledSection = styled.div``', errors: [ { message: `StyledSection は smarthr-ui/Section をextendすることを期待する名称になっています
 - childrenにHeadingを含まない場合、コンポーネントの名称から"Section"を取り除いてください
 - childrenにHeadingを含み、アウトラインの範囲を指定するためのコンポーネントならば、smarthr-ui/Sectionをexendしてください
   - "styled(Xxxx)" 形式の場合、拡張元であるXxxxコンポーネントの名称の末尾に"Section"を設定し、そのコンポーネント内でsmarthr-ui/Sectionを利用してください` } ] },
    { code: 'const StyledArticle = styled(Hoge)``', errors: [ { message: `StyledArticle は smarthr-ui/Article をextendすることを期待する名称になっています
 - childrenにHeadingを含まない場合、コンポーネントの名称から"Article"を取り除いてください
 - childrenにHeadingを含み、アウトラインの範囲を指定するためのコンポーネントならば、smarthr-ui/Articleをexendしてください
   - "styled(Xxxx)" 形式の場合、拡張元であるXxxxコンポーネントの名称の末尾に"Article"を設定し、そのコンポーネント内でsmarthr-ui/Articleを利用してください` } ] },
    { code: 'const StyledAside = styled(AsideXxxx)``', errors: [ { message: `StyledAside は smarthr-ui/Aside をextendすることを期待する名称になっています
 - childrenにHeadingを含まない場合、コンポーネントの名称から"Aside"を取り除いてください
 - childrenにHeadingを含み、アウトラインの範囲を指定するためのコンポーネントならば、smarthr-ui/Asideをexendしてください
   - "styled(Xxxx)" 形式の場合、拡張元であるXxxxコンポーネントの名称の末尾に"Aside"を設定し、そのコンポーネント内でsmarthr-ui/Asideを利用してください` } ] },
    { code: 'const StyledHeading = styled(Hoge)``', errors: [ { message: `StyledHeading は /(Heading|^h(1|2|3|4|5|6))$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - StyledHeading の名称の末尾が"Heading" という文字列ではない状態にしつつ、"Hoge"を継承していることをわかる名称に変更してください
 - もしくは"Hoge"を"StyledHeading"の継承元であることがわかるような名称に変更するか、適切な別コンポーネントに差し替えてください
   - 修正例1: const StyledXxxx = styled(Hoge)
   - 修正例2: const StyledHeadingXxxx = styled(Hoge)
   - 修正例3: const StyledHeading = styled(XxxxHeading)` } ] },
    { code: 'const StyledHeading = styled.div``', errors: [ { message: `StyledHeading は /(Heading|^h(1|2|3|4|5|6))$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - StyledHeading の名称の末尾が"Heading" という文字列ではない状態にしつつ、"div"を継承していることをわかる名称に変更してください
 - もしくは"div"を"StyledHeading"の継承元であることがわかるような適切なタグや別コンポーネントに差し替えてください
   - 修正例1: const StyledXxxx = styled.div
   - 修正例2: const StyledHeadingXxxx = styled.div
   - 修正例3: const StyledHeading = styled(XxxxHeading)` } ] },
    { code: '<><PageHeading>hoge</PageHeading><PageHeading>fuga</PageHeading></>', errors: [ { message: pageMessage } ] },
    { code: '<Heading>hoge</Heading>', errors: [ { message } ] },
    { code: '<><Heading>hoge</Heading><Heading>fuga</Heading></>', errors: [ { message }, { message } ] },
    { code: 'const Hoge = () => <FugaHeading anyArg={abc}>hoge</FugaHeading>', errors: [ { message } ] },
    { code: '<Section><Heading>hoge</Heading><Heading>fuga</Heading></Section>', errors: [ { message: lowerMessage } ] },
    { code: '<Section><PageHeading>hoge</PageHeading></Section>', errors: [ { message: pageInSectionMessage } ] },
    { code: '<Section><Heading tag="h2">hoge</Heading></Section>', errors: [ { message: noTagAttrMessage } ] },
    { code: '<Section></Section>', errors: [ { message: notHaveHeadingMessage('Section') } ] },
    { code: '<Aside><HogeSection></HogeSection></Aside>', errors: [ { message: notHaveHeadingMessage('Aside') }, { message: notHaveHeadingMessage('HogeSection') } ] },
    { code: '<Aside any="hoge"><HogeSection><Heading /></HogeSection></Aside>', errors: [ { message: notHaveHeadingMessage('Aside') } ] },
  ],
});
