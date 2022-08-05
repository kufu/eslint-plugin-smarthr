# smarthr/require-import

- 対象ファイルにimportを強制させたい場合に利用します
  - 例: Page.tsx ではページタイトルを設定させたいので useTitle を必ずimportさせたい

## rules

```js
{
  rules: {
    'smarthr/require-import': [
      'error',
      {
        'Buttons\/.+\.tsx': {
          'smarthr-ui': {
            imported: ['SecondaryButton'],
            reportMessage: 'Buttons以下のコンポーネントでは {{module}}/{{export}} を拡張するようにしてください',
          },
        },
        'Page.tsx$': {
          './client/src/hooks/useTitle': {
            imported: true,
            reportMessage: '{{module}} を利用してください（ページタイトルを設定するため必要です）',
          },
        },
      },
    ]
  },
}
```

## ❌ Incorrect

```js
// client/src/Buttons/SecondaryButton.tsx
import { SecondaryButtonAnchor } from 'smarthr-ui'

// client/src/Page.tsx
import { SecondaryButton } from 'smarthr-ui'
```

## ✅ Correct


```js
// client/src/Buttons/SecondaryButton.tsx
import { SecondaryButton } from 'smarthr-ui'

// client/src/Page.tsx
import useTitle from '.hooks/useTitle'
```
