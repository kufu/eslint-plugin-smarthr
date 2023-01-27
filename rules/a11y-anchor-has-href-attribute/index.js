const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  '^a$': '(Anchor|Link)$',
}

const REGEX_TARGET = /(Anchor|Link|^a)$/
const findHref = (a) => a.name?.name == 'href'

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name || ''

        if (nodeName.match(REGEX_TARGET)) {
          const href = node.attributes.find(findHref)

          if (!href || !href.value) {
            context.report({
              node,
              message: `${nodeName} に href 属性を設定してください。
 - onClickなどでページ遷移する場合、href属性に遷移先のURIを設定してください。Cmd + clickなどのキーボードショートカットに対応出来ます。
 - onClickなどの動作がURLの変更を行わない場合、リンクではなくbuttonでマークアップすることを検討してください。
 - リンクを無効化することを表したい場合、href属性に undefined を設定してください。`,
            })
          }
        }
      },
    }
  },
}
module.exports.schema = []
