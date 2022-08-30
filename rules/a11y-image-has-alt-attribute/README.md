# smarthr/a11y-image-has-alt-attribute

- 画像やアイコンにalt属性を設定することを強制するルールです

## rules

```js
{
  rules: {
    'smarthr/a11y-image-has-alt-attribute': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
<Img />
```
```jsx
<Image>
  <Any />
</Image>
```
```jsx
<Icon />
```
```jsx
import styled from 'styled-components'

const StyledHoge = styled.img``
const StyledFuga = styled(Img)``
const StyledPiyo = styled(Icon)``
```

## ✅ Correct

```jsx
<Img alt="message" />
```
```jsx
<Image alt="message">
  <Any />
</Image>
```
```jsx
<Icon alt="message" />
```
```jsx
import styled from 'styled-components'

const StyledImage = styled.img``
const StyledImg = styled(Img)``
const StyledIcon = styled(Icon)``
```