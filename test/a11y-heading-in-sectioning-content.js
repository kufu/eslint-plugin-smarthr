const rule = require('../rules/a11y-heading-in-sectioning-content');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
});

const lowerMessage = `smarthr-ui/Headingと紐づく内容の範囲（アウトライン）が曖昧になっています。
 - smarthr-uiのArticle, Aside, Nav, SectionのいずれかでHeadingコンポーネントと内容をラップしてHeadingに対応する範囲を明確に指定してください。`
const message = `${lowerMessage}
 - Headingをh1にしたい場合(機能名、ページ名などこのページ内でもっとも重要な見出しの場合)、smarthr-ui/PageHeadingを利用してください。その場合はSectionなどでアウトラインを示す必要はありません。`
const pageMessage = 'smarthr-ui/PageHeading が同一ファイル内に複数存在しています。PageHeadingはh1タグを出力するため最も重要な見出しにのみ利用してください。'
const pageInSectionMessage = 'smarthr-ui/PageHeadingはsmarthr-uiのArticle, Aside, Nav, Sectionで囲まないでください。囲んでしまうとページ全体の見出しではなくなってしまいます。'

ruleTester.run('a11y-heading-in-sectioning-content', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
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
    { code: '<PageHeading>hoge</PageHeading>' },
    { code: '<Section><Heading>hoge</Heading></Section>' },
    { code: '<><Section><Heading>hoge</Heading></Section><Section><Heading>fuga</Heading></Section></>' },
    { code: 'const HogeHeading = () => <FugaHeading anyArg={abc}>hoge</FugaHeading>' },
    { code: 'export const HogeHeading = () => <FugaHeading anyArg={abc}>hoge</FugaHeading>' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: 'const Hoge = styled.h1``', errors: [ { message: `Hogeを正規表現 "/PageHeading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.h2``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.h3``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.h4``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.h5``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.h6``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Fuga = styled(Heading)``', errors: [ { message: `Fugaを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Fuga = styled(HogeHeading)``', errors: [ { message: `Fugaを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
    { code: 'const Fuga = styled(HogeArticle)``', errors: [ { message: `Fugaを正規表現 "/Article$/" がmatchする名称に変更してください` } ] },
    { code: 'const Fuga = styled(HogeAside)``', errors: [ { message: `Fugaを正規表現 "/Aside$/" がmatchする名称に変更してください` } ] },
    { code: 'const Fuga = styled(HogeNav)``', errors: [ { message: `Fugaを正規表現 "/Nav$/" がmatchする名称に変更してください` } ] },
    { code: 'const Fuga = styled(HogeSection)``', errors: [ { message: `Fugaを正規表現 "/Section$/" がmatchする名称に変更してください` } ] },
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
    { code: '<><PageHeading>hoge</PageHeading><PageHeading>fuga</PageHeading></>', errors: [ { message: pageMessage } ] },
    { code: '<Heading>hoge</Heading>', errors: [ { message } ] },
    { code: '<><Heading>hoge</Heading><Heading>fuga</Heading></>', errors: [ { message }, { message } ] },
    { code: 'const Hoge = () => <FugaHeading anyArg={abc}>hoge</FugaHeading>', errors: [ { message } ] },
    { code: '<Section><Heading>hoge</Heading><Heading>fuga</Heading></Section>', errors: [ { message: lowerMessage } ] },
    { code: '<Section><PageHeading>hoge</PageHeading></Section>', errors: [ { message: pageInSectionMessage } ] },
  ],
});
