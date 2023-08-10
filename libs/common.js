const JSON5 = require('json5')
const path = require('path')
const fs = require('fs')

const replacePaths = (() => {
  const cwd = process.cwd()
  const eslintrc = (() => {
    let file = `${cwd}/.eslintrc.js`
    if (fs.existsSync(file)) {
      return require(file)
    }

    file = `${cwd}/.eslintrc`

    if (fs.existsSync(file)) {
      return JSON5.parse(fs.readFileSync(file))
    }

    return {}
  })()

  const tsconfigFile = `${cwd}/${eslintrc.parserOptions?.project || 'tsconfig.json'}`

  if (!fs.existsSync(tsconfigFile)) {
    throw new Error(`${tsconfigFile} を設置してください`)
  }

  const { compilerOptions } = JSON5.parse(fs.readFileSync(tsconfigFile))

  if (!compilerOptions || !compilerOptions.paths) {
    throw new Error('tsconfig.json の compilerOptions.paths に `"@/*": ["any_path/*"]` 形式でフロントエンドのroot dir を指定してください')
  }

  const regexp = /\*$/
  return Object.entries(compilerOptions.paths).reduce((prev, [key, values]) => {
    return {
      ...prev,
      [key.replace(regexp, '')]: values.map((v) => v.replace(regexp, '')),
    }
  }, {})
})()

const rootPath = (() => {
  if (!replacePaths) {
    return ''
  }

  const p = (replacePaths['@/'] || replacePaths['~/'] || [])[0]

  if (!p) {
    return ''
  }

  return path.resolve(`${process.cwd()}/${p.replace(/\/\*$/, '')}`)
})()

module.exports = { replacePaths, rootPath }
