const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'Heading$': 'Heading$',
  '^h(1|2|3|4|5|6)$': 'Heading$',
  'Article$': 'Article$',
  'Aside$': 'Aside$',
  'Nav$': 'Nav$',
  'Section$': 'Section$',
}

const headingRegex = /((^h(1|2|3|4|5|6))|Heading)$/
const sectioningRegex = /((A(rticle|side))|Nav|Section|^SectioningFragment)$/
const bareTagRegex = /^(article|aside|nav|section)$/
const messagePrefix = 'Headingと紐づく内容の範囲（アウトライン）が曖昧になっています。'
const messageSuffix = 'Sectioning Content(Article, Aside, Nav, Section)でHeadingコンポーネントと内容をラップしてHeadingに対応する範囲を明確に指定してください。現在のマークアップの構造を変更したくない場合はSectioningFragmentコンポーネントを利用してください。'

const commonMessage = `${messagePrefix}${messageSuffix}`
const rootMessage = `${messagePrefix}コンポーネント全体に対するHeadingではない場合、${messageSuffix}コンポーネント全体に対するHeadingの場合、他のHeadingのアウトラインが明確に指定されればエラーにならなくなります。`

const reportMessageBareToSHR = (tagName, visibleExample) => {
  const matcher = tagName.match(bareTagRegex)

  if (matcher) {
    const base = matcher[1]
    const shrComponent = `${base[0].toUpperCase()}${base.slice(1)}`

    return `"${base}"を利用せず、smarthr-ui/${shrComponent}を拡張してください。Headingのレベルが自動計算されるようになります。${visibleExample ? `(例: "styled.${base}" -> "styled(${shrComponent})")` : ''}`
  }
}

const searchBubbleUp = (node) => {
  if (
    node.type === 'Program' ||
    node.type === 'JSXElement' && node.openingElement.name.name?.match(sectioningRegex)
  ) {
    return node
  }

  return searchBubbleUp(node.parent)
}

module.exports = {
  meta: {
    type: 'suggestion',
    schema: [],
  },
  create(context) {
    let sections = []
    let { VariableDeclarator, ...formatter } = generateTagFormatter({ context, EXPECTED_NAMES })

    formatter.VariableDeclarator = (node) => {
      VariableDeclarator(node)
      if (!node.init) {
        return
      }

      const tag = node.init.tag || node.init

      if (tag.object?.name === 'styled') {
        const message = reportMessageBareToSHR(tag.property.name, true)

        if (message) {
          context.report({
            node,
            message,
          });
        }
      }
    }

    return {
      ...formatter,
      JSXOpeningElement: (node) => {
        const elementName = node.name.name || ''
        const message = reportMessageBareToSHR(elementName, false)

        if (message) {
          context.report({
            node,
            message,
          })
        } else if (elementName.match(headingRegex)) {
          const result = searchBubbleUp(node.parent)
          const saved = sections.find((s) => s[0] === result)

          // HINT: 最初の1つ目は通知しない（）
          if (!saved) {
            sections.push([result, node])
          } else {
            // HINT: 同じファイルで同じSectioningContent or トップノードを持つ場合
            const [section, unreport] = saved
            const targets = unreport ? [unreport, node] : [node]

            saved[1] = undefined

            targets.forEach((n) => {
              context.report({
                node: n,
                message:
                  section.type === 'Program'
                  ? rootMessage
                  : commonMessage,
              })
            })
          }
        }
      },
    }
  },
}
module.exports.schema = []
