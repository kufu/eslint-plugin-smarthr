# eslint-plugin-smarthr

## smarthr/a11y-icon-button-has-name

- ボタンの中にIconのみが設置されている場合、アクセシビリティの問題が発生する可能性を防ぐルールです

### rules

```js
{
  rules: {
    'smarthr/a11y-icon-button-has-name': 'error', // 'warn', 'off'
  },
}
```

### ❌ Incorrect

```jsx
<XxxButton>
  <YyyIcon />
</XxxButton>
```

### ✅ Correct

```jsx
<XxxButton>
  <YyyIcon />
  Hoge
</XxxButton>
```
```jsx
<XxxButton>
  <YyyIcon />
  <AnyComponent />
</XxxButton>
```
```jsx
<XxxButton>
  <YyyIcon visuallyHiddenText="hoge" />
</XxxButton>
```

## smarthr/format-import-path

- importする際のpathをフォーマットするruleです
- ディレクトリ構造からドメインを識別して相対パス、絶対パスいずれかにするかを判定することが出来ます
  - 例: crews/index 以下同士でのimportは相対パス、crews/index外のファイルimportする場合は絶対パスにする
- eslint を `--fix` オプション付きで実行すると自動的にパスを置き換えます

### config

- tsconfig.json の compilerOptions.pathsに '@/*' としてroot path を指定する必要があります
- ドメインを識別するために以下の設定を記述する必要があります
  - globalModuleDir
    - 全体で利用するファイルを収めているディレクトリを相対パスで指定します
  - domainModuleDir:
    - ドメイン内で共通のファイルを収めているディレクトリ名を指定します
  - domainConstituteDir
    - ドメインを構築するディレクトリ名を指定します

#### ディレクトリ例
```
/ constants
/ modules  // 全体共通ディレクトリ
/ crews
  / modules // 共通ディレクトリ
    / views
      / parts
  / index
    / adapters
      / index.ts
      / hoge.ts
    / slices
      / index.ts
    / views
      / index.ts
      / parts
        / Abc.ts
  / show
    / views
      / parts
```

#### 指定例
```
const DOMAIN_RULE_ARGS = {
  globalModuleDir: [ './constants', './modules' ],
  domainModuleDir: [ 'modules' ],
  domainConstituteDir: [ 'adapters', 'slices', 'views', 'parts' ],
}
```

### rules

```js
{
  rules: {
    'smarthr/format-import-path': [
      'error', // 'warn', 'off'
      {
        ...DOMAIN_RULE_ARGS,
        format: {
          // 'relative', 'auto', 'none'
          // all: 'absolute',
          outside: 'auto',
          globalModule: 'absolute',
          module: 'relative',
          domain: 'relative',
          lower: 'relative',
        },
      },
    ],
  },
}
```

### ❌ Incorrect

```js
// crews/index/views/index.js

import slice from '@/crews/index/slice'
import hoge from '@/crews/index/adapter/hoge'
import Abc from '@/crews/index/views/parts/Abc'
import modulePart from '@/crews/modules/views/part'
import showPart from '../../show/views/parts'
import globalModulePart from '../../../module/views/part'
```

### ✅ Correct

```js
// crews/index/views/index.js

import slice from '../slice'
import hoge from '../adapter/hoge'
import Abc from './parts/Abc'
import modulePart from '../../modules/views/parts'
import showPart from '@/crews/show/views/parts'
import globalModulePart from '@/modules/views/parts'
```

## smarthr/jsx-start-with-spread-attributes

- jsxを記述する際、意図しない属性の上書きを防ぐため、spread-attributesを先に指定するように強制するruleです

### rules

```js
{
  rules: {
    'smarthr/jsx-start-with-spread-attributes': 'error', // 'warn', 'off'
  },
}
```

### ❌ Incorrect

```jsx
<AnyComponent hoge="hoge" {...props} />
```

### ✅ Correct

```jsx
<AnyComponent {...props} hoge="hoge" />
```



## smarthr/no-import-other-domain

- ドメイン外からのimportを防ぐruleです
  - 例: crews/index 以下からのimportはOK, crews/index から crews/show 以下をimportするとNG
- ディレクトリ構造からドメインを識別して判定することが出来ます

### config

- tsconfig.json の compilerOptions.pathsに '@/*' としてroot path を指定する必要があります
- ドメインを識別するために以下の設定を記述する必要があります
  - globalModuleDir
    - 全体で利用するファイルを収めているディレクトリを相対パスで指定します
  - domainModuleDir:
    - ドメイン内で共通のファイルを収めているディレクトリ名を指定します
  - domainConstituteDir
    - ドメインを構築するディレクトリ名を指定します

#### ディレクトリ例
```
/ constants
/ modules  // 全体共通ディレクトリ
/ crews
  / modules // 共通ディレクトリ
    / views
      / parts
  / index
    / adapters
      / index.ts
      / hoge.ts
    / slices
      / index.ts
    / views
      / index.ts
      / parts
        / Abc.ts
  / show
    / views
      / parts
```

#### 指定例
```
const DOMAIN_RULE_ARGS = {
  globalModuleDir: [ './constants', './modules' ],
  domainModuleDir: [ 'modules' ],
  domainConstituteDir: [ 'adapters', 'slices', 'views', 'parts' ],
}
```

### rules

```js
{
  rules: {
    'smarthr/no-import-other-domain': [
      'error', // 'warn', 'off'
      {
        ...DOMAIN_RULE_ARGS,
        // analyticsMode: 'all', // 'same-domain', 'another-domain'
      }
    ]
  },
}
```

### ❌ Incorrect

```js
// crews/index/views/index.js

import showPart1 from '@/crews/show/views/parts'
import showPart2 from '../../show/views/parts'
```

### ✅ Correct

```js
// crews/index/views/index.js

import slice from '../slice'
import hoge from '../adapter/hoge'
import Abc from './parts/Abc'
import modulePart from '../../modules/views/parts'
import globalModulePart from '@/modules/views/parts'
```

## smarthr/prohibit-import

- 例えば特定の module にバグが発見されたなど、importさせたくない場合に利用するルールです

### rules

```js
{
  rules: {
    'smarthr/prohibit-import': [
      'error', // 'warn', 'off'
      {
        targets: {
          '^query-string$': true, // key は 正規表現を指定する
          '^smarthr-ui$': ['SecondaryButtonAnchor'], 
        },
        // generateReportMessage: (source, imported) => 
        //   `${source}${imported && `/${imported}`} はXxxxxxなので利用せず yyyy/zzzz を利用してください`
      }
    ]
  },
}
```

### ❌ Incorrect

```js
import queryString from 'query-string'
import { SecondaryButtonAnchor } from 'smarthr-ui'
```

### ✅ Correct


```js
import { PrimaryButton, SecondaryButton } from 'smarthr-ui'
```




## smarthr/redundant-name

- ファイル、コードの冗長な部分を取り除くことを提案するruleです
- ファイルが設置されているディレクトリ構造からキーワードを生成し、取り除く文字列を生成します

### config

- tsconfig.json の compilerOptions.pathsに '@/*' としてroot path を指定する必要があります
- 以下の設定を行えます。全て省略可能です。
  - ignoreKeywords
    - ディレクトリ名から生成されるキーワードに含めたくない文字列を指定します
  - betterNames
    - 対象の名前を修正する候補を生成します
  - suffixGenerator:
    - type のみ指定出来ます
    - type のsuffixを生成します

#### 指定例
```
const ignorekeywords = ['views', 'parts']
const betterNames = {
  '\/repositories\/': {
    file: {
      operator: '-',
      names: ['repository', 'Repository'],
    },
    variable: {
      operator: '=',
      names: ['repository'],
    },
    type: {
      operator: '+',
      names: ['Props'],
    },
  },
}

// 例: actions 以下の場合だけ 'Action' もしくは `Actions` のSuffixを許可する
const suffixGenerator = ({ node, filename }) => {
  let suffix = ['Props', 'Type']

  if (filename.match(/\/actions\//)) {
    suffix = [
      isUnionType || (node.typeAnnotation.type === 'TSTypeReference' && node.id.name.match(/Actions$/))
        ? 'Actions'
        : 'Action',
      ...suffix,
    ]
  }
}
```

#### ファイル例
- `@/crews/index/views/page.tsx` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'page']`
- `@/crews/index/views/parts/Abc.tsx` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'Abc']`
- `@/crews/index/repositories/index.ts` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'repositories', 'repository']`


### rules

```js
{
  rules: {
    'smarthr/redundant-name': [
      'error', // 'warn', 'off'
      {
        type: { ignorekeywords, betterNames, suffixGenerator },
        file: { ignorekeywords, betterNames },
        // property: { ignorekeywords, betterNames },
        // function: { ignorekeywords, betterNames },
        // variable: { ignorekeywords, betterNames },
        // class: { ignorekeywords, betterNames },
      }
    ]
  },
}
```

### ❌ Incorrect

```js
// @/crews/index/views/page.tsx

type CrewIndexPage = { hoge: string }
type CrewsView = { hoge: string }
```
```js
// @/crews/show/repositories/index.tsx

type CrewIndexRepository = { hoge: () => any }
```

### ✅ Correct

```js
// @/crews/index/views/page.tsx

type ItemProps = { hoge: string }
```
```js
// @/crews/show/repositories/index.tsx

type IndexProps = { hoge: () => any }
type ResponseType = { hoge: () => any }
``
