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

const rootMessage = 'Headingと紐づく内容の範囲（アウトライン）が曖昧になっています。コンポーネント全体に対するHeadingではない場合、Sectioning Content(Article, Aside, Nav, Section)でHeadingコンポーネントと内容をラップしてHeadingに対応する範囲を明確に指定してください。現在のマークアップの構造を変更したくない場合はSectioningFragmentコンポーネントを利用してください。コンポーネント全体に対するHeadingの場合、他のHeadingのアウトラインが明確に指定されればエラーにならなくなります。'
const message = 'Headingと紐づく内容の範囲（アウトライン）が曖昧になっています。Sectioning Content(Article, Aside, Nav, Section)でHeadingコンポーネントと内容をラップしてHeadingに対応する範囲を明確に指定してください。現在のマークアップの構造を変更したくない場合はSectioningFragmentコンポーネントを利用してください。'

ruleTester.run('a11y-heading-in-sectioning-content', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: 'const HogeHeading = styled.h1``' },
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
    { code: '<Heading>hoge</Heading>' },
    { code: '<HogeHeading>hoge</HogeHeading>' },
    { code: '<><Heading>hoge</Heading><Section><Heading>hoge</Heading></Section></>' },
    { code: '<><Heading>hoge</Heading><Aside><Heading>hoge</Heading></Aside></>' },
    { code: '<><Heading>hoge</Heading><Article><Heading>hoge</Heading></Article></>' },
    { code: '<><Heading>hoge</Heading><Nav><Heading>hoge</Heading></Nav></>' },
    { code: '<><Heading>hoge</Heading><SectioningFragment><Heading>hoge</Heading></SectioningFragment></>' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: 'const Hoge = styled.h1``', errors: [ { message: `Hogeを正規表現 "/Heading$/" がmatchする名称に変更してください` } ] },
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
    { code: '<><Heading>hoge</Heading><Heading>hoge</Heading></>', errors: [ { message: rootMessage }, { message: rootMessage } ] },
    { code: '<><Heading>hoge</Heading><Section><Heading>hoge</Heading><Heading>hoge</Heading></Section></>', errors: [ { message }, { message } ] },
    { code: '<article>hoge</article>', errors: [ { message: `"article"を利用せず、smarthr-ui/Articleを拡張してください。Headingのレベルが自動計算されるようになります。` } ] },
    { code: '<aside>hoge</aside>', errors: [ { message: `"aside"を利用せず、smarthr-ui/Asideを拡張してください。Headingのレベルが自動計算されるようになります。` } ] },
    { code: '<nav>hoge</nav>', errors: [ { message: `"nav"を利用せず、smarthr-ui/Navを拡張してください。Headingのレベルが自動計算されるようになります。` } ] },
    { code: '<section>hoge</section>', errors: [ { message: `"section"を利用せず、smarthr-ui/Sectionを拡張してください。Headingのレベルが自動計算されるようになります。` } ] },
  ],
});
