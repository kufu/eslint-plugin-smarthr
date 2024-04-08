const path = require('path')
const fs = require('fs')
const { replacePaths, rootPath } = require('../../libs/common')

const SCHEMA = [
  {
    type: 'object',
    properties: {
      allowedImports: {
        type: 'object',
        patternProperties: {
          '.+': {
            type: 'object',
            patternProperties: {
              '.+': {
                type: ['boolean', 'array' ],
                items: {
                  type: 'string',
                },
                additionalProperties: false
              }
            }
          },
        },
        additionalProperties: true,
      },
      ignores: { type: 'array', items: { type: 'string' }, default: [] },
    },
    additionalProperties: false,
  }
]

const entriedReplacePaths = Object.entries(replacePaths)
const CWD = process.cwd()
const REGEX_UNNECESSARY_SLASH = /(\/)+/g
const REGEX_ROOT_PATH = new RegExp(`^${rootPath}/index\.`)
const REGEX_INDEX_FILE = /\/index\.(ts|js)x?$/
const TARGET_EXTS = ['ts', 'tsx', 'js', 'jsx']

const calculateAbsoluteImportPath = (source) => {
  if (source[0] === '/') {
    return source
  }

  return entriedReplacePaths.reduce((prev, [key, values]) => {
    if (source === prev) {
      const regexp = new RegExp(`^${key}(.+)$`)

      return values.reduce((p, v) => {
        if (prev === p) {
          if (prev.match(regexp)) {
            return p.replace(regexp, `${path.resolve(`${CWD}/${v}`)}/$1`)
          }
        }

        return p
      }, prev)
    }

    return prev
  }, source)
}
const calculateReplacedImportPath = (source) => {
  return entriedReplacePaths.reduce((prev, [key, values]) => {
    if (source === prev) {
      return values.reduce((p, v) => {
        if (prev === p) {
          const regexp = new RegExp(`^${path.resolve(`${CWD}/${v}`)}(.+)$`)

          if (prev.match(regexp)) {
            return p.replace(regexp, `${key}/$1`).replace(REGEX_UNNECESSARY_SLASH, '/')
          }
        }

        return p
      }, prev)
    }

    return prev
  }, source)
}

const pickImportedName = (s) => s.imported?.name
const findExistsSync = (p) => fs.existsSync(p)

/**
 * @type {import('@typescript-eslint/utils').TSESLint.RuleModule<''>}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const filename = context.getFilename()

    if (option.ignores && option.ignores.some((i) => !!filename.match(new RegExp(i)))) {
      return {}
    }

    let d = filename.split('/')
    d.pop()
    const dir = d.join('/')
    const targetPathRegexs = Object.keys(option?.allowedImports || {})
    const targetAllowedImports = targetPathRegexs.filter((regex) => !!filename.match(new RegExp(regex)))

    return {
      ImportDeclaration: (node) => {
        let isDenyPath = false
        let deniedModules = []

        targetAllowedImports.forEach((allowedKey) => {
          const allowedOption = option.allowedImports[allowedKey]
          const targetModules = Object.keys(allowedOption)

          targetModules.forEach((targetModule) => {
            const allowedModules = allowedOption[targetModule] || true
            const actualTarget = targetModule[0] !== '.' ? targetModule : path.resolve(`${CWD}/${targetModule}`)
            let sourceValue = node.source.value

            if (actualTarget[0] === '/') {
              sourceValue = path.resolve(`${dir}/${sourceValue}`)
            }

            if (actualTarget !== sourceValue) {
              return
            }

            if (!Array.isArray(allowedModules)) {
              isDenyPath = true
              deniedModules.push(true)
            } else {
              deniedModules.push(node.specifiers.map(pickImportedName).filter(i => allowedModules.indexOf(i) == -1))
            }
          })
        })

        if (
          isDenyPath && deniedModules[0] === true ||
          !isDenyPath && deniedModules.length === 1 && deniedModules[0].length === 0
        ) {
          return
        }

        let sourceValue = node.source.value

        if (sourceValue[0] === '.') {
          sourceValue = path.resolve(`${dir}/${sourceValue}`)
        }

        sourceValue = calculateAbsoluteImportPath(sourceValue)

        if (sourceValue[0] !== '/') {
          return
        }

        const sources = sourceValue.split('/')

        // HINT: directoryの場合、indexファイルからimportしていることは自明であるため、一階層上からチェックする
        if (fs.existsSync(sourceValue) && fs.statSync(sourceValue).isDirectory()) {
          sources.pop()
          sourceValue = sources.join('/')
        }

        let barrel = undefined

        while (sources.length > 0) {
          // HINT: 以下の場合は即終了
          // - import元以下のimportだった場合
          // - rootまで捜索した場合
          if (
            dir === rootPath ||
            dir.match(new RegExp(`^${sourceValue}`))
          ) {
            break
          }

          barrel = TARGET_EXTS.map((e) => `${sourceValue}/index.${e}`).find(findExistsSync) || barrel

          sources.pop()
          sourceValue = sources.join('/')
        }

        if (barrel && !barrel.match(REGEX_ROOT_PATH)) {
          barrel = calculateReplacedImportPath(barrel)
          const noExt = barrel.replace(REGEX_INDEX_FILE, '')
          deniedModules = [...new Set(deniedModules.flat())]

          context.report({
            node,
            message: deniedModules.length ? `${deniedModules.join(', ')} は ${noExt} からimportしてください` :  `${noExt} からimportするか、${barrel} のbarrelファイルを削除して直接import可能にしてください`,
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
