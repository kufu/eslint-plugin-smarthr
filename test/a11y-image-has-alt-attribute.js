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

ruleTester.run('a11y-image-has-alt-attribute', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: `import styled, { css } from 'styled-components'` },
    { code: `import { css } from 'styled-components'` },
    { code: 'const HogeImg = styled.img``' },
    { code: 'const HogeImage = styled.img``' },
    { code: 'const HogeIcon = styled.img``' },
    { code: 'const HogeImg = styled.svg``' },
    { code: 'const HogeImage = styled.svg``' },
    { code: 'const HogeIcon = styled.svg``' },
    { code: 'const HogeImg = styled(Img)``' },
    { code: 'const HogeImage = styled(Image)``' },
    { code: 'const HogeIcon = styled(ICon)``' },
    { code: '<img alt="hoge" />' },
    { code: '<HogeImg alt="hoge" />' },
    { code: '<HogeImage alt="hoge" />' },
    { code: '<HogeIcon />' },
    { code: '<svg><image /></svg>' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: "styled-components をimportする際は、名称が`styled` となるようにしてください。例: `import styled from 'styled-components'`" } ] },
    { code: 'const Hoge = styled.img``', errors: [ { message: `Hogeを正規表現 "/(Img|Image|Icon)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled.svg``', errors: [ { message: `Hogeを正規表現 "/(Img|Image|Icon)$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(Icon)``', errors: [ { message: `Hogeを正規表現 "/Icon$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(Img)``', errors: [ { message: `Hogeを正規表現 "/Img$/" がmatchする名称に変更してください` } ] },
    { code: 'const Hoge = styled(Image)``', errors: [ { message: `Hogeを正規表現 "/Image$/" がmatchする名称に変更してください` } ] },
    { code: '<img />', errors: [ { message: '画像にはalt属性を指定してください。SVG component の場合、altを属性として受け取れるようにした上で `<svg role="img" aria-label={alt}>` のように指定してください。画像ではない場合、img or image を末尾に持たない名称に変更してください。' } ] },
    { code: '<HogeImage alt="" />', errors: [ { message: '画像の情報をテキストにした代替テキスト（`alt`）を設定してください。装飾目的の画像など、alt属性に指定すべき文字がない場合は背景画像にすることを検討してください。' } ] },
    { code: '<hoge><image /></hoge>', errors: [ { message: '画像にはalt属性を指定してください。SVG component の場合、altを属性として受け取れるようにした上で `<svg role="img" aria-label={alt}>` のように指定してください。画像ではない場合、img or image を末尾に持たない名称に変更してください。' } ] },
  ]
})
