# smarthr/redundant-name

- ファイル、コードの冗長な部分を取り除くことを提案するruleです
- ファイルが設置されているディレクトリ構造からキーワードを生成し、取り除く文字列を生成します

## config

- tsconfig.json の compilerOptions.pathsに '@/*', もしくは '~/*' としてroot path を指定する必要があります
  - tsconfig.json はデフォルトではコマンド実行をしたディレクトリから読み込みます
  - tsconfig.json の設置ディレクトリを変更したい場合、 `.eslintrc` などのeslint設定ファイルに `.parserOptions.project` を設定してください
- 以下の設定を行えます。全て省略可能です。
  - ignoreKeywords
    - ディレクトリ名から生成されるキーワードに含めたくない文字列を指定します
  - betterNames
    - 対象の名前を修正する候補を指定します
  - allowedNames
    - 許可する名前を指定します
  - suffix:
    - type のみ指定出来ます
    - type のsuffixを指定します

### ファイル例
- `@/crews/index/views/page.tsx` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'page']`
- `@/crews/index/views/parts/Abc.tsx` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'Abc']`
- `@/crews/index/repositories/index.ts` の場合
  - 生成されるキーワードは `['crews', 'crew', 'index', 'repositories', 'repository']`


## rules

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
// const allowedNames = {
//   '\/views\/crews\/histories\/': ['crewId'],
// }

{
  rules: {
    'smarthr/redundant-name': [
      'error', // 'warn', 'off'
      {
        ignores: [ '\.stories\.' ], // ファイルパスに対して正規表現として一致する場合はチェック対象外にする
        type: { ignorekeywords, suffix: ['Props', 'Type'] },
        file: { ignorekeywords, betternames },
        // property: { ignorekeywords, allowedNames },
        // function: { ignorekeywords },
        // variable: { ignorekeywords },
        // class: { ignorekeywords },
      }
    ]
  },
}
```

## ❌ Incorrect

```js
// @/crews/index/views/page.tsx

type CrewIndexPage = { hoge: string }
type CrewsView = { hoge: string }
```
```js
// @/crews/show/repositories/index.tsx

type CrewIndexRepository = { hoge: () => any }
```

## ✅ Correct

```js
// @/crews/index/views/page.tsx

type ItemProps = { hoge: string }
```
```js
// @/crews/show/repositories/index.tsx

type IndexProps = { hoge: () => any }
type ResponseType = { hoge: () => any }
```
