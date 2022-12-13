const path = require('path')
const fs = require('fs')
const { replacePaths, rootPath } = require('../../libs/common')
const calculateAbsoluteImportPath = (source) => {
  if (source[0] === '/') {
    return source
  }

  return Object.entries(replacePaths).reduce((prev, [key, values]) => {
    if (source === prev) {
      return values.reduce((p, v) => {
        if (prev === p) {
          const regexp = new RegExp(`^${key}(.+)$`)

          if (prev.match(regexp)) {
            return p.replace(regexp, `${path.resolve(`${process.cwd()}/${v}`)}/$1`)
          }
        }

        return p
      }, prev)
    }

    return prev
  }, source)
}
const calculateReplacedImportPath = (source) => {
  return Object.entries(replacePaths).reduce((prev, [key, values]) => {
    if (source === prev) {
      return values.reduce((p, v) => {
        if (prev === p) {
          const regexp = new RegExp(`^${path.resolve(`${process.cwd()}/${v}`)}(.+)$`)

          if (prev.match(regexp)) {
            return p.replace(regexp, `${key}/$1`).replace(/(\/)+/g, '/')
          }
        }

        return p
      }, prev)
    }

    return prev
  }, source)
}
const TARGET_EXTS = ['ts', 'tsx', 'js', 'jsx']
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

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'require-barrel-import': '{{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const filename = context.getFilename()

    if ((option.ignores || []).some((i) => !!filename.match(new RegExp(i)))) {
      return {}
    }

    const dir = (() => {
      const d = filename.split('/')
      d.pop()

      return d.join('/')
    })()
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
            const actualTarget = targetModule[0] !== '.' ? targetModule : path.resolve(`${process.cwd()}/${targetModule}`)
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
              deniedModules.push(node.specifiers.map((s) => s.imported?.name).filter(i => allowedModules.indexOf(i) == -1))
            }
          })
        })

        if (isDenyPath && deniedModules[0] === true) {
          return
        }

        if (!isDenyPath && deniedModules.length === 1 && deniedModules[0].length === 0) {
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

          barrel = TARGET_EXTS.map((e) => `${sourceValue}/index.${e}`).find((p) => fs.existsSync(p)) || barrel

          sources.pop()
          sourceValue = sources.join('/')
        }

        if (barrel && !barrel.match(new RegExp(`^${rootPath}/index\.`))) {
          barrel = calculateReplacedImportPath(barrel)
          const noExt = barrel.replace(/\/index\.(ts|js)x?$/, '')
          deniedModules = [...new Set(deniedModules.flat())]

          context.report({
            node,
            messageId: 'require-barrel-import',
            data: {
              message: deniedModules.length ? `${deniedModules.join(', ')} は ${noExt} からimportしてください` :  `${noExt} からimportするか、${barrel} のbarrelファイルを削除して直接import可能にしてください`,
            },
          });
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
