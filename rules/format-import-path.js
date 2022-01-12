const path = require('path')
const { replacePaths } = require('../libs/common')
const { BASE_SCHEMA_PROPERTIES, calculateDomainContext, calculateDomainNode } = require('../libs/common_domain')

const SCHEMA = [
  {
    type: 'object',
    properties: {
      ...BASE_SCHEMA_PROPERTIES,
      format: {
        all: { type: 'string', pattern: '^(none|absolute|relative)$', default: 'none'},
        outside: { type: 'string', pattern: '^(none|absolute|relative)$', default: 'none'},
        globalModule: { type: 'string', pattern: '^(none|absolute|relative)$', default: 'none'},
        module: { type: 'string', pattern: '^(none|absolute|relative)$', default: 'none'},
        domain: { type: 'string', pattern: '^(none|absolute|relative)$', default: 'none'},
        lower: { type: 'string', pattern: '^(none|absolute|relative)$', default: 'none'},
      },
    },
    additionalProperties: false,
  }
]

const isConvertType = (calcContext, calcDomainNode) => {
  const { option: { format: { all, outside, globalModule, module, domain, lower } } } = calcContext
  const { isGlobalModuleImport, isModuleImport, isDomainImport, isLowerImport } = calcDomainNode

  if (lower && lower !== 'none' && isLowerImport) {
    return lower
  }
  if (domain && domain !== 'none' && isDomainImport) {
    return domain
  }
  if (globalModule && globalModule !== 'none' && isGlobalModuleImport) {
    return globalModule
  }
  if (module && module !== 'none' && isModuleImport) {
    return module
  }
  if (outside && outside !== 'none' && !isLowerImport) {
    return outside
  }

  return all || 'none'
}

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'absolute-import-path': '{{ message }}',
      'relative-import-path': '{{ message }}',
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

    return {
      ImportDeclaration: (node) => {
        const calcDomainNode = calculateDomainNode(calcContext, node)
        const { importPath } = calcDomainNode
        const convertType = isConvertType(calcContext, calcDomainNode)

        if (convertType === 'absolute') {
          if (importPath[0] !== '.') {
            return
          }

          const { resolvedImportPath } = calcDomainNode
          const fixedImportPath = Object.entries(replacePaths).reduce((prev, [key, values]) => {
            if (resolvedImportPath === prev) {
              return values.reduce((p, v) => {
                if (prev === p) {
                  const regexp = new RegExp(`^${path.resolve(`${process.env.PWD}/${v}`)}(.+)$`)

                  if (prev.match(regexp)) {
                    return p.replace(regexp, `${key}/$1`).replace(/(\/)+/g, '/')
                  }
                }

                return p
              }, prev)
            }

            return prev
          }, resolvedImportPath)

          context.report({
            node,
            messageId: 'absolute-import-path',
            data: {
              message: `絶対パス(${fixedImportPath})に修正してください`,
            },
            fix: (fixer) => fixer.replaceText(
              node,
              context.getSourceCode().getText(node).replace(new RegExp(`from '${importPath}'$`), `from '${fixedImportPath}'`)
            ),
          })
        } else if (convertType === 'relative') {
          // HINT: 相対パスの場合でも、余計にさかのぼっていたりする場合もあるので修正対象とする
          if (
            importPath[0] !== '.' &&
            !importPath.match(new RegExp(`^(${Object.keys(replacePaths).join('|')})`))
          ) {
            return
          }

          const { filteredDirs, filteredPaths } = calcDomainNode
          const fixedImportPath = `${filteredDirs.length === 0 ? './' : [...Array(filteredDirs.length)].reduce((prev) => `${prev}../`, '')}${filteredPaths.join('/')}`.replace(/^(.+)\.[a-z0-9]+?$/, '$1')

          if (importPath !== fixedImportPath) {
            context.report({
              node,
              messageId: 'relative-import-path',
              data: {
                message: `相対パス(${fixedImportPath})に修正してください`,
              },
              fix: (fixer) => fixer.replaceText(
                node,
                context.getSourceCode().getText(node).replace(new RegExp(`from '${importPath}'$`), `from '${fixedImportPath}'`)
              ),
            })
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
