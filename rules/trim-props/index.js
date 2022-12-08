module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'trim-props': '{{ message }}',
    },
    schema: [],
    fixable: 'whitespace',
  },
  create(context) {
    return {
      JSXOpeningElement: (node) =>
        node.attributes.reduce((prev, current) => {
          const attribute = current.value?.type === 'JSXExpressionContainer' ? current.value.expression : current.value
          const props = attribute?.value

          if (typeof props !== 'string') return prev

          if (props.match(/(^\s+|\s+$)/)) {
            return context.report({
              node,
              loc: current.loc,
              messageId: 'trim-props',
              data: {
                message: '属性に設定している文字列から先頭、末尾の空白文字を削除してください',
              },
              fix(fixer) {
                return fixer.replaceTextRange([attribute.range[0] + 1, attribute.range[1] - 1], props.trim())
              },
            })
          }
          return prev
        }, []),
    }
  },
}
module.exports.schema = []
