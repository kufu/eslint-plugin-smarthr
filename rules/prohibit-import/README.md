# smarthr/prohibit-import

- 例えば特定の module にバグが発見されたなど、importさせたくない場合に利用するルールです

## rules

```js
{
  rules: {
    'smarthr/prohibit-import': [
      'error', // 'warn', 'off'
      {
        '^.+$': {
          'smarthr-ui': {
            imported: ['SecondaryButtonAnchor'],
            reportMessage: `{{module}}/{{export}} はXxxxxxなので利用せず yyyy/zzzz を利用してください`
          }, 
        }
        '\/pages\/views\/': {
          'query-string': {
            imported: true,
          },
        },
      }
    ]
  },
}
```

## ❌ Incorrect

```js
// src/pages/views/Page.tsx
import queryString from 'query-string'
import { SecondaryButtonAnchor } from 'smarthr-ui'
```

## ✅ Correct


```js
// src/pages/views/Page.tsx
import { PrimaryButton, SecondaryButton } from 'smarthr-ui'
```
