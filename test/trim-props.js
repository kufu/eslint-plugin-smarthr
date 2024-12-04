const rule = require('../rules/trim-props')
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

ruleTester.run('trim-props', rule, {
  valid: [
    { code: '<a href="https://www.google.com">google</a>' },
    { code: '<a href={"https://www.google.com"}>google</a>' },
    { code: '<img src="/sample.jpg" alt="sample" />' },
    { code: '<img src={"/sample.jpg"} alt={"sample"} />' },
    { code: '<div data-spec="info-area">....</div>' },
  ],
  invalid: [
    {
      code: '<a href=" https://www.google.com">google</a>',
      output: '<a href="https://www.google.com">google</a>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<a href="https://www.google.com ">google</a>',
      output: '<a href="https://www.google.com">google</a>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<a href=" https://www.google.com ">google</a>',
      output: '<a href="https://www.google.com">google</a>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<a href={" https://www.google.com"}>google</a>',
      output: '<a href={"https://www.google.com"}>google</a>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<a href={"https://www.google.com "}>google</a>',
      output: '<a href={"https://www.google.com"}>google</a>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<a href={" https://www.google.com "}>google</a>',
      output: '<a href={"https://www.google.com"}>google</a>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<img src=" /sample.jpg" alt="sample " />',
      output: '<img src="/sample.jpg" alt="sample" />',
      errors: [
        { message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' },
        { message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' },
      ],
    },
    {
      code: '<img src={" /sample.jpg"} alt={"sample "} />',
      output: '<img src={"/sample.jpg"} alt={"sample"} />',
      errors: [
        { message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' },
        { message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' },
      ],
    },
    {
      code: '<div data-spec=" info-area ">....</div>',
      output: '<div data-spec="info-area">....</div>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
    {
      code: '<div data-spec={" info-area "}>....</div>',
      output: '<div data-spec={"info-area"}>....</div>',
      errors: [{ message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください' }],
    },
  ],
})