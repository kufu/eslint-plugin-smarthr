const { generateTagFormatter } = require('../../libs/format_styled_components');

const EXPECTED_NAMES = {
  '(i|I)nput$': 'Input$',
  '(t|T)extarea$': 'Textarea$',
  '(s|S)elect$': 'Select$',
  'InputFile$': 'InputFile$',
  'RadioButton$': 'RadioButton$',
  'Check(b|B)ox$': 'CheckBox$',
  'Combo(b|B)ox$': 'ComboBox$',
  'DatePicker$': 'DatePicker$',
  'DropZone$': 'DropZone$',
}
const TARGET_TAG_NAME_REGEX = new RegExp(`(${Object.keys(EXPECTED_NAMES).join('|')})`)
const INPUT_NAME_REGEX = /^[a-zA-Z0-9_\[\]]+$/

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      'format-styled-components': '{{ message }}',
      'a11y-input-has-name-attribute': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name || '';

        if (!nodeName.match(TARGET_TAG_NAME_REGEX)) {
          return
        }

        const nameAttr = node.attributes.find((a) => a?.name?.name === 'name')

        if (!nameAttr) {
          const isRadio =
            nodeName.match(/RadioButton$/) ||
            (nodeName.match(/(i|I)nput$/) && node.attributes.some(
              (a) => a.name?.name === 'type' && a.value.value === 'radio'
            ));

          context.report({
            node,
            messageId: 'a11y-input-has-name-attribute',
            data: {
              message: `${nodeName} にname属性を指定してください。適切に指定することで${isRadio ? 'グループが確立され、キーボード操作しやすくなる' : 'ブラウザの自動補完が有効化される'}などのメリットがあります。`,
            },
          });
        } else {
          const nameValue = nameAttr.value?.value || ''

          if (nameValue && !nameValue.match(INPUT_NAME_REGEX)) {
            context.report({
              node,
              messageId: 'a11y-input-has-name-attribute',
              data: {
                message: `${nodeName} のname属性の値(${nameValue})はブラウザの自動補完が適切に行えない可能性があるため ${INPUT_NAME_REGEX.toString()} にmatchするフォーマットで命名してください。`,
              },
            });
          }
        }
      },
    };
  },
};
module.exports.schema = [];
