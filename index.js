'use strict';

const fs = require('fs');
const path = require('path');

const rules = generateRulesMap();

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  name: 'eslint-plugin-smarthr',
  rules,
  plugins: {
    recommended: generateRecommendedConfig(rules),
  }
}

function generateRulesMap() {
  let rulesPath = path.join(__dirname, 'rules');
  let dirs = fs.readdirSync(rulesPath);

  let rulesMap = {};
  for (let dir of dirs) {
    rulesMap[path.parse(dir).name] = require(`./rules/${dir}`);
  }
  return rulesMap;
}

function generateRecommendedConfig(rules) {
  let config = {
    name: 'eslint-plugin-smarthr/recommended',
    rules: {},
  }

  for (let ruleName of Object.keys(rules)) {
    config.rules[`smarthr/${ruleName}`] = 'off';
  }

  return config;
}
