const { generateTagFormatter } = require('../../libs/format_styled_components');

const EXPECTED_NAMES = {
  'RemoteDialogTrigger$': 'RemoteDialogTrigger$',
  'RemoteTrigger(.+)Dialog$': 'RemoteTrigger(.+)Dialog$',
}

const REGEX_REMOTE_TRIGGER_DIALOG = /RemoteTrigger(Action|Message|Modeless)Dialog$/
const REGEX_REMOTE_DIALOG_TRIGGER = /RemoteDialogTrigger$/

module.exports = {
  meta: {
    type: 'suggestion',
    schema: [],
  },
  create(context) {
    return {
      ...generateTagFormatter({ context, EXPECTED_NAMES }),
      JSXOpeningElement: (node) => {
        const nodeName = node.name.name || '';

        const regexRemoteTriggerDialog = nodeName.match(REGEX_REMOTE_TRIGGER_DIALOG)

        if (regexRemoteTriggerDialog || nodeName.match(REGEX_REMOTE_DIALOG_TRIGGER)) {
          const attrName = regexRemoteTriggerDialog ? 'id' : 'targetId'
          const id = node.attributes.find((a) => a.name?.name === attrName)

          if (id && id.value.type !== 'Literal') {
            context.report({
              node: id,
              message: `${nodeName}の${attrName}属性には直接文字列を指定してください。
  - 変数などは利用できません（これは関連するTriggerとDialogを検索しやすくするためです）
  - RemoteTriggerActionDialogはループやDropdown内にTriggerが存在する場合に利用してください
  - ループやDropdown以外にTriggerが設定されている場合、TriggerAndActionDialogを利用してください`,
            })
          }
        }
      }
    }
  },
}
