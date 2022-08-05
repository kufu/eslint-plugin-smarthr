const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'DropdownTrigger$': 'DropdownTrigger$',
  'DialogTrigger$': 'DialogTrigger$',
  '(b|B)utton$': 'Button$',
  'AnchorButton$': 'AnchorButton$',
  'ButtonAnchor$': 'ButtonAnchor$',
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  '^a$': '(Anchor|Link)$',
}

const filterFalsyJSXText = (cs) => cs.filter((c) => (
  !(c.type === 'JSXText' && c.value.match(/^\s*\n+\s*$/))
))

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'format-styled-components': '{{ message }}',
      'a11y-trigger-has-button': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXElement: (parentNode) => {
        // HINT: 閉じタグが存在しない === 子が存在しない
        // 子を持っていない場合はおそらく固定の要素を吐き出すコンポーネントと考えられるため
        // その中身をチェックすることで担保できるのでskipする
        if (!parentNode.closingElement) {
          return
        }

        const node = parentNode.openingElement

        if (!node.name.name) {
          return
        }

        const match = node.name.name.match(/(Dropdown|Dialog)Trigger$/)

        if (!match || node.name.name.match(/HelpDialogTrigger$/)) {
          return
        }

        filterFalsyJSXText(parentNode.children).forEach((c) => {
          // `<DialogTrigger>{button}</DialogTrigger>` のような場合は許可する
          if (c.type === 'JSXExpressionContainer') {
            return false
          }

          if (
            c.type !== 'JSXElement' ||
            !c.openingElement.name.name.match(/(b|B)utton$/) ||
            c.openingElement.name.name.match(/AnchorButton?/)
          ) {
            context.report({
              node: c,
              messageId: 'a11y-trigger-has-button',
              data: {
                message: `${match[1]}Trigger の直下にはbuttonコンポーネントのみ設置してください`,
              },
            })
          }
        })
      },
    }
  },
}
module.exports.schema = []
