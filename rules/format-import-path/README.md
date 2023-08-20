# smarthr/format-import-path

- importする際のpathをフォーマットするruleです
- ディレクトリ構造からドメインを識別して相対パス、絶対パスいずれかにするかを判定することが出来ます
  - 例: crews/index 以下同士でのimportは相対パス、crews/index外のファイルimportする場合は絶対パスにする
- eslint を `--fix` オプション付きで実行すると自動的にパスを置き換えます

## config

- tsconfig.json の compilerOptions.pathsに '@/*', もしくは '~/*' としてroot path を指定する必要があります
  - tsconfig.json はデフォルトではコマンド実行をしたディレクトリから読み込みます
  - tsconfig.json の設置ディレクトリを変更したい場合、 `.eslintrc` などのeslint設定ファイルに `parserOptions.project` を設定してください
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

## ❌ Incorrect

```js
// crews/index/views/index.js

import slice from '@/crews/index/slice'
import hoge from '@/crews/index/adapter/hoge'
import Abc from '@/crews/index/views/parts/Abc'
import modulePart from '@/crews/modules/views/part'
import showPart from '../../show/views/parts'
import globalModulePart from '../../../module/views/part'
```

## ✅ Correct

```js
// crews/index/views/index.js

import slice from '../slice'
import hoge from '../adapter/hoge'
import Abc from './parts/Abc'
import modulePart from '../../modules/views/parts'
import showPart from '@/crews/show/views/parts'
import globalModulePart from '@/modules/views/parts'
```
