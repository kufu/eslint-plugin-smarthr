const { generateTagFormatter } = require('../../libs/format_styled_components');

const EXPECTED_NAMES = {
  RadioButton$: 'RadioButton$',
  '(i|I)nput$': 'Input$',
};

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const name = node.name.name || '';
        const isRadio =
          (name.match(/(i|I)nput$/) &&
            node.attributes.some(
              (a) => a.name?.name === 'type' && a.value.value === 'radio'
            )) ||
          name.match(/RadioButton$/);

        if (!isRadio) return;

        const hasName = node.attributes.some(
          (attribute) => attribute?.name?.name === 'name'
        );

        if (!hasName) {
          context.report({
            node,
            message: 'ラジオボタンにはname属性を指定してください。nameを適切に設定することでラジオグループが確立され、キーボード操作しやすくなる等のメリットがあります。',
          });
        }
      },
    };
  },
};
module.exports.schema = [];
