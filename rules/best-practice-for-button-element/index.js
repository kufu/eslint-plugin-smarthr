const { checkImportStyledComponents, getStyledComponentBaseName } = require('../../libs/format_styled_components')

const ERRORMESSAGE_SUFFIX = `
 - button要素のtype属性のデフォルトは "submit" のため、button要素がformでラップされていると意図しないsubmitを引き起こす可能性があります
 - smarthr-ui/Button, smarthr-ui/UnstyledButtonのtype属性のデフォルトは "button" になっているため、buttonから置き換えることをおすすめします`
const ERRORMESSAGE_REQUIRED_TYPE_ATTR = `button要素を利用する場合、type属性に "button" もしくは "submit" を指定してください${ERRORMESSAGE_SUFFIX}`
const ERRORMESSAGE_PROHIBIT_STYLED = `"styled.button" の直接利用をやめ、smarthr-ui/Button、もしくはsmarthr-ui/UnstyledButtonを利用してください${ERRORMESSAGE_SUFFIX}`

const findTypeAttr = (a) => a.type === 'JSXAttribute' && a.name.name === 'type'

const SCHEMA = []

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: SCHEMA,
  },
  create(context) {
    return {
      ImportDeclaration: (node) => {
        checkImportStyledComponents(node, context)
      },
      JSXOpeningElement: (node) => {
        if (node.name.name === 'button' && !node.attributes.find(findTypeAttr)) {
          context.report({
            node,
            message: ERRORMESSAGE_REQUIRED_TYPE_ATTR,
          });
        }
      },
      VariableDeclarator: (node) => {
        if (getStyledComponentBaseName(node) === 'button') {
          context.report({
            node,
            message: ERRORMESSAGE_PROHIBIT_STYLED,
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
