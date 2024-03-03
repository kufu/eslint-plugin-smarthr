const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(Ordered(.*)List|^ol)$': '(Ordered(.*)List)$',
  '(S|s)elect$': '(Select)$',
}
const UNEXPECTED_NAMES = EXPECTED_NAMES

const NUMBERED_TEXT_REGEX = /^[\s\n]*(([0-9])([^0-9]{2})[^\s\n]*)/
const ORDERED_LIST_REGEX = /(Ordered(.*)List|^ol)$/
const SELECT_REGEX = /(S|s)elect$/
const IGNORE_ATTRIBUTE_REGEX = /((w|W)idth|(h|H)eight)$/
const AS_ATTRIBUTE_REGEX = /^(as|forwardedAs)$/

const findAsOlAttr = (a) => a.type === 'JSXAttribute' && AS_ATTRIBUTE_REGEX.test(a.name?.name) && a.value?.value === 'ol'

const searchOrderedList = (node) => {
  if (node.type === 'JSXElement' && node.openingElement.name?.name) {
    const name = node.openingElement.name.name

    if (name.match(SELECT_REGEX)) {
      // HINT: select要素の場合、optionのラベルに連番がついている場合がありえるのでignoreする
      // 通常と処理を分けるためnullではなく0を返す
      return 0
    } else if (
      name.match(ORDERED_LIST_REGEX) ||
      node.openingElement.attributes.find(findAsOlAttr)
    ) {
      return node.openingElement
    }
  }

  if (node.type === 'Program') {
    return null
  }

  return searchOrderedList(node.parent)
}

const checkNumberedTextInOl = (result, node, context) => {
  if (result) {
    context.report({
      node,
      message: `${result.name.name} 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)`,
    })
  }
}

const renderTag = (node) => `\`${node.name.name}="${node.value.value}"\``
const renderNode = (node, matcher) => node.type === 'JSXText' ? `\`${matcher[1]}\`` : renderTag(node)

const SCHEMA = []

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    let firstNumber = 0
    let firstNumberedNode = null
    let firstNumberedMatcher = null

    function checker(node, matcher) {
      if (matcher) {
        const result = searchOrderedList(node)

        if (result !== 0) {
          checkNumberedTextInOl(result, node, context)

          const nowNumber = matcher[2] * 1

          if (firstNumberedNode && nowNumber !== firstNumber) {
            if (nowNumber === firstNumber + 1) {
              const resultFirst = searchOrderedList(firstNumberedNode)

              if (!resultFirst) {
                if (!result) {
                  context.report({
                    node: firstNumberedNode,
                    message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - ${renderNode(firstNumberedNode, firstNumberedMatcher)} と ${renderNode(node, matcher)} が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります`,
                  })
                } else {
                  context.report({
                    node: firstNumberedNode,
                    message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - ${renderNode(firstNumberedNode, firstNumberedMatcher)} が ${renderNode(node, matcher)} を囲んでいるol要素内(<${result.name.name}>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<${result.name.name}>)に存在する必要があります`,
                  })
                }
              } else {
                if (!result) {
                  context.report({
                    node,
                    message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - ${renderNode(node, matcher)} が ${renderNode(firstNumberedNode, firstNumberedMatcher)} を囲んでいるol要素内(<${resultFirst.name.name}>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<${resultFirst.name.name}>)に存在する必要があります`,
                  })

                  firstNumberedNode = null
                } else if (resultFirst !== result) {
                  context.report({
                    node,
                    message: `連番を含むテキストが同一のol要素でマークアップされていません。同一のol要素でマークアップすることでリスト内の要素関連性を正しく表せるためマークアップの修正を行ってください。
 - ${renderNode(firstNumberedNode, firstNumberedMatcher)} と ${renderNode(node, matcher)} が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります`,
                  })
                }
              }
            }

            firstNumber = nowNumber
            firstNumberedNode = node
            firstNumberedMatcher = matcher
          } else if (!firstNumberedNode || nowNumber === firstNumber) {
            firstNumber = nowNumber
            firstNumberedNode = node
            firstNumberedMatcher = matcher
          }
        }
      }
    }

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXAttribute: (node) => {
        if (node.value?.value && !IGNORE_ATTRIBUTE_REGEX.test(node.name?.name)) {
          checker(node, node.value.value.match(NUMBERED_TEXT_REGEX))
        }
      },
      JSXText: (node) => {
        checker(node, node.value.match(NUMBERED_TEXT_REGEX))
      },
    }
  },
}
module.exports.schema = SCHEMA
