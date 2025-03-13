import { getTagName } from '../../libs/format_styled_components'

const SCHEMA = []

const prohibitAttributies = [
  "data-spec",
  "data-testid"
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
    return {
      JSXAttribute: (node) => {
        const tagName = getTagName(node)
        const hit = prohibitAttributies.find((attr) => attr === tagName)

        if (hit) {
          context.report({
            node,
            message: `テストのために要素を指定するために、${hit} 属性を利用するのではなく、他の方法で要素を指定することを検討してください。
 - 方法1: click_link, click_button等を利用したりすることで、利用しているテスト環境に準じた方法で要素を指定することを検討してください。
   - 参考(Testing Library): https://testing-library.com/docs/queries/about
   - 参考(Capybara): https://rubydoc.info/github/jnicklas/capybara/Capybara/Node/Finders
 - 方法2: テスト環境のメソッド等で要素が指定できない場合はrole属性、name属性、id属性等を利用した方法で要素を指定することを検討してください。
 - 方法3: 上記の方法でも要素が指定できない場合は、'eslint-disable-next-line' 等を利用して、このルールを無効化してください。`,
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
