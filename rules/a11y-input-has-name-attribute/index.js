const { generateTagFormatter } = require('../../libs/format_styled_components');

const EXPECTED_NAMES = {
  '(i|I)nput$': 'Input$',
  '(t|T)extarea$': 'Textarea$',
  '(s|S)elect$': 'Select$',
  'InputFile$': 'InputFile$',
  'RadioButton$': 'RadioButton$',
  'RadioButtonPanel$': 'RadioButtonPanel$',
  'Check(b|B)ox$': 'CheckBox$',
  'Combo(b|B)ox$': 'ComboBox$',
  'DatePicker$': 'DatePicker$',
  'DropZone$': 'DropZone$',
}
const TARGET_TAG_NAME_REGEX = new RegExp(`(${Object.keys(EXPECTED_NAMES).join('|')})`)
const INPUT_NAME_REGEX = /^[a-zA-Z0-9_\[\]]+$/
const INPUT_TAG_REGEX = /(i|I)nput$/
const RADIO_BUTTON_REGEX = /RadioButton(Panel)?$/

const findNameAttr = (a) => a?.name?.name === 'name'
const findSpreadAttr = (a) => a.type === 'JSXSpreadAttribute'
const findRadioInput = (a) => a.name?.name === 'type' && a.value.value === 'radio'

const MESSAGE_PART_FORMAT = `"${INPUT_NAME_REGEX.toString()}"にmatchするフォーマットで命名してください`
const MESSAGE_UNDEFINED_NAME_PART = `
 - ブラウザの自動補完が有効化されるなどのメリットがあります
 - より多くのブラウザが自動補完を行える可能性を上げるため、${MESSAGE_PART_FORMAT}`
const MESSAGE_UNDEFINED_FOR_RADIO = `にグループとなる他のinput[radio]と同じname属性を指定してください
 - 適切に指定することで同じname属性を指定したinput[radio]とグループが確立され、適切なキーボード操作を行えるようになります${MESSAGE_UNDEFINED_NAME_PART}`
const MESSAGE_UNDEFINED_FOR_NOT_RADIO = `にname属性を指定してください${MESSAGE_UNDEFINED_NAME_PART}`
const MESSAGE_NAME_FORMAT_SUFFIX = `はブラウザの自動補完が適切に行えない可能性があるため${MESSAGE_PART_FORMAT}`

const SCHEMA = [
  {
    type: 'object',
    properties: {
      checkType: { type: 'string', enum: ['always', 'allow-spread-attributes'], default: 'always' },
    },
    additionalProperties: false,
  }
]

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const checkType = option.checkType || 'always'

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name || '';

        if (nodeName.match(TARGET_TAG_NAME_REGEX)) {
          const nameAttr = node.attributes.find(findNameAttr)

          if (!nameAttr) {
            if (
              node.attributes.length === 0 ||
              checkType !== 'allow-spread-attributes' ||
              !node.attributes.some(findSpreadAttr)
            ) {
              const isRadio =
                nodeName.match(RADIO_BUTTON_REGEX) ||
                (nodeName.match(INPUT_TAG_REGEX) && node.attributes.some(findRadioInput));

              context.report({
                node,
                message: `${nodeName} ${isRadio ? MESSAGE_UNDEFINED_FOR_RADIO : MESSAGE_UNDEFINED_FOR_NOT_RADIO}`,
              });
            }
          } else {
            const nameValue = nameAttr.value?.value || ''

            if (nameValue && !nameValue.match(INPUT_NAME_REGEX)) {
              context.report({
                node,
                message: `${nodeName} のname属性の値(${nameValue})${MESSAGE_NAME_FORMAT_SUFFIX}`,
              });
            }
          }
        }
      },
    };
  },
};
module.exports.schema = SCHEMA;
