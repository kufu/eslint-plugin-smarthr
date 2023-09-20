# smarthr/a11y-image-has-alt-attribute

- 画像やアイコンにalt属性を設定することを強制するルールです
- checkTypeオプションに 'smart' を指定することで spread attributeが設定されている場合はcorrectに出来ます。

## rules

```js
{
  rules: {
    'smarthr/a11y-image-has-alt-attribute': [
      'error', // 'warn', 'off'
      // { checkType: 'always' } /* 'always' || 'smart' */
    ]
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
// checkType: 'always'
<XxxImage {...args} />
<YyyIcon {...args} any="any" />
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
// checkType: 'smart'
<XxxImage {...args} />
<YyyIcon {...args} any="any" />
```
```jsx
import styled from 'styled-components'

const StyledImage = styled.img``
const StyledImg = styled(Img)``
const StyledIcon = styled(Icon)``
```
