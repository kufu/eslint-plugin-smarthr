const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'Img$': 'Img$',
  'Image$': 'Image$',
  'Icon$': 'Icon$',
  '^(img|svg)$': '(Img|Image|Icon)$',
}

const UNEXPECTED_NAMES = {
  '(Img|^(img|svg))$': '(Img)$',
  '(Image|^(img|svg))$': '(Image)$',
  '(Icon|^(img|svg))$': '(Icon)$',
}

const REGEX_IMG = /(img|image)$/i // HINT: Iconは別途テキストが存在する場合が多いためチェックの対象外とする

const findAltAttr = (a) => a.name?.name === 'alt'
const findSpreadAttr = (a) => a.type === 'JSXSpreadAttribute'
const isWithinSvgJsxElement = (node) => {
  if (
    node.type === 'JSXElement' &&
    node.openingElement.name?.name === 'svg'
  ) {
    return true
  }

  return node.parent ? isWithinSvgJsxElement(node.parent) : false
}

const MESSAGE_NOT_EXIST_ALT = `画像にはalt属性を指定してください。
 - コンポーネントが画像ではない場合、img or image を末尾に持たない名称に変更してください。
 - ボタンやリンクの先頭・末尾などに設置するアイコンとしての役割を持つ画像の場合、コンポーネント名の末尾を "Icon" に変更してください。
 - SVG component の場合、altを属性として受け取れるようにした上で '<svg role="img" aria-label={alt}>' のように指定してください。`
const MESSAGE_NULL_ALT = `画像の情報をテキストにした代替テキスト（'alt'）を設定してください。
 - 装飾目的の画像など、alt属性に指定すべき文字がない場合は背景画像にすることを検討してください。`

const SCHEMA = [
  {
    type: 'object',
    properties: {
      checkType: { type: 'string', enum: ['always', 'smart'], default: 'always' },
    },
    additionalProperties: false,
  }
]

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0] || {}
    const checkType = option.checkType || 'always'

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        if (node.name.name) {
          const matcher = node.name.name.match(REGEX_IMG)

          if (matcher) {
            const alt = node.attributes.find(findAltAttr)

            let message = ''

            if (!alt) {
              if (
                (
                  matcher.input !== 'image' ||
                  !isWithinSvgJsxElement(node.parent)
                ) &&
                (
                  checkType !== 'smart' ||
                  !node.attributes.some(findSpreadAttr)
                )
              ) {
                message = MESSAGE_NOT_EXIST_ALT
              }
            } else if (alt.value.value === '') {
              message = MESSAGE_NULL_ALT
            }

            if (message) {
              context.report({
                node,
                message,
              });
            }
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
