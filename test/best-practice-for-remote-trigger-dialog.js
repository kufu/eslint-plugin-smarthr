const rule = require('../rules/best-practice-for-remote-trigger-dialog')
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

ruleTester.run('best-practice-for-remote-trigger-dialog', rule, {
  valid: [
    { code: `import styled from 'styled-components'` },
    { code: 'const HogeRemoteDialogTrigger = styled(RemoteDialogTrigger)``' },
    { code: 'const RemoteTriggerHogeDialog = styled(RemoteTriggerActionDialog)``' },
    { code: '<RemoteDialogTrigger targetId="hoge">open.</RemoteDialogTrigger>' },
    { code: '<StyledRemoteDialogTrigger targetId="fuga">open.</StyledRemoteDialogTrigger>' },
    { code: '<RemoteTriggerActionDialog {...args} id="hoge">content.</RemoteTriggerActionDialog>' },
    { code: '<RemoteTriggerHogeDialog {...args} id="hoge">content.</RemoteTriggerHogeDialog>' },
  ],
  invalid: [
    { code: `import hoge from 'styled-components'`, errors: [ { message: `styled-components をimportする際は、名称が"styled" となるようにしてください。例: "import styled from 'styled-components'"` } ] },
    { code: 'const Hoge = styled(RemoteDialogTrigger)``', errors: [ { message: 'Hogeを正規表現 "/RemoteDialogTrigger$/" がmatchする名称に変更してください。' } ] },
    { code: 'const Fuga = styled(RemoteTriggerActionDialog)``', errors: [ { message: 'Fugaを正規表現 "/RemoteTrigger(.+)Dialog$/" がmatchする名称に変更してください。' } ] },
    { code: '<RemoteDialogTrigger targetId={hoge}>open.</RemoteDialogTrigger>', errors: [ { message: `RemoteDialogTriggerのtargetId属性には直接文字列を指定してください。
  - 変数などは利用できません（これは関連するTriggerとDialogを検索しやすくするためです）
  - RemoteTriggerActionDialogはループやDropdown内にTriggerが存在する場合に利用してください
  - ループやDropdown以外にTriggerが設定されている場合、TriggerAndActionDialogを利用してください` } ] },
    { code: '<StyledRemoteDialogTrigger targetId={"fuga"}>open.</StyledRemoteDialogTrigger>', errors: [ { message: `StyledRemoteDialogTriggerのtargetId属性には直接文字列を指定してください。
  - 変数などは利用できません（これは関連するTriggerとDialogを検索しやすくするためです）
  - RemoteTriggerActionDialogはループやDropdown内にTriggerが存在する場合に利用してください
  - ループやDropdown以外にTriggerが設定されている場合、TriggerAndActionDialogを利用してください` } ] },
    { code: '<StyldRemoteTriggerActionDialog {...args} id={"fuga"}>content.</StyldRemoteTriggerActionDialog>', errors: [ { message: `StyldRemoteTriggerActionDialogのid属性には直接文字列を指定してください。
  - 変数などは利用できません（これは関連するTriggerとDialogを検索しやすくするためです）
  - RemoteTriggerActionDialogはループやDropdown内にTriggerが存在する場合に利用してください
  - ループやDropdown以外にTriggerが設定されている場合、TriggerAndActionDialogを利用してください` } ] },
  ]
})
