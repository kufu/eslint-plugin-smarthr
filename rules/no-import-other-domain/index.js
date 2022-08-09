const path = require('path')
const fs = require('fs')
const { replacePaths, rootPath } = require('../../libs/common')
const { BASE_SCHEMA_PROPERTIES, calculateDomainContext, calculateDomainNode } = require('../../libs/common_domain')

const SCHEMA = [
  {
    type: 'object',
    properties: {
      ...BASE_SCHEMA_PROPERTIES,
      analyticsMode: { type: 'string', default: 'none' }, // 'none' | 'all' | 'same-domain' | 'another-domain'
    },
    additionalProperties: false,
  }
]

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'no-import-other-domain': '{{ message }}',
    },
    fixable: 'code',
    schema: SCHEMA,
  },
  create(context) {
    const calcContext = calculateDomainContext(context)

    // 対象外ファイル
    if (!calcContext.isTarget) {
      return {}
    }

    const {
      option,
      humanizeParentDir,
    } = calcContext

    return {
      ImportDeclaration: (node) => {
        const { importPath, dirs, paths, humanizeImportPath, isGlobalModuleImport, isModuleImport, isDomainImport } = calculateDomainNode(calcContext, node)
        const hit = !isGlobalModuleImport && !isModuleImport && !isDomainImport

        if (
          option.analyticsMode === 'all' ||
          option.analyticsMode === 'same-domain' && !hit ||
          option.analyticsMode === 'another-domain' && hit
        ) {
          console.log('対象ディレクトリ', humanizeParentDir)
          console.log('importファイル', humanizeImportPath)
          console.log('対象ファイルのドメイン', dirs.join('/') || '--')
          console.log('importファイルのドメイン', paths.join('/') || '--')
          console.log('ドメイン判定', hit ? '別ドメイン' : '同一ドメイン')
          console.log('global module import: ', isGlobalModuleImport)
          console.log('module import: ', isModuleImport)
          console.log('domain import: ', isDomainImport)
          console.log('----------------------------------------------------')
        }

        if (hit) {
          context.report({
            node,
            messageId: 'no-import-other-domain',
            data: {
              message: `別ドメインから ${importPath} がimportされています。`,
            },
          })
        } 
      },
    }
  },
}
module.exports.schema = SCHEMA
