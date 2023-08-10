# smarthr/no-import-other-domain

- ドメイン外からのimportを防ぐruleです
  - 例: crews/index 以下からのimportはOK, crews/index から crews/show 以下をimportするとNG
- ディレクトリ構造からドメインを識別して判定することが出来ます

## config

- tsconfig.json の compilerOptions.pathsに '@/*', もしくは '~/*' としてroot path を指定する必要があります
  - tsconfig.json はデフォルトではコマンド実行をしたディレクトリから読み込みます
  - tsconfig.json の設置ディレクトリを変更したい場合、 `.eslintrc` などのeslint設定ファイルに `.parserOptions.project` を設定してください
- ドメインを識別するために以下の設定を記述する必要があります
  - globalModuleDir
    - 全体で利用するファイルを収めているディレクトリを相対パスで指定します
  - domainModuleDir:
    - ドメイン内で共通のファイルを収めているディレクトリ名を指定します
  - domainConstituteDir
    - ドメインを構築するディレクトリ名を指定します

### ディレクトリ例
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

### 指定例
```
const DOMAIN_RULE_ARGS = {
  globalModuleDir: [ './constants', './modules' ],
  domainModuleDir: [ 'modules' ],
  domainConstituteDir: [ 'adapters', 'slices', 'views', 'parts' ],
}
```

## rules

```js
{
  rules: {
    'smarthr/no-import-other-domain': [
      'error', // 'warn', 'off'
      {
        ...DOMAIN_RULE_ARGS,
        // ignores: ['\\/test\\/'], // 除外したいファイルの正規表現
        // allowedImports: {
        //   '/any/path/': { // 正規表現でチェックするファイルを指定
        //     // import制御するファイル (相対パスを指定する場合、.eslintrc.js を基準とする)
        //     '@/hoge/fuga': true // ['abc', 'def'] と指定すると個別に指定
        //   }
        // },
        // analyticsMode: 'all', // 'same-domain', 'another-domain'
      }
    ]
  },
}
```

## ❌ Incorrect

```js
// crews/index/views/index.js

import showPart1 from '@/crews/show/views/parts'
import showPart2 from '../../show/views/parts'
```

## ✅ Correct

```js
// crews/index/views/index.js

import slice from '../slice'
import hoge from '../adapter/hoge'
import Abc from './parts/Abc'
import modulePart from '../../modules/views/parts'
import globalModulePart from '@/modules/views/parts'
```
