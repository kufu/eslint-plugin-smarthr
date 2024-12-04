const rule = require('../rules/design-system-guideline-prohibit-double-icons')
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
const generateErrorText = (name) => `${name} には prefix と suffix は同時に設定できません。
 - prefix または suffix のみを設定してください。
 - どちらにもアイコンをつけられそうな場合は、アイコン付き（右）（サフィックス）を優先し、アイコン付き（左）（プレフィックス）には指定しないでください。
 - 両方設定したい場合は、'eslint-disable-next-line' 等を利用して、このルールを無効化してください。`

ruleTester.run('design-system-guideline-prohibit-double-icons', rule, {
  valid: [
    { code: `<Button>hoge</Button>` },
    { code: `<Button suffix={SUFFIX}>hoge</Button>` },
    { code: `<Button prefix="PREFIX">hoge</Button>` },
    { code: `<TextLink>hoge</TextLink>` },
    { code: `<TextLink suffix="SUFFIX">hoge</TextLink>` },
    { code: `<TextLink prefix={PREFIX}>hoge</TextLink>` },
    { code: `<StyledButton>hoge</StyledButton>` },
    { code: `<StyledLink>hoge</StyledLink>` },
    { code: `<Input prefix={PREFIX} suffix={SUFFIX} />` },
  ],
  invalid: [
    { code: `<Button suffix={SUFFIX} prefix={PREFIX}>hoge</Button>`, errors: [{message: generateErrorText('Button')}]},
    { code: `<Button suffix prefix>hoge</Button>`, errors: [{message: generateErrorText('Button')}]},
    { code: `<StyledButton suffix={undefined} prefix={null}>hoge</StyledButton>`, errors: [{message: generateErrorText('StyledButton')}]},
    { code: `<Link prefix="PREFIX" suffix="SUFFIX">hoge</Link>`, errors: [{message: generateErrorText('Link')}]},
    { code: `<StyledLink prefix="PREFIX" suffix="SUFFIX">hoge</StyledLink>`, errors: [{message: generateErrorText('StyledLink')}]},
  ]
})
