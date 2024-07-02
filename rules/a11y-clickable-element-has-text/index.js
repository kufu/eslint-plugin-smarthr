const { generateTagFormatter } = require('../../libs/format_styled_components')

const SCHEMA = [
  {
    type: 'object',
    properties: {
      componentsWithText: { type: 'array', items: { type: 'string' }, default: [] },
    },
    additionalProperties: false,
  }
]

const EXPECTED_NAMES = {
  'SmartHRLogo$': 'SmartHRLogo$',
  '(b|B)utton$': 'Button$',
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  'Text$': 'Text$',
  'Message$': 'Message$',
  '^a$': '(Anchor|Link)$',
}

const UNEXPECTED_NAMES = {
  '(B|^b)utton$': '(Button)$',
  '(Anchor|^a)$': '(Anchor)$',
  '(Link|^a)$': '(Link)$',
}

const REGEX_NLSP = /^\s*\n+\s*$/
const REGEX_CLICKABLE_ELEMENT = /^(a|(.*?)Anchor(Button)?|(.*?)Link|(b|B)utton)$/
const REGEX_SMARTHR_LOGO = /SmartHRLogo$/
const REGEX_TEXT_COMPONENT = /(Text|Message)$/
const REGEX_JSX_TYPE = /^(JSXText|JSXExpressionContainer)$/

const filterFalsyJSXText = (cs) => cs.filter(checkFalsyJSXText)
const checkFalsyJSXText = (c) => (
  !(c.type === 'JSXText' && c.value.match(REGEX_NLSP))
)

const message = `a, buttonなどのクリッカブルな要素内にはテキストを設定してください
 - 要素内にアイコン、画像のみを設置する場合はaltなどの代替テキスト用属性を指定してください
  - SVG component の場合、altを属性として受け取れるようにした上で '<svg role="img" aria-label={alt}>' のように指定してください
 - クリッカブルな要素内に設置しているコンポーネントがテキストを含んでいる場合、"XxxxText" のように末尾に "Text" もしくは "Message" という名称を設定してください`

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const componentsWithText = option.componentsWithText || []

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXElement: (parentNode) => {
        // HINT: 閉じタグが存在しない === テキストノードが存在しない
        if (!parentNode.closingElement) {
          return
        }

        const node = parentNode.openingElement

        if (!node.name.name || !node.name.name.match(REGEX_CLICKABLE_ELEMENT)) {
          return
        }

        const recursiveSearch = (c) => {
          if (REGEX_JSX_TYPE.test(c.type)) {
            return true
          }

          switch (c.type) {
            case 'JSXFragment': {
              return c.children && filterFalsyJSXText(c.children).some(recursiveSearch)
            }
            case 'JSXElement': {
              // // HINT: SmartHRLogo コンポーネントは内部でaltを持っているため対象外にする
              if (c.openingElement.name.name.match(REGEX_SMARTHR_LOGO)) {
                return true
              }

              const tagName = c.openingElement.name.name

              if (tagName.match(REGEX_TEXT_COMPONENT) || componentsWithText.includes(tagName)) {
                return true
              }

              // HINT: role & aria-label を同時に設定されている場合か、text属性が設定されている場合許可
              let existRole = false
              let existAriaLabel = false
              const result = c.openingElement.attributes.reduce((prev, a) =>  {
                const n = a.name.name

                if (prev || n === 'text') {
                  return true
                }

                const v = a.value?.value

                existRole = existRole || (n === 'role' && v === 'img')
                existAriaLabel = existAriaLabel || n === 'aria-label'

                if (existRole && existAriaLabel) {
                  return true
                }

                return n === 'alt' && (v || a.value.type === 'JSXExpressionContainer') || false
              }, null)

              return result || (c.children && filterFalsyJSXText(c.children).some(recursiveSearch))
            }
          }

          return false
        }

        if (!filterFalsyJSXText(parentNode.children).find(recursiveSearch)) {
          context.report({
            node,
            message,
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
