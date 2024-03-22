const { generateTagFormatter } = require('../../libs/format_styled_components')

const EXPECTED_NAMES = {
  'PageHeading$': 'PageHeading$',
  'Heading$': 'Heading$',
  '^h1$': 'PageHeading$',
  '^h(|2|3|4|5|6)$': 'Heading$',
  'Article$': 'Article$',
  'Aside$': 'Aside$',
  'Nav$': 'Nav$',
  'Section$': 'Section$',
  'ModelessDialog$': 'ModelessDialog$',
  'Center$': 'Center$',
  'Reel$': 'Reel$',
  'Sidebar$': 'Sidebar$',
  'Stack$': 'Stack$',
}

const unexpectedMessageTemplate = `{{extended}} は smarthr-ui/{{expected}} をextendすることを期待する名称になっています
 - childrenにHeadingを含まない場合、コンポーネントの名称から"{{expected}}"を取り除いてください
 - childrenにHeadingを含み、アウトラインの範囲を指定するためのコンポーネントならば、smarthr-ui/{{expected}}をexendしてください
   - "styled(Xxxx)" 形式の場合、拡張元であるXxxxコンポーネントの名称の末尾に"{{expected}}"を設定し、そのコンポーネント内でsmarthr-ui/{{expected}}を利用してください`
const UNEXPECTED_NAMES = {
  '(Heading|^h(1|2|3|4|5|6))$': '(Heading)$',
  '(A|^a)rticle$': [
    '(Article)$',
    unexpectedMessageTemplate,
  ],
  '(A|^a)side$': [
    '(Aside)$',
    unexpectedMessageTemplate,
  ],
  '(N|^n)av$': [
    '(Nav)$',
    unexpectedMessageTemplate,
  ],
  '(S|^s)ection$': [
    '(Section)$',
    unexpectedMessageTemplate,
  ],
  'Center$': '(Center)$',
  'Reel$': '(Reel)$',
  'Sidebar$': '(Sidebar)$',
  'Stack$': '(Stack)$',
}

const headingRegex = /((^h(1|2|3|4|5|6))|Heading)$/
const pageHeadingRegex = /PageHeading$/
const declaratorHeadingRegex = /Heading$/
const sectioningRegex = /((A(rticle|side))|Nav|Section|^SectioningFragment)$/
const bareTagRegex = /^(article|aside|nav|section)$/
const modelessDialogRegex = /ModelessDialog$/
const layoutComponentRegex = /((C(ent|lust)er)|Reel|Sidebar|Stack)$/
const asRegex = /^(as|forwardedAs)$/
const ignoreCheckParentTypeRegex = /^(Program|ExportNamedDeclaration)$/
const noHeadingTagNamesRegex = /^(span|legend)$/
const ignoreHeadingCheckParentTypeRegex = /^(Program|ExportNamedDeclaration)$/

const includeSectioningAsAttr = (a) => a.name?.name.match(asRegex) && bareTagRegex.test(a.value.value)

const headingMessage = `smarthr-ui/Headingと紐づく内容の範囲（アウトライン）が曖昧になっています。
 - smarthr-uiのArticle, Aside, Nav, SectionのいずれかでHeadingコンポーネントと内容をラップしてHeadingに対応する範囲を明確に指定してください。
 - 'as="section"' などでアウトラインを示している場合、as属性を指定した要素をsmarthr-ui/SectioningFragmentでラップしてください。
  - 要素内のHeadingのレベルが自動計算されるようになります。`
const rootHeadingMessage = `${headingMessage}
 - Headingをh1にしたい場合(機能名、ページ名などこのページ内でもっとも重要な見出しの場合)、smarthr-ui/PageHeadingを利用してください。その場合はSectionなどでアウトラインを示す必要はありません。`
const pageHeadingMessage = 'smarthr-ui/PageHeading が同一ファイル内に複数存在しています。PageHeadingはh1タグを出力するため最も重要な見出しにのみ利用してください。'
const pageHeadingInSectionMessage = 'smarthr-ui/PageHeadingはsmarthr-uiのArticle, Aside, Nav, Sectionで囲まないでください。囲んでしまうとページ全体の見出しではなくなってしまいます。'
const noTagAttrMessage = `tag属性を指定せず、smarthr-uiのArticle, Aside, Nav, Section, SectioningFragmentのいずれかの自動レベル計算に任せるよう、tag属性を削除してください。
 - tag属性を指定することで意図しないレベルに固定されてしまう可能性があります。`

const VariableDeclaratorBareToSHR = (context, node) => {
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
    node.type === 'JSXElement' && node.openingElement.name.name && (
      sectioningRegex.test(node.openingElement.name.name) ||
      layoutComponentRegex.test(node.openingElement.name.name) && node.openingElement.attributes.some(includeSectioningAsAttr)
    )
  ) {
    return node
  }

  if (
    // Headingコンポーネントの拡張なので対象外
    node.type === 'VariableDeclarator' && node.parent.parent?.type.match(ignoreHeadingCheckParentTypeRegex) && declaratorHeadingRegex.test(node.id.name) ||
    node.type === 'FunctionDeclaration' && ignoreHeadingCheckParentTypeRegex.test(node.parent.type) && declaratorHeadingRegex.test(node.id.name) ||
    // ModelessDialogのheaderにHeadingを設定している場合も対象外
    node.type === 'JSXAttribute' && node.name.name === 'header' && modelessDialogRegex.test(node.parent.name.name)
  ) {
    return null
  }

  return searchBubbleUp(node.parent)
}
const searchBubbleUpSections = (node) => {
  switch (node.type) {
    case 'Program':
      // rootまで検索した場合は確定でエラーにする
      return null
    case 'VariableDeclarator':
      // SectioningContent系コンポーネントの拡張の場合は対象外
      if (ignoreCheckParentTypeRegex.test(node.parent.parent?.type) && sectioningRegex.test(node.id.name)) {
        return node
      }

      break
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
      // SectioningContent系コンポーネントの拡張の場合は対象外
      if (ignoreCheckParentTypeRegex.test(node.parent.type) && sectioningRegex.test(node.id.name)) {
        return node
      }

      break
  }

  return searchBubbleUpSections(node.parent)
}
const searchChildren = (n) => {
  switch (n.type) {
    case 'BinaryExpression':
    case 'Identifier':
    case 'JSXEmptyExpression':
    case 'JSXText':
    case 'Literal':
    case 'VariableDeclaration':
      // これ以上childrenが存在しないため終了
      return false
    case 'JSXAttribute':
      return n.value ? searchChildren(n.value) : false
    case 'LogicalExpression':
      return searchChildren(n.right)
    case 'ArrowFunctionExpression':
      return searchChildren(n.body)
    case 'MemberExpression':
      return searchChildren(n.property)
    case 'ReturnStatement':
    case 'UnaryExpression':
      return searchChildren(n.argument)
    case 'ChainExpression':
    case 'JSXExpressionContainer':
      return searchChildren(n.expression)
    case 'BlockStatement': {
      return forInSearchChildren(n.body)
    }
    case 'ConditionalExpression': {
      return searchChildren(n.consequent) || searchChildren(n.alternate)
    }
    case 'CallExpression': {
      return forInSearchChildren(n.arguments)
    }
    case 'JSXFragment':
      break
    case 'JSXElement': {
      const name = n.openingElement.name.name || ''

      if (
        sectioningRegex.test(name) ||
        layoutComponentRegex.test(name) && n.openingElement.attributes.some(includeSectioningAsAttr)
      ) {
        return false
      } else if (
        (
          headingRegex.test(name) &&
          !n.openingElement.attributes.find(findTagAttr)?.value.value.match(noHeadingTagNamesRegex)
        ) ||
        forInSearchChildren(n.openingElement.attributes)
      ) {
        return true
      }

      break
    }
  }

  return n.children ? forInSearchChildren(n.children) : false
}

const forInSearchChildren = (ary) => {
  let r = false

  for (const i in ary) {
    r = searchChildren(ary[i])

    if (r) {
      break
    }
  }

  return r
}

const findTagAttr = (a) => a.name?.name == 'tag'

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
  },
  create(context) {
    let h1s = []
    let sections = []
    let { VariableDeclarator, ...formatter } = generateTagFormatter({ context, EXPECTED_NAMES, UNEXPECTED_NAMES, unexpectedMessageTemplate })

    formatter.VariableDeclarator = (node) => {
      VariableDeclarator(node)
      VariableDeclaratorBareToSHR(context, node)
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
        // Headingに明示的にtag属性が設定されており、それらが span or legend の場合はHeading扱いしない
        } else if (headingRegex.test(elementName)) {
          const tagAttr = node.attributes.find(findTagAttr)

          if (!tagAttr?.value.value.match(noHeadingTagNamesRegex)) {
            const result = searchBubbleUp(node.parent)
            let hit = false

            if (result) {
              if (pageHeadingRegex.test(elementName)) {
                h1s.push(node)

                if (h1s.length > 1) {
                  hit = true
                  context.report({
                    node,
                    message: pageHeadingMessage,
                  })
                } else if (result.type !== 'Program') {
                  hit = true
                  context.report({
                    node,
                    message: pageHeadingInSectionMessage,
                  })
                }
              } else if (result.type === 'Program') {
                hit = true
                context.report({
                  node,
                  message: rootHeadingMessage,
                })
              } else if (sections.includes(result)) {
                hit = true
                context.report({
                  node,
                  message: headingMessage,
                })
              } else {
                sections.push(result)
              }
            }

            if (!hit && tagAttr) {
              context.report({
                node: tagAttr,
                message: noTagAttrMessage,
              })
            }
          }
        } else if (!node.selfClosing) {
          const isSection = sectioningRegex.test(elementName)
          const layoutSectionAsAttr = !isSection && layoutComponentRegex.test(elementName) ? node.attributes.find(includeSectioningAsAttr) : null

          if ((isSection || layoutSectionAsAttr) && !searchBubbleUpSections(node.parent.parent) && !forInSearchChildren(node.parent.children)) {
            context.report({
              node,
              message: `${isSection ? elementName : `<${elementName} ${layoutSectionAsAttr.name.name}="${layoutSectionAsAttr.value.value}">`} はHeading要素を含んでいません。
 - SectioningContentはHeadingを含むようにマークアップする必要があります
 - Headingにするべき適切な文字列が存在しない場合、 ${isSection ? `${elementName} は削除するか、SectioningContentではない要素に差し替えてください` : `${layoutSectionAsAttr.name.name}="${layoutSectionAsAttr.value.value}"を削除、もしくは別の要素に変更してください`}`,
            })
          }
        }
      },
    }
  },
}
module.exports.schema = []
