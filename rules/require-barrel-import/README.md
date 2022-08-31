# smarthr/require-barrel-import

- tsconfig.json の compilerOptions.pathsに '@/*', もしくは '~/*' としてroot path を指定する必要があります
- importした対象が本来exportされているべきであるbarrel(index.tsなど)が有る場合、import pathの変更を促します
  - 例: Page/parts/Menu/Item の import は Page/parts/Menu から行わせたい
- ディレクトリ内のindexファイルを捜査し、対象を決定します

## rules

```js
{
  rules: {
    'smarthr/require-barrel-import': 'error',
  },
}
```

## ❌ Incorrect

```js
// client/src/views/Page/parts/Menu/index.ts
export { Menu } from './Menu'
export { Item } from './Item'

// client/src/App.tsx
import { Item } from './Page/parts/Menu/Item'
```

## ✅ Correct


```js
// client/src/views/Page/parts/Menu/index.ts
export { Menu } from './Menu'
export { Item } from './Item'

// client/src/App.tsx
import { Item } from './Page/parts/Menu'
```
