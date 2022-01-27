const path = require('path')
const { rootPath } = require('../libs/common')

const uniq = (array) => array.filter((elem, index, self) => self.indexOf(elem) === index)

const DEFAULT_CONFIG = {
  type: {
    IGNORE_KEYWORDS: [
      'redux', 'views', 'pages', 'parts',
      'props', 'type', 'action', 'actions',
    ],
    SUFFIX: ['Props', 'Type'],
  },
  file: {
    IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
  },
  property: {
    IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
  },
  function: {
    IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
  },
  variable: {
    IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
  },
  class: {
    IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
  },
  method: {
    IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
  },
}

const DEFAULT_SCHEMA_PROPERTY = {
  ignoreKeywords: { type: 'array', items: { type: 'string' } },
  keywordGenerator: { type: 'function' },
}

const SCHEMA = [
  {
    type: 'object',
    properties: {
      file: DEFAULT_SCHEMA_PROPERTY,
      type: {
        ...DEFAULT_SCHEMA_PROPERTY,
        suffixGenerator: { type: 'function' },
      },
      property: DEFAULT_SCHEMA_PROPERTY,
      function: DEFAULT_SCHEMA_PROPERTY,
      variable: DEFAULT_SCHEMA_PROPERTY,
      class: DEFAULT_SCHEMA_PROPERTY,
    },
    additionalProperties: false,
  }
]

const fetchTerminalImportName = (filename) => {
  const names = filename.split('/')
  let name = names.pop()

  if (name === 'index') {
    name = names.pop()
  }

  return name
}
const generateRedundantKeywords = ({ args, key, terminalImportName }) => {
  const option = args.option[key] || {}
  const ignoreKeywords = option.ignoreKeywords || DEFAULT_CONFIG[key].IGNORE_KEYWORDS
  const terminalImportKeyword = terminalImportName ? terminalImportName.toLowerCase() : '' 
  const filterKeywords = (keys) => keys.filter((k) => k !== terminalImportKeyword && !ignoreKeywords.includes(k))

  let redundantKeywords = filterKeywords(args.keywords)
  if (option.keywordGenerator) {
    redundantKeywords = option.keywordGenerator({
      ...args,
      redundantKeywords,
    })
  }

  return redundantKeywords
}
const handleReportBetterName = ({
  key, 
  context,
  redundantKeywords,
  defaultBetterName,
  fetchName,
  generateMessage,
}) => {
  if (!generateMessage) {
    generateMessage = (({ name, betterName }) => `${name} からパスで推測できる箇所を取り除いてしてください (例: ${betterName})`)
  }

  return (node) => {
    const name = fetchName(node)

    if (!name) {
      return
    }

    let hitCount = 0
    let betterName = redundantKeywords.reduce((prev, keyword) => {
      const replaced = prev.replace(new RegExp(keyword, 'i'), '')

      if (prev !== replaced) {
        hitCount++
      }

      return replaced
    }, name)

    if (name !== betterName) {
      betterName = betterName
                     .replace(/^_+/, '')
                     .replace(/_+$/, '')
                     .replace(/_+/, '_')

      if (!betterName) {
        // HINT: 1keywordで構成されている名称はそのままにする
        betterName = hitCount === 1 ? name : defaultBetterName
      }

      // HINT: camelCase、lower_snake_case の場合、keywordが取り除かれた結果違うケースになってしまう場合があるので対応する
      if (name.match(/^[a-z]/) && betterName.match(/^[A-Z]/)) {
        betterName = `${betterName[0].toLowerCase()}${betterName.slice(1)}`
      }
    }

    if (name !== betterName) {
      context.report({
        node,
        messageId: `${key}-name`,
        data: {
          message: generateMessage({ name, betterName }),
        },
      });
    }
  }
}

const generateTypeRedundant = (args) => {
  const { context } = args
  const key = 'type'
  const redundantKeywords = generateRedundantKeywords({ args, key })
  const option = args.option[key]
  const defaultConfig = DEFAULT_CONFIG[key]
  const actualArgs = {
    ...args,
    redundantKeywords,
  }

  return (node) => {
    const typeName = node.id.name
    const suffix = option.suffixGenerator ? option.suffixGenerator({
      ...actualArgs,
      node,
    }) : defaultConfig.SUFFIX

    let SuffixedName = typeName
    let report = null

    if (!typeName.match(new RegExp(`(${suffix.join('|')})$`))) {
      SuffixedName = `${typeName}${suffix[0]}`
      report = {
        node,
        messageId: 'type-name/invalid-suffix',
        data: {
          message: `type ${typeName} の名称の末尾に ${suffix.join(', ')} ${suffix.length > 1 ? 'のいずれか' : ''}を追加してください`,
        },
      }
    }

    let betterName = redundantKeywords.reduce((prev, keyword) => {
      const result = prev.replace(new RegExp(keyword, 'i'), '')

      return result === 's' || result.match(/^s[A-Z]/) ? `Multiple${result.slice(1)}` : result
    }, SuffixedName) || suffix[0]

    if (betterName === 'Multiple') {
      betterName = `${betterName}${suffix[0]}`
    }

    if (SuffixedName !== betterName) {
      report = {
        node,
        messageId: 'type-name',
        data: {
          message: `type ${typeName} の名称からパスで推測できる箇所を取り除いてしてください (例: ${betterName})`,
        },
      }
    }

    if (report) {
      context.report(report)
    }
  }
}

const generateTypePropertyRedundant = (args) => {
  const key = 'type'

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: '',
    fetchName: (node) => node.key.name,
  })
}

const generatePropertyRedundant = (args) => {
  const key = 'property'

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: 'item',
    fetchName: (node) => node.key.name,
  })
}

const generateFileRedundant = (args) => {
  const key = 'file'
  const terminalImportName = fetchTerminalImportName(args.filename)

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName }),
    defaultBetterName: 'index',
    fetchName: () => terminalImportName,
    generateMessage: ({ name, betterName }) => `${name} のファイル名からパスで推測できる箇所を取り除いてしてください (例: ${betterName})`
  })
}

const generateFunctionRedundant = (args) => {
  const key = 'function'

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName: fetchTerminalImportName(args.filename) }),
    defaultBetterName: '',
    fetchName: (node) => node.id.name,
  })
}
const generateFunctionParamsRedundant = (args) => {
  const key = 'function'
  const redundant = handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: '',
    fetchName: (node) => node.name,
  })

  return (node) => {
    node.params.forEach((param) => redundant(param))
  }
}

const generateVariableRedundant = (args) => {
  const key = 'variable'

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName: fetchTerminalImportName(args.filename) }),
    defaultBetterName: '',
    fetchName: (node) => node.id.name,
  })
}

const generateClassRedundant = (args) => {
  const key = 'class'

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName: fetchTerminalImportName(args.filename) }),
    defaultBetterName: '',
    fetchName: (node) => node.id.name,
  })
}

const generateMethodRedundant = (args) => {
  const key = 'method'

  return handleReportBetterName({
    key,
    context: args.context,
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: 'item',
    fetchName: (node) => node.key.name,
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'file-name': ' {{ message }}',
      'type-name': '{{ message }}',
      'type-name/invalid-suffix': '{{ message }}',
      'property-name': ' {{ message }}',
      'function-name': ' {{ message }}',
      'variable-name': ' {{ message }}',
      'class-name': ' {{ message }}',
      'method-name': ' {{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    if (!rootPath) {
      throw new Error('tsconfig.json の compilerOptions.paths に `"@/*": ["any_path/*"]` 形式でフロントエンドのroot dir を指定してください')
    }

    let rules = {}

    const option = context.options[0]
    const filename = context.getFilename().match(/^(.+?)\..+?$/)[1]
    const keywords = uniq((() => {
      const keywordMatcher = filename.match(new RegExp(`${rootPath}/(.+?)$`))

      if (keywordMatcher) {
        const keywords = keywordMatcher[1].split('/')

        if (keywords[keywords.length - 1] === 'index') {
          keywords.pop()
        }

        // HINT: ファイル名 > ディレクトリ名 > 親ディレクトリ名 ...
        // の順でキーワードとしての重要度が上がる。reverseして重要度順に並べる
        return keywords.reverse().reduce((prev, dir, index) => {
          prev.push(dir.replace(/_/g, '').toLowerCase())

          return prev
        }, [])
      }

      return []
    })())

    const args = { 
      context,
      option,
      filename,
      keywords,
    }

    if (option.type) {
      rules = {
        ...rules,
        TSTypeAliasDeclaration: generateTypeRedundant(args),
        // TSInterfaceDeclaration: hoge, // 必要になったら実装する
        TSPropertySignature: generateTypePropertyRedundant(args),
      }
    }
    if (option.property) {
      const propRedundant = generatePropertyRedundant(args)

      rules = {
        ...rules,
        Property: propRedundant,
        PropertyDefinition: propRedundant,
      }
    }
    if (option.file) {
      rules = {
        ...rules,
        Program: generateFileRedundant(args),
      }
    }
    if (option.function) {
      const functionRedundant = generateFunctionRedundant(args)
      const functionParamsRedundant = generateFunctionParamsRedundant(args)

      rules = {
        ...rules,
        FunctionDeclaration: (node) => {
          functionRedundant(node)
          functionParamsRedundant(node)
        },
        ArrowFunctionExpression: functionParamsRedundant,
      }
    }
    if (option.variable) {
      const redundant = generateVariableRedundant(args)

      rules = {
        ...rules,
        VariableDeclarator: redundant,
        TSEnumDeclaration: redundant,
      }
    }
    if (option.class) {
      const methodRedundant = generateMethodRedundant(args)
      const functionParamsRedundant = generateFunctionParamsRedundant(args)

      rules = {
        ...rules,
        ClassDeclaration: generateClassRedundant(args),
        MethodDefinition: (node) => {
          methodRedundant(node)

          if (node.value.type === 'FunctionExpression') {
            functionParamsRedundant(node.value)
          }
        },
      }
    }

    return rules
  },
}

module.exports.schema = SCHEMA
module.exports.default_config = DEFAULT_CONFIG
