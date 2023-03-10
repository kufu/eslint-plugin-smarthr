const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  '^a$': '(Anchor|Link)$',
}

const REGEX_TARGET = /(Anchor|Link|^a)$/
const check = (node, option) => {
  let result = baseCheck(node)

  if (
    result && (
      (option.nextjs && !nextCheck(node)) ||
      (option.react_router && !reactRouterCheck(node))
    )
  ) {
    result = null
  }

  return result
}
const baseCheck = (node) => {
  const nodeName = node.name.name || ''

  if (nodeName.match(REGEX_TARGET)) {
    const href = node.attributes.find((a) => a.name?.name == 'href')

    if (!href || !href.value) {
      return nodeName
    }
  }

  return false
}
const nextCheck = (node) => {
  // HINT: next/link で `Link>a` という構造がありえるので直上のJSXElementを調べる
  const target = node.parent.parent.openingElement

  if (target) {
    return baseCheck(target)
  }

  return false
}
const reactRouterCheck = (node) => {
  const href = node.attributes.find((a) => a.name?.name == 'to')

  return !href || !href.value
}

const SCHEMA = [
  {
    type: 'object',
    properties: {
      nextjs: { type: 'boolean' },
      react_router: { type: 'boolean' },
    },
    additionalProperties: false,
  }
]

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = check(node, option)

        if (nodeName) {
          context.report({
            node,
            message: `${nodeName} に href 属性を設定してください。
 - onClickなどでページ遷移する場合、href属性に遷移先のURIを設定してください。Cmd + clickなどのキーボードショートカットに対応出来ます。
 - onClickなどの動作がURLの変更を行わない場合、リンクではなくbuttonでマークアップすることを検討してください。
 - リンクを無効化することを表したい場合、href属性に undefined を設定してください。`,
          })
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
