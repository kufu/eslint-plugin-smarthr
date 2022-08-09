# smarthr/format-translate-component

- 翻訳用コンポーネントを適用する際のルールを定めます

## rules

```js
{
  rules: {
    'smarthr/format-translate-component': [
      'error', // 'warn', 'off'
      {
        componentName: 'Translate',
        // componentPath: '@/any/path/Translate',
        // prohibitAttributies: ['data-translate'],
      }
    ]
  },
}
```

## ❌ Incorrect

```jsx
<Translate><Any>ほげ</Any></Translate>
```

```jsx
<Translate><Any /></Translate>
```

```jsx
<Translate></Translate>
```

```jsx
// prohibitAttributies: ['data-translate'],
<Any data-translate="true">...</Any>
```

## ✅ Correct

```jsx
<Translate>ほげ</Translate>
```
```jsx
<Translate>ほげ<br />ふが</Translate>
```
```jsx
<Translate>{any}</Translate>
```
```jsx
<Translate dangerouslySetInnerHTML={{ __html: "ほげ" }} />
```
```jsx
// prohibitAttributies: ['data-translate'],
<Any data-hoge="true">...</Any>
```
