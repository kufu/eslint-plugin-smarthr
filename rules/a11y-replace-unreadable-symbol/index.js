const TILDE_REGEX = /([~〜])/

const SCHEMA = []

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    return {
      JSXText: (node) => {
        const matcher = node.value.match(TILDE_REGEX)

        if (matcher) {
          context.report({
            node,
            message: `"${matcher[1]}"はスクリーンリーダーが正しく読み上げることができない場合があるため、smarthr-ui/RangeSeparatorに置き換えてください。
 - エラー表示されている行に"${matcher[1]}"が存在しない場合、改行文字を含む関係で行番号がずれている場合があります。数行下の範囲を確認してください
 - smarthr-ui/RangeSeparatorに置き換えることでスクリーンリーダーが "から" と読み上げることができます
 - 前後の文脈などで "から" と読まれることが不適切な場合 \`<RangeSeparator decorators={{ visuallyHiddenText: () => "ANY" }} />\` のようにdecoratorsを指定してください`,
          })
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
