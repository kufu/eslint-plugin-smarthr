# smarthr/best-practice-for-remote-trigger-dialog

- RemoteDialogTrigger, RemoteTriggerXxxxDialog のベストプラクティスをチェックするルールです
  - `id` もしくは `targetId` にリテラルな文字列以外が設定できなくなります
  - 変数なども使えません
  - これは対応するTriggerとDialogをわかりやすくするためです（検索などが容易になります）

## rules

```js
{
  rules: {
    'smarthr/best-practice-for-remote-trigger-dialog': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```js
<RemoteDialogTrigger targetId={id}>open.</RemoteDialogTrigger>
<RemoteTriggerActionDialog {...args} id={'hoge'}>content.</RemoteTriggerActionDialog>
```

## ✅ Correct


```js
<RemoteDialogTrigger targetId="help_dialog">open.</RemoteDialogTrigger>
<RemoteTriggerActionDialog {...args} id="help_dialog">content.</RemoteTriggerActionDialog>
```
