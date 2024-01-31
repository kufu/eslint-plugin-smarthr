const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'Article$': '(Article)$',
  'Aside$': '(Aside)$',
  'Nav$': '(Nav)$',
  'Section$': '(Section)$',
  'Center$': '(Center)$',
  'Reel$': '(Reel)$',
  'Sidebar$': '(Sidebar)$',
  'Stack$': '(Stack)$',
}

const UNEXPECTED_NAMES = EXPECTED_NAMES

const BARE_SECTIONING_TAG_REGEX = /^(article|aside|nav|section)$/
const SECTIONING_REGEX = /((A(rticle|side))|Nav|Section)$/
const SECTIONING_FRAGMENT_REGEX = /^SectioningFragment$/
const LAYOUT_REGEX = /((C(ent|lust)er)|Reel|Sidebar|Stack)$/
const AS_REGEX = /^(as|forwardedAs)$/

const includeSectioningAsAttr = (a) => a.name?.name?.match(AS_REGEX) && a.value.value?.match(BARE_SECTIONING_TAG_REGEX)

const searchSectioningFragment = (node) => {
  switch (node.type) {
    case 'JSXElement':
      return node.openingElement.name?.name?.match(SECTIONING_FRAGMENT_REGEX) ? node.openingElement : null
    case 'Program':
      return null
  }

  return searchSectioningFragment(node.parent)
}

const SCHEMA = []

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const name = node.name?.name || ''
        let hit = null
        let asAttr = null

        if (name.match(SECTIONING_REGEX)) {
          hit = true
        } else {
          asAttr = name.match(LAYOUT_REGEX) && node.attributes.find(includeSectioningAsAttr)

          if (asAttr) {
            hit = true
          }
        }

        if (hit) {
          result = searchSectioningFragment(node.parent.parent)

          if (result) {
            context.report({
              node: result,
              message: `無意味なSectioningFragmentが記述されています。子要素である<${name}${asAttr ? ` ${asAttr.name.name}="${asAttr.value.value}"` : ''}>で問題なくセクションは設定されているため、このSectioningFragmentは削除してください`
            })
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
