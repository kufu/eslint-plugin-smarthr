# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.6](https://github.com/kufu/eslint-plugin-smarthr/compare/v0.2.5...v0.2.6) (2022-09-08)

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
