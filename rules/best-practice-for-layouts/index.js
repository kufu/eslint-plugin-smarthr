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

const findJustifyAttr = (a) => a.name?.name === 'justify'
const findAlignAttr = (a) => a.name?.name === 'align'

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
            const children = node.parent.children.filter(checkFalsyJSXText)

            if (children.length === 1) {
              const layoutType = matcher[1]
              const justifyAttr = layoutType === 'Cluster' ? node.attributes.find(findJustifyAttr) : null

              if (justifyAttr && FLEX_END_REGEX.test(justifyAttr.value.value)) {
                return
              }

              const alignAttr = layoutType === 'Stack' ? node.attributes.find(findAlignAttr) : null

              if (alignAttr && FLEX_END_REGEX.test(alignAttr.value.value)) {
                return
              }

              if (searchChildren(children[0])) {
                context.report({
                  node,
                  message:
                    (justifyAttr && justifyAttr.value.value === 'center' || alignAttr && alignAttr.value.value === 'center')
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
