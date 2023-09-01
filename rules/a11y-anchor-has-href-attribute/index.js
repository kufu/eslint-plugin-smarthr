const JSON5 = require('json5')
const fs = require('fs')

const { generateTagFormatter } = require('../../libs/format_styled_components')

const OPTION = (() => {
  const file = `${process.cwd()}/package.json`

  if (!fs.existsSync(file)) {
    return {}
  }

  const json = JSON5.parse(fs.readFileSync(file))
  const dependencies = [
    ...Object.keys(json.dependencies || {}),
    ...Object.keys(json.devDependencies || {}),
  ]

  return {
    nextjs: dependencies.includes('next'),
    react_router: dependencies.includes('react-router-dom'),
  }
})()

const EXPECTED_NAMES = {
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  '^a$': '(Anchor|Link)$',
}

const REGEX_TARGET = /(Anchor|Link|^a)$/
const check = (node) => {
  const result = baseCheck(node)

  return result && ((OPTION.nextjs && !nextCheck(node)) || (OPTION.react_router && !reactRouterCheck(node))) ? null : result
}
const baseCheck = (node) => {
  const nodeName = node.name.name || ''

  return nodeName.match(REGEX_TARGET) && checkExistAttribute(node, findHrefAttribute) ? nodeName : false
}
const nextCheck = (node) => {
  // HINT: next/link で `Link>a` という構造がありえるので直上のJSXElementを調べる
  const target = node.parent.parent.openingElement

  return target ? baseCheck(target) : false
}
const reactRouterCheck = (node) => checkExistAttribute(node, findToAttribute)

const checkExistAttribute = (node, find) => {
  const attr = node.attributes.find(find)

  return !attr || !attr.value
}
const findHrefAttribute = (a) => a.name?.name == 'href'
const findToAttribute = (a) => a.name?.name == 'to'

const SCHEMA = []

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = check(node)

        if (nodeName) {
          context.report({
            node,
            message: `${nodeName} に href 属性を設定してください。
 - onClickなどでページ遷移する場合、href属性に遷移先のURIを設定してください。Cmd + clickなどのキーボードショートカットに対応出来ます。
 - onClickなどの動作がURLの変更を行わない場合、リンクではなくbuttonでマークアップすることを検討してください。
 - リンクが無効化されていることを表したい場合、href属性に undefined を設定してください。`,
          })
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
