const rule = require('../rules/a11y-prohibit-useless-sectioning-fragment')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})
const error = (tag) => `無意味なSectioningFragmentが記述されています。子要素である${tag}で問題なくセクションは設定されているため、このSectioningFragmentは削除してください`

ruleTester.run('a11y-prohibit-useless-sectioning-fragment', rule, {
  valid: [
    { code: `<SectioningFragment>hoge</SectioningFragment>` },
    { code: `<Section><SectioningFragment>hoge</SectioningFragment></Section>` },
    { code: `<AnyAside><SectioningFragment>hoge</SectioningFragment></AnyAside>` },
    { code: `<AnyNav>hoge</AnyNav>` },
    { code: `<AnyArticle>hoge</AnyArticle>` },
  ],
  invalid: [
    { code: `<SectioningFragment><AnySection /></SectioningFragment>`, errors: [ { message: error('<AnySection>') } ] },
    { code: `<SectioningFragment><AnyAside>hoge</AnyAside></SectioningFragment>`, errors: [ { message: error('<AnyAside>') } ] },
    { code: `<SectioningFragment><HogeStack as="aside">hoge</HogeStack></SectioningFragment>`, errors: [ { message: error('<HogeStack as="aside">') } ] },
    { code: `<SectioningFragment><HogeReel forwardedAs="nav">hoge</HogeReel></SectioningFragment>`, errors: [ { message: error('<HogeReel forwardedAs="nav">') } ] },
    { code: `<SectioningFragment><FugaBase as="article">hoge</FugaBase></SectioningFragment>`, errors: [ { message: error('<FugaBase as="article">') } ] },
    { code: `<SectioningFragment><FugaBaseColumn as="article">hoge</FugaBaseColumn></SectioningFragment>`, errors: [ { message: error('<FugaBaseColumn as="article">') } ] },
  ]
})
