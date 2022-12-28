const { generateTagFormatter } = require('../../libs/format_styled_components');

const EXPECTED_NAMES = {
  RadioButton$: 'RadioButton$',
  '(i|I)nput$': 'Input$',
  '(t|T)extarea$': 'Textarea$',
  '(s|S)elect$': 'Select$',
};

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
        if (!node.attributes.some((attribute) => attribute?.name?.name === 'name')) {
          const nodeName = node.name.name || '';
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
        }
      },
    };
  },
};
module.exports.schema = [];
