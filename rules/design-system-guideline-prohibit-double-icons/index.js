const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(Button)$': '(Button)$',
  '(Link)$': '(Link)$',
}

const UNEXPECTED_NAMES = EXPECTED_NAMES

const SCHEMA = []

const REGEX_PATTERN = new RegExp(`(${Object.keys(EXPECTED_NAMES).join('|')})`)

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
        const nodeName = node.name.name

        if (REGEX_PATTERN.test(nodeName)) {
          let prefix = null
          let suffix = null

          for (const attr of node.attributes) {
            switch (attr.name.name) {
              case 'prefix':
                prefix = attr
                break
              case 'suffix':
                suffix = attr
                break
            }

            if(prefix && suffix) {
              context.report({
                node,
                message: `${nodeName} には prefix と suffix は同時に設定できません。
 - prefix または suffix のみを設定してください。
 - どちらにもアイコンをつけられそうな場合は、アイコン付き（右）（サフィックス）を優先し、アイコン付き（左）（プレフィックス）には指定しないでください。
 - 両方設定したい場合は、'eslint-disable-next-line' 等を利用して、このルールを無効化してください。`,
              })
              break
            }
          }
        }
      }
    }
  },
}
module.exports.schema = SCHEMA
