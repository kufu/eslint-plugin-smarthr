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
- eslint を `--fix` オプション付きで実行する際、 fix option を true にすると自動修正します

### rules

```js
{
  rules: {
    'smarthr/jsx-start-with-spread-attributes': [
      'error', // 'warn', 'off'
      {
        fix: false, // true
      },
    ]
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
        '^.+$': {
          'smarthr-ui': {
            imported: ['SecondaryButtonAnchor'],
            reportMessage: `{{module}}/{{export}} はXxxxxxなので利用せず yyyy/zzzz を利用してください`
          }, 
        }
        '\/pages\/views\/': {
          'query-string': {
            imported: true,
          },
        },
      }
    ]
  },
}
```

### ❌ Incorrect

```js
// src/pages/views/Page.tsx
import queryString from 'query-string'
import { SecondaryButtonAnchor } from 'smarthr-ui'
```

### ✅ Correct


```js
// src/pages/views/Page.tsx
import { PrimaryButton, SecondaryButton } from 'smarthr-ui'
```

## smarthr/require-import

- 対象ファイルにimportを強制させたい場合に利用します
  - 例: Page.tsx ではページタイトルを設定させたいので useTitle を必ずimportさせたい

### rules

```js
{
  rules: {
    'smarthr/require-import': [
      'error',
      {
        'Buttons\/.+\.tsx': {
          'smarthr-ui': {
            imported: ['SecondaryButton'],
            reportMessage: 'Buttons以下のコンポーネントでは {{module}}/{{export}} を拡張するようにしてください',
          },
        },
        'Page.tsx$': {
          './client/src/hooks/useTitle': {
            imported: true,
            reportMessage: '{{module}} を利用してください（ページタイトルを設定するため必要です）',
          },
        },
      },
    ]
  },
}
```

### ❌ Incorrect

```js
// client/src/Buttons/SecondaryButton.tsx
import { SecondaryButtonAnchor } from 'smarthr-ui'

// client/src/Page.tsx
import { SecondaryButton } from 'smarthr-ui'
```

### ✅ Correct


```js
// client/src/Buttons/SecondaryButton.tsx
import { SecondaryButton } from 'smarthr-ui'

// client/src/Page.tsx
import useTitle from '.hooks/useTitle'
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
    - 対象の名前を修正する候補を指定します
  - suffix:
    - type のみ指定出来ます
    - type のsuffixを指定します

#### ファイル例
- `@/crews/index/views/page.tsx` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'page']`
- `@/crews/index/views/parts/Abc.tsx` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'Abc']`
- `@/crews/index/repositories/index.ts` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'repositories', 'repository']`


### rules

```js
const ignorekeywords = ['views', 'parts']
const betterNames = {
  '\/repositories\/': {
    operator: '-',
    names: ['repository', 'Repository'],
  },
  '\/entities\/': {
    operator: '+',
    names: ['entity'],
  },
  '\/slices\/': {
    operator: '=',
    names: ['index'],
  },
}

{
  rules: {
    'smarthr/redundant-name': [
      'error', // 'warn', 'off'
      {
        type: { ignorekeywords, suffix: ['Props', 'Type'] },
        file: { ignorekeywords, betternames },
        // property: { ignorekeywords },
        // function: { ignorekeywords },
        // variable: { ignorekeywords },
        // class: { ignorekeywords },
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
