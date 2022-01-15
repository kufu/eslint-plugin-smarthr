const path = require('path')
const fs = require('fs')
const { replacePaths, rootPath } = require('./common')

const BASE_SCHEMA_PROPERTIES = {
  globalModuleDir: { type: 'array', items: { type: 'string' } },
  domainModuleDir: { type: 'array', items: { type: 'string' }, default: [] },
  domainConstituteDir: { type: 'array', items: { type: 'string' } },
  isDomain: { type: 'function' },
}

const calculateDomainContext = (context) => {
  if (!rootPath) {
    throw new Error('tsconfig.json の compilerOptions.paths に `"@/*": ["any_path/*"]` 形式でフロントエンドのroot dir を指定してください')
  }

  const parentDir = (() => {
    const dir = context.getFilename().match(/^(.+?)\..+?$/)[1].split('/')
    dir.pop()
    return dir.join('/')
  })()
  const humanizeParentDir = parentDir.replace(new RegExp(`^${rootPath}/(.+)$`), '$1')

  return {
    option: context.options[0],
    parentDir,
    humanizeParentDir,
    isTarget: humanizeParentDir !== parentDir,
  }
}

const calculateDomainNode = (calclatedContext, node) => {
  const importPath = node.source.value
  const { option, parentDir, humanizeParentDir } = calclatedContext

  let replacedPath = importPath 

  if (replacePaths) {
    const exts = ['.ts', '.tsx', '.js', '.jsx', '']

    replacedPath = Object.entries(replacePaths).reduce((prev, [key, values]) => {
      if (replacedPath === prev) {
        const regexp = new RegExp(`^${key}(.+)$`)
        const matcher = prev.match(regexp)
        if (matcher) {
          return values.reduce((p, v) => {
            if (prev === p) {
              const id = p.replace(regexp, `${path.resolve(`${process.env.PWD}/${v}`)}/$1`)

              return exts.map((j) => `${id}${j}`).find((j) => fs.existsSync(j)) || p
            }

            return p
          }, prev)
        }
      }

      return prev
    }, replacedPath)

    if (replacedPath[0] === '.') {
      replacedPath = path.resolve(`${parentDir}/${replacedPath}`)
    }
    if (!replacedPath.match(/\.[a-z0-9]+$/)) {
      replacedPath = exts.map((j) => `${replacedPath}${j}`).find((j) => fs.existsSync(j)) || replacedPath
    }

    replacedPath = replacedPath.replace(/^(.+?)((\/index)?\.[a-z0-9]+|\/)$/, '$1')
  }

  const resolvedImportPath = replacedPath[0] === '/' ? replacedPath : ''

  let isGlobalModuleImport = false
  if (
    !resolvedImportPath ||
    option.globalModuleDir &&
    option.globalModuleDir.some((global) => 
      !!resolvedImportPath.match(new RegExp(`^${path.resolve(`${process.env.PWD}/${global}`)}`))
    )
  ) {
    isGlobalModuleImport = true
  }

  const humanizeImportPath = resolvedImportPath.replace(new RegExp(`^${rootPath}/(.+)$`), '$1')
  let dirs = humanizeParentDir.split('/')
  let paths = humanizeImportPath.split('/')
  let filteredDirs = dirs
  let filteredPaths = paths

  const recursiveDeductionEq = () => {
    if (dirs.length === 0 || paths.length === 0) {
      return
    }

    if (dirs[0] === paths[0]) {
      dirs.shift()
      paths.shift()
      recursiveDeductionEq()
    }
  }
  recursiveDeductionEq()
  filteredDirs = dirs
  filteredPaths = paths

  if (option.domainConstituteDir) {
    // HINT: 同一ドメイン内（例: workflows/index）で定形で利用されるディレクトリ名を省くことで
    // ドメインの識別に利用される文字を抽出する
    dirs = dirs.filter((k) => !option.domainConstituteDir.includes(k))
    paths = paths.filter((k) => !option.domainConstituteDir.includes(k))
  }

  if (option.isDomain) {
    // HINT: ドメインの識別に利用される文字を抽出する
    dirs = dirs.filter((k) => option.isDomain(k))
    paths = paths.filter((k) => option.isDomain(k))
  }

  const isLowerImport = filteredDirs.length === 0 // 同一階層、もしくは下層からのimport
  const isDomainImport = dirs.length === 0 // 同一ドメイン内、もしくは同一階層・下層からのimport
  const isModuleImport = paths.length > 0 && option.domainModuleDir.includes(paths[0]) // ドメイン内共通パーツ

  return {
    importPath,
    humanizeImportPath,
    resolvedImportPath,
    filteredDirs,
    filteredPaths,
    dirs,
    paths,
    isGlobalModuleImport,
    isModuleImport,
    isDomainImport,
    isLowerImport,
  }
}

module.exports = { BASE_SCHEMA_PROPERTIES, calculateDomainContext, calculateDomainNode }
