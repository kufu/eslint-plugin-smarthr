const rule = require('../rules/a11y-replace-unreadable-symbol')
const RuleTester = require('eslint').RuleTester

const generateErrorText = (symbol, replaced, read) => `"${symbol}"はスクリーンリーダーが正しく読み上げることができない場合があるため、smarthr-ui/${replaced}に置き換えてください。
 - エラー表示されている行に"${symbol}"が存在しない場合、改行文字を含む関係で行番号がずれている場合があります。数行下の範囲を確認してください
 - smarthr-ui/${replaced}に置き換えることでスクリーンリーダーが "${read}" と読み上げることができます
 - 前後の文脈などで "${read}" と読まれることが不適切な場合 \`<RangeSeparator decorators={{ visuallyHiddenText: () => "ANY" }} />\` のようにdecoratorsを指定してください`

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('a11y-replace-unreadable-symbol', rule, {
  valid: [
    { code: `<>ほげふが</>` },
    { code: `<RangeSeparator />` },
    { code: `<p>ほげ<RangeSeparator />ふが</p>` },
    { code: `<p>
      ほげ
      <RangeSeparator />
      ふが
    </p>` },
  ],
  invalid: [
    { code: `<>~</>`, errors: [ { message: generateErrorText('~', 'RangeSeparator', 'から') } ] },
    { code: `<>ほげ~ふが</>`, errors: [ { message: generateErrorText('~', 'RangeSeparator', 'から') } ] },
    { code: `<p>ほげ〜ふが</p>`, errors: [ { message: generateErrorText('〜', 'RangeSeparator', 'から') } ] },
  ]
})
