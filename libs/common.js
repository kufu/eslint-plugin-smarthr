const JSON5 = require('json5')
const path = require('path')
const fs = require('fs')

const replacePaths = (() => {
  const tsconfig = fs.readFileSync(`${process.env.PWD}/tsconfig.json`)

  if (!tsconfig) {
    return null 
  }

  const { compilerOptions } = JSON5.parse(tsconfig)

  if (!compilerOptions || !compilerOptions.paths) {
    return null
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

  const p = (replacePaths['@/'] || [])[0]

  if (!p) {
    return ''
  }

  return path.resolve(`${process.env.PWD}/${p.replace(/\/\*$/, '')}`)
})()

module.exports = { replacePaths, rootPath }
