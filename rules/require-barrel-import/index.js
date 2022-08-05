const path = require('path')
const fs = require('fs')
const { replacePaths, rootPath } = require('../libs/common')
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

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'require-barrel-import': '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()

    const dir = (() => {
      const d = filename.split('/')
      d.pop()

      return d.join('/')
    })()

    return {
      ImportDeclaration: (node) => {
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

        if (barrel) {
          barrel = calculateReplacedImportPath(barrel)

          context.report({
            node,
            messageId: 'require-barrel-import',
            data: {
              message: `${barrel.replace(/\/index\.(ts|js)x?$/, '')} からimportするか、${barrel} を削除してください`,
            },
          });
        }
      },
    }
  },
}
module.exports.schema = []
