const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  '(Ordered(.*)List|^ol)$': '(Ordered(.*)List)$',
  '(S|s)elect$': '(Select)$',
}
const UNEXPECTED_NAMES = EXPECTED_NAMES

const NUMBERED_TEXT_REGEX = /^([1-9])([^1-9]{2})/
const ORDERED_LIST_REGEX = /(Ordered(.*)List|^ol)$/
const SELECT_REGEX = /(S|s)elect$/

const searchOrderedList = (node) => {
  if (node.type === 'JSXElement' && node.openingElement.name) {
    const name = node.openingElement.name.name

    if (name.match(ORDERED_LIST_REGEX)) {
      return node.openingElement
    } else if (name.match(SELECT_REGEX)) {
      // HINT: select要素の場合、optionのラベルに連番がついている場合がありえるのでignoreする
      // 通常と処理を分けるためnullではなく0を返す
      return 0
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

const renderTag = (node) => `<${node.parent.name.name} ${node.name.name}="${node.value.value}">`

const SCHEMA = []

module.exports = {
  meta: {
    type: 'problem',
    schema: SCHEMA,
  },
  create(context) {
    let firstAttributeNumber = 0
    let firstNumberedAttribute = null
    let firstTextNumber = 0
    let firstNumberedText = null

    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES }),
      JSXAttribute: (node) => {
        if (node.value?.value) {
          const matcher = node.value.value.match(NUMBERED_TEXT_REGEX)

          if (matcher) {
            const result = searchOrderedList(node)

            if (result === 0) {
              return
            }

            checkNumberedTextInOl(result, node, context)

            const nowNumber = matcher[1] * 1

            if (firstNumberedAttribute && nowNumber !== firstAttributeNumber) {
              if (nowNumber === firstAttributeNumber + 1) {
                const resultFirst = searchOrderedList(firstNumberedAttribute)

                if (!resultFirst) {
                  if (!result) {
                    context.report({
                      node: firstNumberedAttribute,
                      message: `テキストとして連番をもつ要素がol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - ${renderTag(firstNumberedAttribute)} と ${renderTag(node)} が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります`,
                    })
                  } else {
                    context.report({
                      node: firstNumberedAttribute,
                      message: `テキストとして連番をもつ要素がol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - ${renderTag(firstNumberedAttribute)} が ${renderTag(node)} を囲んでいるol要素内(<${result.name.name}>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<${result.name.name}>)に存在する必要があります`,
                    })
                  }
                } else {
                  if (!result) {
                    context.report({
                      node,
                      message: `テキストとして連番をもつ要素がol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - ${renderTag(node)} が ${renderTag(firstNumberedAttribute)} を囲んでいるol要素内(<${resultFirst.name.name}>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<${resultFirst.name.name}>)に存在する必要があります`,
                    })

                    firstNumberedAttribute = null
                  } else if (resultFirst !== result) {
                    context.report({
                      node,
                      message: `テキストとして連番をもつ要素が同一のol要素でマークアップされていません。同一のol要素でマークアップすることでリスト内の要素関連性を正しく表せるためマークアップの修正を行ってください。
 - ${renderTag(firstNumberedAttribute)} と ${renderTag(node)} が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります`,
                    })
                  }
                }
              }

              firstAttributeNumber = nowNumber
              firstNumberedAttribute = node
            } else if (!firstNumberedAttribute || nowNumber === firstAttributeNumber) {
              firstAttributeNumber = nowNumber
              firstNumberedAttribute = node
            }
          }
        }
      },
      JSXText: (node) => {
        const matcher = node.value.match(NUMBERED_TEXT_REGEX)

        if (matcher) {
          const result = searchOrderedList(node)

          if (result === 0) {
            return
          }

          checkNumberedTextInOl(result, node, context)

          const nowNumber = matcher[1] * 1

          if (firstNumberedText && nowNumber !== firstTextNumber) {
            if (nowNumber === firstTextNumber + 1) {
              const resultFirst = searchOrderedList(firstNumberedText)

              if (!resultFirst) {
                if (!result) {
                  context.report({
                    node: firstNumberedText,
                    message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - "${firstNumberedText.value}" と "${node.value}" が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります`,
                  })
                } else {
                  context.report({
                    node: firstNumberedText,
                    message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - "${firstNumberedText.value}" が "${node.value}" を囲んでいるol要素内(<${result.name.name}>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<${result.name.name}>)に存在する必要があります`,
                  })
                }
              } else {
                if (!result) {
                  context.report({
                    node,
                    message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - "${node.value}" が "${firstNumberedText.value}" を囲んでいるol要素内(<${resultFirst.name.name}>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<${resultFirst.name.name}>)に存在する必要があります`,
                  })
                } else if (resultFirst !== result) {
                  context.report({
                    node,
                    message: `連番を含むテキストが同一のol要素でマークアップされていません。同一のol要素でマークアップすることでリスト内の要素関連性を正しく表せるためマークアップの修正を行ってください。
 - "${firstNumberedText.value}" と "${node.value}" が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります`,
                  })
                }
              }
            }

            firstTextNumber = nowNumber
            firstNumberedText = node
          } else if (!firstNumberedText || nowNumber === firstTextNumber) {
            firstTextNumber = nowNumber
            firstNumberedText = node
          }
        }
      },
    }
  },
}
module.exports.schema = SCHEMA
