const rule = require('../rules/name-format-for-styled-components')
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

const SMARTHRUI_COMPONENT_NAMES = [
  'Balloon',
  'CheckBox',
  'Dropdown',
  'DropdownTrigger',
  'DropdownContent',
  'DropdownCloser',
  'DropdownScrollArea',
  'FieldSet',
  'FlashMessage',
  'FloatArea',
  'Input',
  'InputFile',
  'Textarea',
  'Loader',
  'Dialog',
  'DialogBase',
  'DialogWrapper',
  'DialogTrigger',
  'DialogCloser',
  'DialogContent',
  'Pagination',
  'Button',
  'Anchor',
  'Link',
  'Label',
  'Icon',
  'Table',
  'Head',
  'Body',
  'Row',
  'Td',
  'Th',
  'AppNavi',
  'TabBar',
  'TabItem',
  'Image',
  'Heading',
  'HeadlineArea',
  'Select',
  'DropZone',
  'DefinitionList',
  'AccordionPanel',
  'AccordionPanelItem',
  'AccordionPanelContent',
  'AccordionPanelTrigger',
  'InformationPanel',
  'RightFixedNote',
  'Tooltip',
  'BottomFixedArea',
  'MessageScreen',
  'Calendar',
  'DatePicker',
  'IndexNav',
  'SegmentedControl',
  'SegmentedControlOption',
  'FormGroup',
  'BackgroundJobsPanel',
  'BackgroundJobsList',
  'ComboBox',
  'SideNav',
  'Text',
  'LineClamp',
  'NotificationBar',
  'Cluster',
  'LineUp',
  'Reel',
  'Stack',
  'Sidebar',
  'Form',
]
const TAG_NAMES = [
  ['checkbox', 'CheckBox'],
  ['input', 'Input'],
  ['textarea', 'Textarea'],
  ['button', 'Button'],
  ['label', 'Label'],
  ['table', 'Table'],
  ['th', 'Th'],
  ['td', 'Td'],
  ['tbody', 'Body'],
  ['thead', 'Head'],
  ['img', 'Image'],
  ['svg', 'Image'],
  ['h1', 'Heading'],
  ['h2', 'Heading'],
  ['h3', 'Heading'],
  ['h4', 'Heading'],
  ['h5', 'Heading'],
  ['h6', 'Heading'],
  ['select', 'Select'],
  ['form', 'Form'],
  ['ul', 'List'],
  ['ol', 'List'],
  ['li', 'ListItem'],
]

'a'

const generateErrorMessage = (expectedRegex, base) => `${base || 'Hoge'}を正規表現 "/${expectedRegex}/" がmatchする名称に変更してください`

ruleTester.run('name-format-for-styled-components', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    ...[
      ...SMARTHRUI_COMPONENT_NAMES,
      'FilterDropdown',
      'CurrencyInput',
      'MessageDialog',
      'ActionDialog',
      'ModelessDialog',
      'RadioButton',
      'TextButton',
      'AnchorButton',
      'TextButtonAnchor',
      'ButtonAnchor',
      'TextLink',
      'StatusLabel',
      'Cell',
      'BlankImage',
      'CompactInformationPanel',
      'MultiComboBox',
      'SingleComboBox',
    ].map((base) => ({
      code: `const Hoge${base} = styled(${base})\`\``,
    })),
    ...TAG_NAMES.map(([base, expected]) => ({
      code: `const Hoge${expected} = styled.${base}\`\``,
    })),
    ...[
      ...SMARTHRUI_COMPONENT_NAMES,
      'FilterDropdown',
      'CurrencyInput',
      'MessageDialog',
      'ActionDialog',
      'ModelessDialog',
      'RadioButton',
      'TextButton',
      'AnchorButton',
      'TextButtonAnchor',
      'ButtonAnchor',
      'TextLink',
      'StatusLabel',
      'Cell',
      'BlankImage',
      'CompactInformationPanel',
      'MultiComboBox',
      'SingleComboBox',
    ].map((base) => ({
      code: `const Hoge = styled(${base})\`\``,
      options: [
        {},
      ]
    })),
    {
      code: 'const StyledFuga = styled(Hoge)``',
      options: [
        {
          '^Hoge$': 'Fuga$',
        },
      ]
    }
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: "`import styled from 'styled-components'` のフォーマットでimportしてください" } ] },
    ...SMARTHRUI_COMPONENT_NAMES.map((base) => ({
      code: `const Hoge = styled(${base})\`\``,
      errors: [{ message: generateErrorMessage(`${base}$`) }]
    })),
    {
      code: 'const Hoge = styled(FilterDropdown)``',
      errors: [
        { message: generateErrorMessage('FilterDropdown$') },
        { message: generateErrorMessage('Dropdown$') },
      ],
    },
    {
      code: 'const Hoge = styled(CurrencyInput)``',
      errors: [
        { message: generateErrorMessage('CurrencyInput$') },
        { message: generateErrorMessage('Input$') },
      ],
    },
    ...['MessageDialog', 'ActionDialog', 'ModelessDialog'].map((base) => ({
      code: `const Hoge = styled(${base})\`\``,
      errors: [
        { message: generateErrorMessage(`${base}$`) },
        { message: generateErrorMessage('Dialog$') },
      ],
    })),
    {
      code: 'const Hoge = styled(RadioButton)``',
      errors: [
        { message: generateErrorMessage('RadioButton$') },
        { message: generateErrorMessage('Button$') },
      ],
    },
    {
      code: 'const Hoge = styled(AnchorButton)``',
      errors: [
        { message: generateErrorMessage('Button$') },
        { message: generateErrorMessage('AnchorButton$') },
      ],
    },
    {
      code: 'const Hoge = styled(TextButton)``',
      errors: [
        { message: generateErrorMessage('TextButton$') },
        { message: generateErrorMessage('Button$') },
      ],
    },
    {
      code: 'const Hoge = styled(TextButtonAnchor)``',
      errors: [
        { message: generateErrorMessage('TextButtonAnchor$') },
        { message: generateErrorMessage('ButtonAnchor$') },
        { message: generateErrorMessage('Anchor$') },
      ],
    },
    {
      code: 'const Hoge = styled(ButtonAnchor)``',
      errors: [
        { message: generateErrorMessage('ButtonAnchor$') },
        { message: generateErrorMessage('Anchor$') },
      ],
    },
    {
      code: 'const Hoge = styled(TextLink)``',
      errors: [
        { message: generateErrorMessage('TextLink$') },
        { message: generateErrorMessage('Link$') },
      ],
    },
    {
      code: 'const Hoge = styled(StatusLabel)``',
      errors: [
        { message: generateErrorMessage('StatusLabel$') },
        { message: generateErrorMessage('Label$') },
      ],
    },
    {
      code: 'const Hoge = styled(Cell)``',
      errors: [
        { message: generateErrorMessage('(Cell|Td|Th)$') },
      ],
    },
    {
      code: 'const Hoge = styled(BlankImage)``',
      errors: [
        { message: generateErrorMessage('BlankImage$') },
        { message: generateErrorMessage('Image$') },
      ],
    },
    {
      code: 'const Hoge = styled(CompactInformationPanel)``',
      errors: [
        { message: generateErrorMessage('CompactInformationPanel$') },
        { message: generateErrorMessage('InformationPanel$') },
      ],
    },
    ...['MultiComboBox', 'SingleComboBox'].map((base) => ({
      code: `const Hoge = styled(${base})\`\``,
      errors: [
        { message: generateErrorMessage(`${base}$`) },
        { message: generateErrorMessage('ComboBox$') },
      ],
    })),
    ...TAG_NAMES.map(([base, expected]) => ({
      code: `const Hoge = styled.${base}\`\``,
      errors: [
        { message: generateErrorMessage(`${expected}$`) },
      ],
    })),
    {
      code: 'const Hoge = styled.a``',
      errors: [
        { message: generateErrorMessage('(Anchor|Link)$') },
      ],
    },
    {
      code: 'const StyledHoge = styled(Hoge)``',
      options: [
        {
          '^Hoge$': 'Fuga$',
        },
      ],
      errors: [
        { message: generateErrorMessage('Fuga$', 'StyledHoge') },
      ],
    }
  ]
})
