const rule = require('../rules/best-practice-for-button-element')
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
const ERRORMESSAGE_REQUIRED_TYPE_ATTR = `button要素を利用する場合、type属性に "button" もしくは "submit" を指定してください
 - button要素のtype属性のデフォルトは "submit" のため、button要素がformでラップされていると意図しないsubmitを引き起こす可能性があります
 - smarthr-ui/Button, smarthr-ui/UnstyledButtonのtype属性のデフォルトは "button" になっているため、buttonから置き換えることをおすすめします`
const ERRORMESSAGE_PROHIBIT_STYLED = `"styled.button" の直接利用をやめ、smarthr-ui/Button、もしくはsmarthr-ui/UnstyledButtonを利用してください
 - button要素のtype属性のデフォルトは "submit" のため、button要素がformでラップされていると意図しないsubmitを引き起こす可能性があります
 - smarthr-ui/Button, smarthr-ui/UnstyledButtonのtype属性のデフォルトは "button" になっているため、buttonから置き換えることをおすすめします`

ruleTester.run('best-practice-for-button-element', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `<Button />` },
    { code: `<Button>ほげ</Button>` },
    { code: `<AnyButton>ほげ</AnyButton>` },
    { code: `<button type="button">any</button>` },
    { code: `<button type="submit">any</button>` },
    { code: 'const HogeButton = styled(HogeButton)``' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `<button>ほげ</button>`, errors: [ { message: ERRORMESSAGE_REQUIRED_TYPE_ATTR } ] },
    { code: 'const HogeButton = styled.button``', errors: [ { message: ERRORMESSAGE_PROHIBIT_STYLED } ] },
  ]
})
