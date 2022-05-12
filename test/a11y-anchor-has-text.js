const rule = require('../rules/a11y-anchor-has-text')
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

const defaultErrorMessage = 'リンク要素にはテキストを設定してください。リンク要素内にアイコン、画像を設置する場合はvisuallyHiddenText、altなどの代替テキスト用属性を指定してください'

ruleTester.run('a11y-anchor-has-text', rule, {
  valid: [
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
  ],
  invalid: [
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
  ]
})
