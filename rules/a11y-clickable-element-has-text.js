const EXPECTED_NAMES = {
  'TextButton$': 'TextButton$',
  '(b|B)utton$': 'Button$',
  'AnchorButton$': 'AnchorButton$',
  'TextButtonAnchor$': 'TextButtonAnchor$',
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
      'a11y-clickable-element-has-text': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration: (node) => {
        if (node.source.value !== 'styled-components') {
          return
        }

        const invalidNameNode = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== 'styled')

        if (invalidNameNode) {
          context.report({
            node: invalidNameNode,
            messageId: 'a11y-clickable-element-has-text',
            data: {
              message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`",
            },
          });
        }
      },
      TaggedTemplateExpression: (node) => {
        const { tag } = node
        const base = (() => {
          if (tag.type === 'CallExpression' && tag.callee.name === 'styled') {
            return tag.arguments[0].name
          }

          if (tag?.object?.name === 'styled') {
            return tag.property.name
          }

          return null
        })()

        if (!base) {
          return
        }

        const extended = node.parent.id.name

        let extendedregex = null

        Object.entries(EXPECTED_NAMES).forEach(([b, e]) => {
          if (base.match(new RegExp(b))) {
            extendedregex = new RegExp(e)

            if (!extended.match(extendedregex)) {
              context.report({
                node: node.parent,
                messageId: 'a11y-clickable-element-has-text',
                data: {
                  message: `${extended}を正規表現 "${extendedregex.toString()}" がmatchする名称に変更してください`,
                },
              });
            }
          }
        })

        // if (!extendedregex) {
        //   if (!['div', 'p', 'span', 'dl', 'dt', 'dd'].includes(base)) {
        //     console.log(base, extended)
        //   }
        // }
      },
      JSXOpeningElement: (node) => {
        if (!node.name.name || !node.name.name.match(/^(a|(.*?)Anchor(Button)?|(.*?)Link|(b|B)utton)$/)) {
          return
        }

        const recursiveSearch = (c) => {
          if (['JSXText', 'JSXExpressionContainer'].includes(c.type)) {
            return true
          }

          if (c.type === 'JSXElement') {
            if (c.openingElement.attributes.some((a) => (['visuallyHiddenText', 'alt'].includes(a.name.name) && !!a.value.value))) {
              return true
            }

            if (c.children && filterFalsyJSXText(c.children).some(recursiveSearch)) {
              return true
            }
          }

          return false
        }

        const child = filterFalsyJSXText(node.parent.children).find(recursiveSearch)

        if (!child) {
          context.report({
            node,
            messageId: 'a11y-clickable-element-has-text',
            data: {
              message: 'a, button要素にはテキストを設定してください。リンク要素内にアイコン、画像を設置する場合はvisuallyHiddenText、altなどの代替テキスト用属性を指定してください',
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
