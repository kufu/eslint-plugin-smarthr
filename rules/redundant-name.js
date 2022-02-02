const path = require('path')
const Inflector = require('inflected')

const { rootPath } = require('../libs/common')

const uniq = (array) => array.filter((elem, index, self) => self.indexOf(elem) === index)

const COMMON_DEFAULT_CONFIG = {
  IGNORE_KEYWORDS: ['redux', 'views', 'pages', 'parts'],
}
const DEFAULT_CONFIG = {
  type: {
    IGNORE_KEYWORDS: [
      'redux', 'views', 'pages', 'parts',
      'props', 'type', 'action', 'actions',
    ],
    SUFFIX: ['Props', 'Type'],
  },
  typeProperty: COMMON_DEFAULT_CONFIG,
  file: COMMON_DEFAULT_CONFIG,
  property: COMMON_DEFAULT_CONFIG,
  function: COMMON_DEFAULT_CONFIG,
  functionParams: COMMON_DEFAULT_CONFIG,
  variable: COMMON_DEFAULT_CONFIG,
  class: COMMON_DEFAULT_CONFIG,
  method: COMMON_DEFAULT_CONFIG,
}

const DEFAULT_SCHEMA_PROPERTY = {
  ignoreKeywords: { type: 'array', items: { type: 'string' } },
  betterNamesGenerator: { type: 'function' },
}

const SCHEMA = [
  {
    type: 'object',
    properties: {
      type: {
        ...DEFAULT_SCHEMA_PROPERTY,
        suffixGenerator: { type: 'function' },
      },
      typeProperty: DEFAULT_SCHEMA_PROPERTY,
      file: DEFAULT_SCHEMA_PROPERTY,
      property: DEFAULT_SCHEMA_PROPERTY,
      function: DEFAULT_SCHEMA_PROPERTY,
      functionParams: DEFAULT_SCHEMA_PROPERTY,
      variable: DEFAULT_SCHEMA_PROPERTY,
      class: DEFAULT_SCHEMA_PROPERTY,
      method: DEFAULT_SCHEMA_PROPERTY,
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

  return args.keywords.reduce((prev, keyword) => {
    if (keyword === terminalImportKeyword || ignoreKeywords.includes(keyword)) {
      return prev
    }

    const singularized = Inflector.singularize(keyword)

    return singularized === keyword ? [...prev, keyword] : [...prev, keyword, singularized]
  }, [])
}
const handleReportBetterName = ({
  key, 
  context,
  option,
  filename,
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

    let candidates = []
    let conciseName = redundantKeywords.reduce((prev, keyword) => {
      const regex = new RegExp(`(${keyword})`, 'i')
      const matcher = prev.match(regex)

      if (matcher) {
        candidates.push(matcher[1])

        return prev.replace(regex, '')
      }

      return prev
    }, name)

    if (name !== conciseName) {
      conciseName = conciseName
                     .replace(/^_+/, '')
                     .replace(/_+$/, '')
                     .replace(/_+/, '_')
      let fullRedundant = false

      if (!conciseName) {
        fullRedundant = true
        // HINT: 1keywordで構成されている名称はそのままにする
        conciseName = candidates.length === 1 ? name : defaultBetterName
      }

      // HINT: camelCase、lower_snake_case の場合、keywordが取り除かれた結果違うケースになってしまう場合があるので対応する
      if (name.match(/^[a-z]/) && conciseName.match(/^[A-Z]/)) {
        conciseName = `${conciseName[0].toLowerCase()}${conciseName.slice(1)}`
      }

      if (fullRedundant) {
        if (name.match(/^[A-Z]/)) {
          candidates = candidates.map((k) => `${k[0].toUpperCase()}${k.slice(1)}`)
        }
      } else {
        candidates = []
      }

      candidates = uniq([conciseName, ...candidates].filter((k) => !!k))

      if (option.betterNamesGenerator) {
        candidates = option.betterNamesGenerator({ candidates, redundantName: name, redundantType: key, filename })
      }

      candidates = candidates.filter((c) => c !== name)
    }

    if (candidates.length > 0) {
      context.report({
        node,
        messageId: `${key}-name`,
        data: {
          message: generateMessage({ name, betterName: candidates.join(', ') }),
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
  const key = 'typeProperty'

  return handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: '',
    fetchName: (node) => node.key.name,
  })
}
const generateTypePropertyFunctionParamsRedundant = (args) => {
  const key = 'typeProperty'
  const redundant = handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: '',
    fetchName: (node) => node.name,
  })

  return (node) => {
    node.params.forEach((param) => redundant(param))
  }
}

const generatePropertyRedundant = (args) => {
  const key = 'property'

  return handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key }),
    defaultBetterName: 'item',
    fetchName: (node) => node.key.name,
  })
}

const generateFileRedundant = (args) => {
  const key = 'file'
  const terminalImportName = fetchTerminalImportName(args.filename)

  return handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName }),
    defaultBetterName: 'index',
    fetchName: () => terminalImportName,
    generateMessage: ({ name, betterName }) => `${name} のファイル名からパスで推測できる箇所を取り除いてしてください (例: ${betterName})`
  })
}

const generateFunctionRedundant = (args) => {
  const key = 'function'

  return handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName: fetchTerminalImportName(args.filename) }),
    defaultBetterName: '',
    fetchName: (node) => node.id.name,
  })
}
const generateFunctionParamsRedundant = (args) => {
  const key = 'functionParams'
  const redundant = handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
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
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName: fetchTerminalImportName(args.filename) }),
    defaultBetterName: '',
    fetchName: (node) => node.id.name,
  })
}

const generateClassRedundant = (args) => {
  const key = 'class'

  return handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
    redundantKeywords: generateRedundantKeywords({ args, key, terminalImportName: fetchTerminalImportName(args.filename) }),
    defaultBetterName: '',
    fetchName: (node) => node.id.name,
  })
}

const generateMethodRedundant = (args) => {
  const key = 'method'

  return handleReportBetterName({
    ...args,
    key,
    option: args.option[key],
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
      'typeProperty-name': '{{ message }}',
      'property-name': ' {{ message }}',
      'function-name': ' {{ message }}',
      'functionParams-name': ' {{ message }}',
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

    const addRule = (key, redundant) => {
      const addedRules = rules[key] || []

      rules[key] = [...addedRules, redundant]
    }

    if (option.type) {
      addRule('TSTypeAliasDeclaration', generateTypeRedundant(args))
      // addRule('TSInterfaceDeclaration', generateTypeRedundant(args)) // 必要になったら実装する
    }
    if (option.typeProperty) {
      const typePropRedundant = generateTypePropertyRedundant(args)
      const typeFuncParamRedundant = generateTypePropertyFunctionParamsRedundant(args)

      addRule('TSPropertySignature', (node) => {
        typePropRedundant(node)

        if (node.typeAnnotation.typeAnnotation.type === 'TSFunctionType') {
          typeFuncParamRedundant(node.typeAnnotation.typeAnnotation)
        }
      })
    }
    if (option.property) {
      const redundant = generatePropertyRedundant(args)

      addRule('Property', redundant)
      addRule('PropertyDefinition', redundant)
    }
    if (option.file) {
      addRule('Program', generateFileRedundant(args))
    }
    if (option.function) {
      addRule('FunctionDeclaration', generateFunctionRedundant(args))
    }
    if (option.functionParams) {
      const redundant = generateFunctionParamsRedundant(args)

      addRule('FunctionDeclaration', redundant)
      addRule('ArrowFunctionExpression', redundant)
      addRule('MethodDefinition', (node) => {
        if (node.value.type === 'FunctionExpression') {
          redundant(node.value)
        }
      })
    }
    if (option.variable) {
      const redundant = generateVariableRedundant(args)

      addRule('VariableDeclarator', redundant)
      addRule('TSEnumDeclaration', redundant)
    }
    if (option.class) {
      addRule('ClassDeclaration', generateClassRedundant(args))
    }
    if (option.method) {
      addRule('MethodDefinition', generateMethodRedundant(args))
    }

    Object.keys(rules).forEach((key) => {
      const redundants = rules[key]
      rules[key] = (node) => {
        redundants.forEach((redundant) => {
          redundant(node)
        })
      }
    })

    return rules
  },
}

module.exports.schema = SCHEMA
module.exports.default_config = DEFAULT_CONFIG
