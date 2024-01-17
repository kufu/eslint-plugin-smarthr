const rule = require('../rules/a11y-image-has-alt-attribute')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

const messageNotExistAlt = `画像にはalt属性を指定してください。
 - コンポーネントが画像ではない場合、img or image を末尾に持たない名称に変更してください。
 - ボタンやリンクの先頭・末尾などに設置するアイコンとしての役割を持つ画像の場合、コンポーネント名の末尾を "Icon" に変更してください。
 - SVG component の場合、altを属性として受け取れるようにした上で '<svg role="img" aria-label={alt}>' のように指定してください。
 - 文字情報が多い場合や画像の前後の画像と同じ内容を設定したい場合などは aria-describedby属性を利用することもできます。
  - aria-describedby属性を利用する場合でもalt属性を併用することができます。`
const messageNullAlt = `画像の情報をテキストにした代替テキスト（'alt'）を設定してください。
 - 装飾目的の画像など、alt属性に指定すべき文字がない場合は背景画像にすることを検討してください。`

ruleTester.run('a11y-image-has-alt-attribute', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: `import { HogeImg as FugaImg } from './hoge'` },
    { code: `import { HogeImage as FugaImage } from './hoge'` },
    { code: `import { HogeIcon as FugaIcon } from './hoge'` },
    { code: 'const HogeImg = styled.img``' },
    { code: 'const HogeImage = styled.img``' },
    { code: 'const HogeIcon = styled.img``' },
    { code: 'const HogeImg = styled.svg``' },
    { code: 'const HogeImage = styled.svg``' },
    { code: 'const HogeIcon = styled.svg``' },
    { code: 'const HogeImg = styled(Img)``' },
    { code: 'const HogeImage = styled(Image)``' },
    { code: 'const HogeIcon = styled(Icon)``' },
    { code: '<img alt="hoge" />' },
    { code: '<HogeImg alt="hoge" />' },
    { code: '<HogeImage alt="hoge" />' },
    { code: '<HogeIcon />' },
    { code: '<HogeImage aria-describedby="hoge" />' },
    { code: '<HogeImage aria-describedby="hoge" alt="fuga" />' },
    { code: '<svg><image /></svg>' },
    { code: '<AnyImg {...hoge} />', options: [{ checkType: 'smart' }] },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: `import { HogeImg as ImgFuga } from './hoge'`, errors: [ { message: `ImgFugaを正規表現 "/Img$/" がmatchする名称に変更してください。
 - HogeImgが型の場合、'import type { HogeImg as ImgFuga }' もしくは 'import { type HogeImg as ImgFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { HogeImage as HogeImageFuga } from './hoge'`, errors: [ { message: `HogeImageFugaを正規表現 "/Image$/" がmatchする名称に変更してください。
 - HogeImageが型の場合、'import type { HogeImage as HogeImageFuga }' もしくは 'import { type HogeImage as HogeImageFuga }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: `import { Icon as Hoge } from './hoge'`, errors: [ { message: `Hogeを正規表現 "/Icon$/" がmatchする名称に変更してください。
 - Iconが型の場合、'import type { Icon as Hoge }' もしくは 'import { type Icon as Hoge }' のように明示的に型であることを宣言してください。名称変更が不要になります` } ] },
    { code: 'const Hoge = styled.img``', errors: [ { message: `Hogeを正規表現 "/(Img|Image|Icon)$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled.svg``', errors: [ { message: `Hogeを正規表現 "/(Img|Image|Icon)$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Icon)``', errors: [ { message: `Hogeを正規表現 "/Icon$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Img)``', errors: [ { message: `Hogeを正規表現 "/Img$/" がmatchする名称に変更してください。` } ] },
    { code: 'const Hoge = styled(Image)``', errors: [ { message: `Hogeを正規表現 "/Image$/" がmatchする名称に変更してください。` } ] },
    { code: 'const StyledImage = styled.span``', errors: [ { message: `StyledImage は /(Image|^(img|svg))$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - StyledImage の名称の末尾が"Image" という文字列ではない状態にしつつ、"span"を継承していることをわかる名称に変更してください
 - もしくは"span"を"StyledImage"の継承元であることがわかるような適切なタグや別コンポーネントに差し替えてください
   - 修正例1: const StyledXxxx = styled.span
   - 修正例2: const StyledImageXxxx = styled.span
   - 修正例3: const StyledImage = styled(XxxxImage)` } ] },
    { code: 'const StyledImg = styled(Hoge)``', errors: [ { message: `StyledImg は /(Img|^(img|svg))$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - StyledImg の名称の末尾が"Img" という文字列ではない状態にしつつ、"Hoge"を継承していることをわかる名称に変更してください
 - もしくは"Hoge"を"StyledImg"の継承元であることがわかるような名称に変更するか、適切な別コンポーネントに差し替えてください
   - 修正例1: const StyledXxxx = styled(Hoge)
   - 修正例2: const StyledImgXxxx = styled(Hoge)
   - 修正例3: const StyledImg = styled(XxxxImg)` } ] },
    { code: 'const FugaIcon = styled(Fuga)``', errors: [ { message: `FugaIcon は /(Icon|^(img|svg))$/ にmatchする名前のコンポーネントを拡張することを期待している名称になっています
 - FugaIcon の名称の末尾が"Icon" という文字列ではない状態にしつつ、"Fuga"を継承していることをわかる名称に変更してください
 - もしくは"Fuga"を"FugaIcon"の継承元であることがわかるような名称に変更するか、適切な別コンポーネントに差し替えてください
   - 修正例1: const FugaXxxx = styled(Fuga)
   - 修正例2: const FugaIconXxxx = styled(Fuga)
   - 修正例3: const FugaIcon = styled(XxxxIcon)` } ] },
    { code: '<img />', errors: [ { message: messageNotExistAlt } ] },
    { code: '<HogeImage alt="" />', errors: [ { message: messageNullAlt } ] },
    { code: '<hoge><image /></hoge>', errors: [ { message: messageNotExistAlt } ] },
    { code: '<AnyImg {...hoge} />', errors: [ { message: messageNotExistAlt } ]  },
    { code: '<AnyImg {...hoge} />', options: [{ checkType: 'always' }], errors: [ { message: messageNotExistAlt } ] },
  ]
})
