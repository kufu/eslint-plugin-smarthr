const { getTagName } = require('../../libs/format_styled_components')

const SCHEMA = [
  {
    type: 'object',
    required: [
      'componentName',
    ],
    properties: {
      componentPath: { type: 'string', default: '' },
      componentName: { type: 'string' },
      prohibitAttributies: { type: 'array', items: { type: 'string' }, default: [] },
    },
    additionalProperties: false,
  }
]

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    schema: SCHEMA,
  },
  create(context) {
    const { componentPath, componentName, prohibitAttributies } = context.options[0]
    let JSXAttribute = () => {}

    if (prohibitAttributies) {
      JSXAttribute = (node) => {
        const hit = prohibitAttributies.find((a) => a === node.name.name)

        if (hit) {
          context.report({
            node,
            message: `${hit} 属性は使用せず、 ${componentPath || componentName} コンポーネントを利用してください`,
          });
        }
      }
    }

    return {
      JSXAttribute,
      JSXOpeningElement: (node) => {
        // HINT: 翻訳コンポーネントはテキストとbrのみ許容する
        if (getTagName(node) === componentName) {
          let existValidChild = false
          let existNotBrElement = false

          node.parent.children.forEach((c) => {
            switch (c.type) {
              case 'JSXText':
                // HINT: 空白と改行のみの場合はテキストが存在する扱いにはしない
                if (c.value.replace(/(\s|\n)+/g, '')) {
                  existValidChild = true
                }

                break
              case 'JSXExpressionContainer':
                // TODO 変数がstringのみか判定できるなら対応したい
                existValidChild = true

                break
              case 'JSXElement':
                if (getTagName(c) !== 'br') {
                  existNotBrElement = true
                }

                break
            }
          })

          const message = (() => {
            if (existNotBrElement) {
              return `${componentName} 内では <br /> 以外のタグは使えません`
            } else if (!existValidChild && !node.attributes.some((a) => a.name.name === 'dangerouslySetInnerHTML')) {
              return `${componentName} 内には必ずテキストを設置してください`
            }
          })()

          if (message) {
            context.report({
              node,
              message,
            });
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
