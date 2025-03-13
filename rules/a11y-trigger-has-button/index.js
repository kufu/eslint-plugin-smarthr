const { getTagName, generateTagFormatter } = require('../../libs/format_styled_components')

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

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
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
        const tagName = getTagName(node)

        if (!tagName) {
          return
        }

        const match = tagName.match(/(Dropdown|Dialog)Trigger$/)

        if (!match || tagName.match(/HelpDialogTrigger$/)) {
          return
        }

        const children = filterFalsyJSXText(parentNode.children)

        if (children.length > 1) {
          context.report({
            node,
            message: `${match[1]}Trigger の直下には複数のコンポーネントを設置することは出来ません。buttonコンポーネントが一つだけ設置されている状態にしてください`,
          })

          return
        }

        children.forEach((c) => {
          // `<DialogTrigger>{button}</DialogTrigger>` のような場合は許可する
          if (c.type === 'JSXExpressionContainer') {
            return false
          }

          const tn = getTagName(c)

          if (
            c.type !== 'JSXElement' ||
            !tn.match(/(b|B)utton$/) ||
            tn.match(/AnchorButton$/)
          ) {
            context.report({
              node: c,
              message: `${match[1]}Trigger の直下にはbuttonコンポーネントのみ設置してください`,
            })
          }
        })
      },
    }
  },
}
module.exports.schema = []
