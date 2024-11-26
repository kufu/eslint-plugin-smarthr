const { generateTagFormatter } = require('../../libs/format_styled_components')

const LAYOUT_EXPECTED_NAMES = {
  'Center$': '(Center)$',
  'Cluster$': '(Cluster)$',
  'Reel$': '(Reel)$',
  'Sidebar$': '(Sidebar)$',
  'Stack$': '(Stack)$',
  'Base$': '(Base)$',
  'BaseColumn$': '(BaseColumn)$',
}
const EXPECTED_NAMES = {
  ...LAYOUT_EXPECTED_NAMES,
  'PageHeading$': '(PageHeading)$',
  'Heading$': '(Heading)$',
  '^h1$': '(PageHeading)$',
  '^h(|2|3|4|5|6)$': '(Heading)$',
}

const UNEXPECTED_NAMES = {
  ...LAYOUT_EXPECTED_NAMES,
  '(Heading|^h(1|2|3|4|5|6))$': '(Heading)$',
}

const layoutRegex = /((C(ent|lust)er)|Reel|Sidebar|Stack|Base(Column)?)$/
const headingRegex = /((^h(1|2|3|4|5|6))|Heading)$/
const asRegex = /^(as|forwardedAs)$/
const formControlRegex = /(FormControl|Fieldset)$/

const findAsAttr = (a) => a.name?.name.match(asRegex)

const searchBubbleUp = (node) => {
  switch (node.type) {
    case 'Program':
      // rootまで検索した場合は確定でエラーにする
      return null
    case 'JSXElement': {
      const name = node.openingElement.name.name || ''

      if (headingRegex.test(name)) {
        return name
      }

      break
    }
    case 'JSXAttribute': {
      const name = node.name.name || ''

      if (name === 'title' && formControlRegex.test(node.parent.name.name)) {
        return `${node.parent.name.name}のtitle属性`
      }
    }
  }

  return searchBubbleUp(node.parent)
}

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
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const name = node.name.name || ''

        if (layoutRegex.test(name) && !node.attributes.some(findAsAttr)) {
          const parentName = searchBubbleUp(node.parent.parent)

          if (parentName) {
            context.report({
              node,
              message: `${name}は${parentName}内に存在するため、as、もしくはforwardedAs属性を指定し、div以外の要素にする必要があります
 - smarthr-ui/Layoutに属するコンポーネントはデフォルトでdiv要素を出力するため${parentName}内で利用すると、マークアップの仕様に違反します
 - ほぼすべての場合、spanを指定することで適切なマークアップに変更出来ます
 - span以外を指定したい場合、記述コンテンツに属する要素かどうかを確認してください (https://developer.mozilla.org/ja/docs/Web/HTML/Content_categories#%E8%A8%98%E8%BF%B0%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84)`,
            })
          }
        }
      },
    }
  },
}

module.exports.schema = []
