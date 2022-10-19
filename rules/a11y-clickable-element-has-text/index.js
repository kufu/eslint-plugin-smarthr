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
  '^a$': '(Anchor|Link)$',
}

const filterFalsyJSXText = (cs) => cs.filter((c) => (
  !(c.type === 'JSXText' && c.value.match(/^\s*\n+\s*$/))
))

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      'format-styled-components': '{{ message }}',
      'a11y-clickable-element-has-text': '{{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const componentsWithText = option.componentsWithText || []

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXElement: (parentNode) => {
        // HINT: 閉じタグが存在しない === テキストノードが存在しない
        if (!parentNode.closingElement) {
          return
        }

        const node = parentNode.openingElement

        if (!node.name.name || !node.name.name.match(/^(a|(.*?)Anchor(Button)?|(.*?)Link|(b|B)utton)$/)) {
          return
        }

        const recursiveSearch = (c) => {
          if (['JSXText', 'JSXExpressionContainer'].includes(c.type)) {
            return true
          }

          if (c.type === 'JSXFragment') {
            if (c.children && filterFalsyJSXText(c.children).some(recursiveSearch)) {
              return true
            }

            return false
          }

          if (c.type === 'JSXElement') {
            // // HINT: SmartHRLogo コンポーネントは内部でaltを持っているため対象外にする
            if (c.openingElement.name.name.match(/SmartHRLogo$/)) {
              return true
            }

            if (componentsWithText.includes(c.openingElement.name.name)) {
              return true
            }

            // HINT: role & aria-label を同時に設定されている場合は許可
            let existRole = false
            let existAriaLabel = false
            const result = c.openingElement.attributes.reduce((prev, a) =>  {
              existRole = existRole || (a.name.name === 'role' && a.value.value === 'img')
              existAriaLabel = existAriaLabel || a.name.name === 'aria-label'

              if (prev) {
                return prev
              }

              if (!['visuallyHiddenText', 'alt'].includes(a.name.name)) {
                return prev
              }

              return (!!a.value.value || a.value.type === 'JSXExpressionContainer') ? a : prev
            }, null)
            
            if (result || (existRole && existAriaLabel)) {
              return true
            }

            if (c.children && filterFalsyJSXText(c.children).some(recursiveSearch)) {
              return true
            }
          }

          return false
        }

        const child = filterFalsyJSXText(parentNode.children).find(recursiveSearch)

        if (!child) {
          context.report({
            node,
            messageId: 'a11y-clickable-element-has-text',
            data: {
              message: 'a, button要素にはテキストを設定してください。要素内にアイコン、画像のみを設置する場合はSmartHR UIのvisuallyHiddenText、通常のHTML要素にはaltなどの代替テキスト用属性を指定してください',
            },
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
