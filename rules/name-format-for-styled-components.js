const EXPECTED_NAMES = {
  // 'Base$': 'Base$',
  'Balloon$': 'Balloon$',
  '(c|C)heck(b|B)ox$': 'CheckBox$',
  'FilterDropdown$': 'FilterDropdown$',
  'Dropdown$': 'Dropdown$',
  'DropdownTrigger$': 'DropdownTrigger$',
  'DropdownContent$': 'DropdownContent$',
  'DropdownCloser$': 'DropdownCloser$',
  'DropdownScrollArea$': 'DropdownScrollArea$',
  'FieldSet$': 'FieldSet$',
  'FlashMessage$': 'FlashMessage$',
  'FloatArea$': 'FloatArea$',
  'CurrencyInput$': 'CurrencyInput$',
  '(i|I)nput$': 'Input$',
  'InputFile$': 'InputFile$',
  '(t|T)ext(a|A)rea$': 'Textarea$',
  'TextLink$': 'TextLink$',
  'Loader$': 'Loader$',
  'MessageDialog$': 'MessageDialog$',
  'ActionDialog$': 'ActionDialog$',
  'ModelessDialog$': 'ModelessDialog$',
  'Dialog$': 'Dialog$',
  'DialogBase$': 'DialogBase$',
  'DialogWrapper$': 'DialogWrapper$',
  'DialogTrigger$': 'DialogTrigger$',
  'DialogCloser$': 'DialogCloser$',
  'DialogContent$': 'DialogContent$',
  'Pagination$': 'Pagination$',
  'RadioButton$': 'RadioButton$',
  'TextButton$': 'TextButton$',
  '(b|B)utton$': 'Button$',
  'AnchorButton$': 'AnchorButton$',
  'TextButtonAnchor$': 'TextButtonAnchor$',
  'ButtonAnchor$': 'ButtonAnchor$',
  'Anchor$': 'Anchor$',
  'Link$': 'Link$',
  '^a$': '(Anchor|Link)$',
  'StatusLabel$': 'StatusLabel$',
  '(l|L)abel$': 'Label$',
  'Icon$': 'Icon$',
  '(t|T)able$': 'Table$',
  'Head$': 'Head$',
  '^thead$': 'Head$',
  'Body$': 'Body$',
  '^tbody$': 'Body$',
  'Row$': 'Row$',
  'Cell$': '(Cell|Td|Th)$',
  '(t|T)d$': 'Td$',
  '(t|T)h$': 'Th$',
  'AppNavi$': 'AppNavi$',
  'TabBar$': 'TabBar$',
  'TabItem$': 'TabItem$',
  'BlankImage$': 'BlankImage$',
  'Image$': 'Image$',
  '^(img|svg)$': 'Image$',
  'Heading$': 'Heading$',
  '^h(1|2|3|4|5|6)$': 'Heading$',
  'HeadlineArea$': 'HeadlineArea$',
  '(s|S)elect$': 'Select$',
  'DropZone$': 'DropZone$',
  'DefinitionList$': 'DefinitionList$',
  'AccordionPanel$': 'AccordionPanel$',
  'AccordionPanelItem$': 'AccordionPanelItem$',
  'AccordionPanelContent$': 'AccordionPanelContent$',
  'AccordionPanelTrigger$': 'AccordionPanelTrigger$',
  'CompactInformationPanel$': 'CompactInformationPanel$',
  'InformationPanel$': 'InformationPanel$',
  'RightFixedNote$': 'RightFixedNote$',
  'Tooltip$': 'Tooltip$',
  'BottomFixedArea$': 'BottomFixedArea$',
  'MessageScreen$': 'MessageScreen$',
  'Calendar$': 'Calendar$',
  'DatePicker$': 'DatePicker$',
  'IndexNav$': 'IndexNav$',
  'SegmentedControl$': 'SegmentedControl$',
  'SegmentedControlOption$': 'SegmentedControlOption$',
  'FormGroup$': 'FormGroup$',
  'BackgroundJobsPanel$': 'BackgroundJobsPanel$',
  'BackgroundJobsList$': 'BackgroundJobsList$',
  'MultiComboBox$': 'MultiComboBox$',
  'SingleComboBox$': 'SingleComboBox$',
  'ComboBox$': 'ComboBox$',
  'SideNav$': 'SideNav$',
  'Text$': 'Text$',
  'LineClamp$': 'LineClamp$',
  'NotificationBar$': 'NotificationBar$',
  'Cluster$': 'Cluster$',
  'LineUp$': 'LineUp$',
  'Reel$': 'Reel$',
  'Stack$': 'Stack$',
  'Sidebar$': 'Sidebar$',

  '(f|F)orm$': 'Form$',
  '^(u|o)l$': 'List$',
  '^li$': 'ListItem$',
}

const SCHEMA = [{
  type: 'object',
  patternProperties: {
    '.+': {
      type: 'string',
    },
  },
  additionalProperties: true,
}]

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      'name-format-for-styled-components': '{{ message }}',
    },
    schema: SCHEMA,
  },
  create(context) {
    const option = context.options[0]

    return {
      ImportDeclaration: (node) => {
        if (node.source.value !== 'styled-components') {
          return
        }

        const invalidNameNode = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier' && s.local.name !== 'styled')

        if (invalidNameNode) {
          context.report({
            node: invalidNameNode,
            messageId: 'name-format-for-styled-components',
            data: {
              message: "`import styled from 'styled-components'` のフォーマットでimportしてください",
            },
          });
        }
      },
      TaggedTemplateExpression: (node) => {
        const { tag } = node
        const base = (() => {
          if (tag.type === 'CallExpression' && tag.callee.name === 'styled') {
            return tag.arguments[0].name
          }

          if (tag?.object?.name === 'styled') {
            return tag.property.name
          }

          return null
        })()

        if (!base) {
          return
        }

        const extended = node.parent.id.name

        let extendedregex = null

        Object.entries(option || EXPECTED_NAMES).forEach(([b, e]) => {
          if (base.match(new RegExp(b))) {
            extendedregex = new RegExp(e)

            if (!extended.match(extendedregex)) {
              context.report({
                node: node.parent,
                messageId: 'name-format-for-styled-components',
                data: {
                  message: `${extended}を正規表現 "${extendedregex.toString()}" がmatchする名称に変更してください`,
                },
              });
            }
          }
        })

        // if (!extendedregex) {
        //   if (!['div', 'p', 'span', 'dl', 'dt', 'dd'].includes(base)) {
        //     console.log(base, extended)
        //   }
        // }
      },
    }
  },
}
module.exports.schema = SCHEMA
module.exports.EXPECTED_NAMES = EXPECTED_NAMES
