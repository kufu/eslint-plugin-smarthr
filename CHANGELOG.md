# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.21](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.20...v0.2.21) (2023-01-19)


### Features

* a11y系ruleのコンポーネント名チェックが漏れているパターンが存在したため調整 ([#56](https://github.com/kufu/eslint-plugin-smarthr/issues/56)) ([e628426](https://github.com/kufu/eslint-plugin-smarthr/commit/e628426596e97548580780632046c2154583af3e))

### [0.2.20](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.19...v0.2.20) (2023-01-18)


### Features

* a11y-input-has-name-attribute を DropZoneも対象になるように修正 ([#55](https://github.com/kufu/eslint-plugin-smarthr/issues/55)) ([73c30ce](https://github.com/kufu/eslint-plugin-smarthr/commit/73c30ce350e69c72e00112994a3cbe9cbbcfc52c))

### [0.2.19](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.18...v0.2.19) (2023-01-17)


### Features

* a11y-input-has-name-attributeの対象となるコンポーネントを追加(InputFile, CheckBox, ComboBox, DatePicker) ([ed14952](https://github.com/kufu/eslint-plugin-smarthr/commit/ed14952996902e9d2e4c7deb7b5107e7a57b41d6))

### [0.2.18](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.17...v0.2.18) (2023-01-15)


### Features

* redundant-name にignores オプションを追加 ([#53](https://github.com/kufu/eslint-plugin-smarthr/issues/53)) ([638ed8f](https://github.com/kufu/eslint-plugin-smarthr/commit/638ed8fe6aad0b246ff13630359b60eb34ec4012))


### Bug Fixes

* ディレクトリの削除もれ対応 ([#52](https://github.com/kufu/eslint-plugin-smarthr/issues/52)) ([afefcae](https://github.com/kufu/eslint-plugin-smarthr/commit/afefcaef7dbd52daf6dac2c095d0c58c56cbbed5))

### [0.2.17](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.15...v0.2.17) (2023-01-12)


### Features

* a11y-radio-has-name-attributeをinput, select, textareaに対してname属性を必須にするルール a11y-input-has-name-attribute に変更する ([#50](https://github.com/kufu/eslint-plugin-smarthr/issues/50)) ([f278bf8](https://github.com/kufu/eslint-plugin-smarthr/commit/f278bf8f094dab8b01b492ca24444f5ab3812b09))
* ラジオボタンにnameを強制するルールを追加 ([97792cf](https://github.com/kufu/eslint-plugin-smarthr/commit/97792cf276e3400cb6e01a01ef4cf104de5db190))


### Bug Fixes

* no-import-other-domain、require-barrel-import でignoresオプションを指定するとエラーが発生する問題を修正する ([#49](https://github.com/kufu/eslint-plugin-smarthr/issues/49)) ([8526236](https://github.com/kufu/eslint-plugin-smarthr/commit/85262365d105c1afa4fd53662825c4c51cb84531))
* prohibit-path-within-template-literalのpathオブジェクト名の解析の際、エラーになるパターンがあったため修正する ([#48](https://github.com/kufu/eslint-plugin-smarthr/issues/48)) ([715e485](https://github.com/kufu/eslint-plugin-smarthr/commit/715e485f3679e4ca2eb9675b67b8f452f9707096))

### [0.2.16](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.15...v0.2.16) (2022-12-21)


### Features

* ラジオボタンにnameを強制するルールを追加 ([97792cf](https://github.com/kufu/eslint-plugin-smarthr/commit/97792cf276e3400cb6e01a01ef4cf104de5db190))


### Bug Fixes

* no-import-other-domain、require-barrel-import でignoresオプションを指定するとエラーが発生する問題を修正する ([#49](https://github.com/kufu/eslint-plugin-smarthr/issues/49)) ([8526236](https://github.com/kufu/eslint-plugin-smarthr/commit/85262365d105c1afa4fd53662825c4c51cb84531))
* prohibit-path-within-template-literalのpathオブジェクト名の解析の際、エラーになるパターンがあったため修正する ([#48](https://github.com/kufu/eslint-plugin-smarthr/issues/48)) ([715e485](https://github.com/kufu/eslint-plugin-smarthr/commit/715e485f3679e4ca2eb9675b67b8f452f9707096))

### [0.2.15](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.12...v0.2.15) (2022-12-15)


### Features

* add prohibit-path-within-template-literal rule. ([#46](https://github.com/kufu/eslint-plugin-smarthr/issues/46)) ([1ea51a9](https://github.com/kufu/eslint-plugin-smarthr/commit/1ea51a95f0720e34729959dbc27b33a91ec2d73e))
* ignores option for no-import-other-domain and require-barrel-import ([#45](https://github.com/kufu/eslint-plugin-smarthr/issues/45)) ([559fdcf](https://github.com/kufu/eslint-plugin-smarthr/commit/559fdcf9d075e5fe29a48ab2f2d4f1e5d1a33201))


### Bug Fixes

* redundant-nameのarrowedNameなどで利用するファイルパスが削られすぎていたため、指定が行いにくい問題を修正する ([#43](https://github.com/kufu/eslint-plugin-smarthr/issues/43)) ([6de9618](https://github.com/kufu/eslint-plugin-smarthr/commit/6de961831a9f9e0e93eeeebb80e56ecb60d9a2ff))

### [0.2.14](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.13...v0.2.14) (2022-12-13)

### Features
* trim-propsルールを追加 ([#44](https://github.com/kufu/eslint-plugin-smarthr/pull/44)) 

### [0.2.13](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.12...v0.2.13) (2022-12-07)


### Bug Fixes

* redundant-nameのarrowedNameなどで利用するファイルパスが削られすぎていたため、指定が行いにくい問題を修正する ([#43](https://github.com/kufu/eslint-plugin-smarthr/issues/43)) ([6de9618](https://github.com/kufu/eslint-plugin-smarthr/commit/6de961831a9f9e0e93eeeebb80e56ecb60d9a2ff))

### [0.2.12](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.11...v0.2.12) (2022-12-07)


### Bug Fixes

* ファイルが複数の.を保つ場合（例 xxx.test.tsx）正常に動作しないバグを修正する ([#42](https://github.com/kufu/eslint-plugin-smarthr/issues/42)) ([23eb5b5](https://github.com/kufu/eslint-plugin-smarthr/commit/23eb5b51039085d3239adca42c65395b81869f9d))

### [0.2.11](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.10...v0.2.11) (2022-12-07)


### Bug Fixes

* redundant-nameの省略文字列がファイルパスによって正常に生成できないバグを修正 ([49eb1d9](https://github.com/kufu/eslint-plugin-smarthr/commit/49eb1d9ad1e9c153b7cb150190a81e5fae6bedf6))

### [0.2.10](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.9...v0.2.10) (2022-11-22)

### Features

* a11y-prohibit-input-placeholder を最新のComboBoxに対応させる ([#39](https://github.com/kufu/eslint-plugin-smarthr/issues/39)) ([682281c](https://github.com/kufu/eslint-plugin-smarthr/pull/39/commits/682281cd0f6ed73b4ec1295f34680bd9576ba831))
* placeholder禁止対象にdate pickerが含まれていなかったため対応 ([#39](https://github.com/kufu/eslint-plugin-smarthr/issues/39)) ([abf89f0](https://github.com/kufu/eslint-plugin-smarthr/pull/39/commits/abf89f0fe5a88b4d03fdbd0e1ed344bae1c6397a))


### Bug Fixes

* a11y-image-has-alt-attribute が svg > image を誤検知してしまうバグを修正する ([#40](https://github.com/kufu/eslint-plugin-smarthr/issues/40)) ([1f21879](https://github.com/kufu/eslint-plugin-smarthr/commit/1f21879a0309bfec15cfa186db4f6203cd80cc14))

### [0.2.9](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.8...v0.2.9) (2022-10-19)


### Features

* a11y-prohibit-input-placeholder を SearchInputに対応させる ([#38](https://github.com/kufu/eslint-plugin-smarthr/issues/38)) ([60de76b](https://github.com/kufu/eslint-plugin-smarthr/commit/60de76b58731436fe924a8a99da2242404141381))
* add require-declaration rule ([#34](https://github.com/kufu/eslint-plugin-smarthr/issues/34)) ([5dc6d44](https://github.com/kufu/eslint-plugin-smarthr/commit/5dc6d444e63f452f933bf6937207cfe23787732f))
* placeholder非推奨の対象に FieldSet, ComboBox も含める ([#35](https://github.com/kufu/eslint-plugin-smarthr/issues/35)) ([0e8d1d0](https://github.com/kufu/eslint-plugin-smarthr/commit/0e8d1d03377476fbd58adce17455e96533db69fa))


### Bug Fixes

* a11y-clickable-element-has-textのバグを修正する ([#36](https://github.com/kufu/eslint-plugin-smarthr/issues/36)) ([4efc23d](https://github.com/kufu/eslint-plugin-smarthr/commit/4efc23d33ba6eec2c454b323f561de3f7a678fab))

### [0.2.8](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.7...v0.2.8) (2022-10-05)


### Bug Fixes

* チェックするファイルのdirを取得するロジックから正規表現を取り除く ([#33](https://github.com/kufu/eslint-plugin-smarthr/issues/33)) ([c89548e](https://github.com/kufu/eslint-plugin-smarthr/commit/c89548e465e1f5aec49c6e1fc3b66c5bfefa6281))

### [0.2.7](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.5...v0.2.7) (2022-10-03)


### Features

* add a11y-prohibit-input-placeholder rule. ([#32](https://github.com/kufu/eslint-plugin-smarthr/issues/32)) ([a6033b9](https://github.com/kufu/eslint-plugin-smarthr/commit/a6033b94ba4f4c014caab0746ab151331e45daf0))
* 修正しなければ問題が起きる可能性があるruleのmeta.typeをproblemに修正 ([#31](https://github.com/kufu/eslint-plugin-smarthr/issues/31)) ([e3980e5](https://github.com/kufu/eslint-plugin-smarthr/commit/e3980e5dd226f229aa21c57b81dd2460b9b0d8c9))

### [0.2.6](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.5...v0.2.6) (2022-09-08)

### Features

* 修正しなければ問題が起きる可能性があるruleのmeta.typeをproblemに修正 ([#31](https://github.com/kufu/eslint-plugin-smarthr/pull/31))

### [0.2.5](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.4...v0.2.5) (2022-09-08)


### Bug Fixes

* require-import, prohibit-import: report message の一部でテンプレート文字列がそのまま出力されてしまう事があるバグを修正 ([#29](https://github.com/kufu/eslint-plugin-smarthr/issues/29)) ([b805f90](https://github.com/kufu/eslint-plugin-smarthr/commit/b805f90cd39b1aa4b95cbfbd983c5ff1c61f8afe))
* 画像系コンポーネントが代替テキスト属性を持つかチェックする際にエラーになるパターンを修正 ([#30](https://github.com/kufu/eslint-plugin-smarthr/issues/30)) ([bcd1044](https://github.com/kufu/eslint-plugin-smarthr/commit/bcd1044d7532531015a279520ed8eda582227492))

### [0.2.4](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.3...v0.2.4) (2022-08-30)


### Features

* ruleを更新する ([#27](https://github.com/kufu/eslint-plugin-smarthr/issues/27)) ([1ec7783](https://github.com/kufu/eslint-plugin-smarthr/commit/1ec7783395c9dafa547c453724f3671df489997b))

### [0.2.3](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.2...v0.2.3) (2022-08-26)


### Bug Fixes

* a11y-xxxx: styled(Hoge)の実行結果を変数に代入しないパターンに対応する ([#26](https://github.com/kufu/eslint-plugin-smarthr/issues/26)) ([0bb0259](https://github.com/kufu/eslint-plugin-smarthr/commit/0bb02595a3be35802c1fe8bc41011fd1e55bf319))

### [0.2.2](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.1...v0.2.2) (2022-08-18)


### Bug Fixes

* redundant-name rule の allowedNames オプションが適用されないバグがあったため修正する ([#23](https://github.com/kufu/eslint-plugin-smarthr/issues/23)) ([86a7bc5](https://github.com/kufu/eslint-plugin-smarthr/commit/86a7bc548398261885f31c75b56d8edffe5017c3))

### [0.2.1](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.0...v0.2.1) (2022-08-15)


### Features

* 新しいルールの追加 (require-export, prohibit-file-name, prohibit-export-array-type, best-practice-for-date ) ([#22](https://github.com/kufu/eslint-plugin-smarthr/issues/22)) ([ddb7433](https://github.com/kufu/eslint-plugin-smarthr/commit/ddb7433c0f26d64043cdcec353143240eceeccee))

### [0.2.0](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.1.2...v0.2.0) (2022-07-05)

### ⚠ BREAKING CHANGES

* BREAKING CHANGE: a11-xxxx-has-text を a11-clickable-element-has-text に統一する ([#16](https://github.com/kufu/eslint-plugin-smarthr/pull/16)


### [0.1.3](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.1.2...v0.1.3) (2022-07-05)


### Features

* add rules format-translate-component ([#19](https://github.com/kufu/eslint-plugin-smarthr/issues/19)) ([a429e9e](https://github.com/kufu/eslint-plugin-smarthr/commit/a429e9ef31779deb8f08499cfb8cbf00322c58b8))
* リンク要素内にテキストが設定されていない場合、エラーとなるルールを追加する ([#15](https://github.com/kufu/eslint-plugin-smarthr/issues/15)) ([4bbb9c1](https://github.com/kufu/eslint-plugin-smarthr/commit/4bbb9c1204a8edd068fabcdca497d94ecc1db4a4))


### Bug Fixes

* redundant-nameのバグを修正する ([#20](https://github.com/kufu/eslint-plugin-smarthr/issues/20)) ([b733f18](https://github.com/kufu/eslint-plugin-smarthr/commit/b733f1835293c3b478f6d9bb3ebe944041c67038))

### [0.1.2](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.1.1...v0.1.2) (2022-03-09)


### Bug Fixes

* require-barrel-import修正（barrelファイルが複数存在する場合、一番親に当たるファイルを検知する） ([#14](https://github.com/kufu/eslint-plugin-smarthr/issues/14)) ([87a6724](https://github.com/kufu/eslint-plugin-smarthr/commit/87a67240f31c9408faad6784741bbf6a2f7ef47b))

### [0.1.1](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.1.0...v0.1.1) (2022-03-08)


### Features

* add require-barrel-import rule ([#13](https://github.com/kufu/eslint-plugin-smarthr/issues/13)) ([79ee88d](https://github.com/kufu/eslint-plugin-smarthr/commit/79ee88d355e01bb8344dc95bd65157e2fbcf916e))

## [0.1.0](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.0.1...v0.1.0) (2022-02-09)


### ⚠ BREAKING CHANGES

* BREAKING CHANGE: add require-import & update prohibit-import (#12) ([e6c5c44](https://github.com/kufu/eslint-plugin-smarthr/commit/e6c5c445a21620d4b796ded00a685e5da367c7bb)), closes [#12](https://github.com/kufu/eslint-plugin-smarthr/issues/12)

### [0.0.1](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.0.0...v0.0.1) (2022-02-08)


### Features

* add type property function params redundant ([758df90](https://github.com/kufu/eslint-plugin-smarthr/commit/758df90f89bd27dd589aeeb55165e27c8e072b08))
* redundant-name の修正候補を操作できるように改修 ([20991e8](https://github.com/kufu/eslint-plugin-smarthr/commit/20991e874890556e84e7c682e789e4b2650a85b0))


## 0.0.0 (2022-01-25)


### Features

* LICENSE を追加 ([6497921](https://github.com/kufu/eslint-plugin-smarthr/commit/64979217ce4223d0a1a32981cf7c74ddbfec06ba))
* リリース用の処理を追加 ([c606864](https://github.com/kufu/eslint-plugin-smarthr/commit/c60686471044b7f0cbc6218f3609236819da22fb))


### Bug Fixes

* fs と path は node のデフォルトの物を使うべきなので dependencies から削除 ([979a4f4](https://github.com/kufu/eslint-plugin-smarthr/commit/979a4f430663defda37aacc829dd7d32a6d1b5a5))
* jsx-start-with-spread-attributes ([3936797](https://github.com/kufu/eslint-plugin-smarthr/commit/393679761ded4d45dee7eb5783b60db804889727))
* node_modules を gitignore ([bcfb637](https://github.com/kufu/eslint-plugin-smarthr/commit/bcfb63718e02c31d0459dfeb6e689b0c2f27820d))
* process.env.PWD -> process.cwd() ([1368464](https://github.com/kufu/eslint-plugin-smarthr/commit/13684649eeda1d50f4b940c4891a0b44f32a12ee))
* redundant-nameのdisabled周りのバグを修正 ([93ff112](https://github.com/kufu/eslint-plugin-smarthr/commit/93ff112a83328539ff8ec4738e48164144a973b5))
* リリースに向けて package.json 上の不要な記述を削除 ([29e4e44](https://github.com/kufu/eslint-plugin-smarthr/commit/29e4e440236fb07ccefb607c4c7b359ec6267f35))
