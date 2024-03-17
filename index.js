'use strict';

const fs = require('fs');
const path = require('path');

const rules = generateRulesMap();

module.exports = {
  configs: {
    recommended: generateRecommendedConfig(rules),
  },
  rules,
};

function generateRulesMap() {
  let rulesPath = path.join(__dirname, 'rules');
  let dirs = fs.readdirSync(rulesPath);

  let rulesMap = {};
  for (let dir of dirs) {
    rulesMap[path.parse(dir).name] = require(`./rules/${dir}`);
  }
  return rulesMap;
}

const DISAPPROVE_RULE_NAMES = [
  'a11y-form-control-in-form', // formを使用することの是非について議論中のため

  // ルールが動作するために設定が必要なものはrecommendedに含めない
  'format-import-path',
  'format-translate-component',
  'jsx-start-with-spread-attributes',
  'no-import-other-domain',
  'prohibit-file-name',
  'prohibit-import',
  'prohibit-path-within-template-literal',
  'require-declaration',
  'require-export',
  'require-import',
]
const DISAPPROVE_RULE_NAMES_REGEX = new RegExp(`^(${DISAPPROVE_RULE_NAMES.join('|')})$`)

function generateRecommendedConfig(rules) {
  let config = {
    plugins: ['smarthr'],
    rules: {},
  };

  for (let ruleName of Object.keys(rules)) {
    if (!DISAPPROVE_RULE_NAMES_REGEX.test(ruleName)) {
      config.rules[`smarthr/${ruleName}`] = 'off';
    }
  }

  return config;
}
