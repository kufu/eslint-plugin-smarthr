# eslint-plugin-smarthr

## smarthr/a11y-clickable-element-has-text

- ButtonやAnchor,Link コンポーネントにテキスト要素が設定されていない場合、アクセシビリティの問題が発生する可能性を防ぐルールです

### rules

```js
{
  rules: {
    'smarthr/a11y-clickable-element-has-text': 'error', // 'warn', 'off'
  },
}
```

### ❌ Incorrect

```jsx
<XxxAnchor>
  <Xxx />
</XxxAnchor>
```

```jsx
<XxxLink>
  <Yyy />
</XxxLink>
```

```jsx
<XxxButton>
  <Zzz />
</XxxButton>
```

### ✅ Correct

```jsx
<XxxAnchor>
  Hoge
</XxxAnchor>
```
```jsx
<XxxLink>
  <YyyIcon />
  Fuga
</XxxLink>
```
```jsx
<XxxAnchor>>
  <YyyIcon visuallyHiddenText="hoge" />
</XxxAnchor>
```
```jsx
<XxxButton>
  <YyyImage alt="fuga" />
</XxxButton>
```

```jsx
<YyyAnchoor />
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

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/no-import-other-domain)

## smarthr/prohibit-import

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/prohibit-import)

## smarthr/require-import

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-import)

## smarthr/require-export

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-export)

## smarthr/require-barrel-import

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/require-barrel-import)

## smarthr/redundant-name

[README](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/redundant-name)

## smarthr/format-translate-component

- 翻訳用コンポーネントを適用する際のルールを定めます

### rules

```js
{
  rules: {
    'smarthr/format-translate-component': [
      'error', // 'warn', 'off'
      {
        componentName: 'Translate',
        // componentPath: '@/any/path/Translate',
        // prohibitAttributies: ['data-translate'],
      }
    ]
  },
}
```

### ❌ Incorrect

```jsx
<Translate><Any>ほげ</Any></Translate>
```

```jsx
<Translate><Any /></Translate>
```

```jsx
<Translate></Translate>
```

```jsx
// prohibitAttributies: ['data-translate'],
<Any data-translate="true">...</Any>
```

### ✅ Correct

```jsx
<Translate>ほげ</Translate>
```
```jsx
<Translate>ほげ<br />ふが</Translate>
```
```jsx
<Translate>{any}</Translate>
```
```jsx
<Translate dangerouslySetInnerHTML={{ __html: "ほげ" }} />
```
```jsx
// prohibitAttributies: ['data-translate'],
<Any data-hoge="true">...</Any>
```

