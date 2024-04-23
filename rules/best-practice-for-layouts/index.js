const { generateTagFormatter } = require('../../libs/format_styled_components')

const MULTI_CHILDREN_EXPECTED_NAMES = {
  'Cluster$': '(Cluster)$',
  'Stack$': '(Stack)$',
}
const EXPECTED_NAMES = {
  ...MULTI_CHILDREN_EXPECTED_NAMES,
  'Center$': '(Center)$',

}

const UNEXPECTED_NAMES = EXPECTED_NAMES

const MULTI_CHILDREN_REGEX = new RegExp(`(${Object.keys(MULTI_CHILDREN_EXPECTED_NAMES).join('|')})`)
const REGEX_NLSP = /^\s*\n+\s*$/
const FLEX_END_REGEX = /^(flex-)?end$/

const filterFalsyJSXText = (cs) => cs.filter(checkFalsyJSXText)
const checkFalsyJSXText = (c) => (
  !(
    c.type === 'JSXText' && c.value.match(REGEX_NLSP) ||
    c.type === 'JSXEmptyExpression'
  )
)

const searchChildren = (node) => {
  if (
    node.type === 'JSXFragment' ||
    node.type === 'JSXElement' && node.openingElement.name?.name === 'SectioningFragment'
  ) {
    const children = node.children.filter(checkFalsyJSXText)

    if (children.length > 1) {
      return false
    }
  }

  switch(node.type) {
    case 'JSXExpressionContainer':
    case 'ChainExpression':
      return searchChildren(node.expression)
    case 'CallExpression':
      return node.callee.property?.name !== 'map'
    case 'ConditionalExpression':
      return searchChildren(node.consequent) && searchChildren(node.alternate)
    case 'LogicalExpression':
      return searchChildren(node.right)
  }

  return true
}

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
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name;

        if (nodeName && !node.selfClosing) {
          const matcher = nodeName.match(MULTI_CHILDREN_REGEX)

          if (matcher) {
            const layoutType = matcher[1]
            let justifyAttr = null
            let alignAttr = null
            let gapAttr = null

            node.attributes.forEach((a) => {
              switch (a.name?.name) {
                case 'justify':
                  justifyAttr = a
                  break
                case 'align':
                  alignAttr = a
                  break
                case 'gap':
                  gapAttr = a
                  break
              }
            })

            if (layoutType === 'Stack') {
              if (alignAttr && FLEX_END_REGEX.test(alignAttr.value.value)) {
                return
              } else if (gapAttr?.value.type === 'JSXExpressionContainer' && gapAttr.value.expression.value === 0) {
                context.report({
                  node,
                  message: `${nodeName} に "gap={0}" が指定されており、smarthr-ui/${layoutType} の利用方法として誤っている可能性があります。以下の修正方法を検討してください。
 - 方法1: 子要素を一つにまとめられないか検討してください
   - 例: "<Stack gap={0}><p>hoge</p><p>fuga</p></Stack>" を "<p>hoge<br />fuga</p>" にするなど
 - 方法2: 子要素のstyleを確認しgap属性を0以外にできないか検討してください
   - 子要素が個別に持っているmarginなどのstyleを${nodeName}のgap属性で共通化できないか確認してください
 - 方法3: 別要素でマークアップし直すか、${nodeName}を削除してください
   - 親要素に smarthr-ui/Cluster, smarthr-ui/Stack などが存在している場合、div・spanなどで1要素にまとめる必要がある場合があります
   - as, forwardedAsなどでSectioningContent系要素に変更している場合、対応するsmarthr-ui/Section, Aside, Nav, Article のいずれかに差し替えてください`
                })
              }
            }

            const children = node.parent.children.filter(checkFalsyJSXText)

            if (children.length === 1) {
              if (justifyAttr && FLEX_END_REGEX.test(justifyAttr.value.value)) {
                return
              }


              if (searchChildren(children[0])) {
                context.report({
                  node,
                  message:
                    (justifyAttr?.value.value === 'center' || alignAttr?.value.value === 'center')
                      ? `${nodeName} は smarthr-ui/${layoutType} ではなく smarthr-ui/Center でマークアップしてください`
                      : `${nodeName}には子要素が一つしか無いため、${layoutType}でマークアップする意味がありません。
 - styleを確認し、div・spanなど、別要素でマークアップし直すか、${nodeName}を削除してください
 - as, forwardedAsなどでSectioningContent系要素に変更している場合、対応するsmarthr-ui/Section, Aside, Nav, Article のいずれかに差し替えてください`
                })
              }
            }
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
