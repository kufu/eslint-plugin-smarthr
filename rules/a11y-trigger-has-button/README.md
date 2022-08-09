# smarthr/a11y-trigger-has-button

- DropdownTriggerやDialogTriggerの直下にButtonを設置することを強制するルールです

## rules

```js
{
  rules: {
    'smarthr/a11y-trigger-has-button': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
<DropdownTrigger>
  <Xxx />
</DropdownTrigger>
```
```jsx
<DialogTrigger>
  <Yyy />
</DialogTrigger>
```
```jsx
import styled from 'styled-components'

const StyledHoge = styled.a``
const StyledFuga = styled.button``
const StyledAnchor = styled(Link)``
const StyledBtn = styled(Button)``
const StyledPiyo = styled(DropdownTrigger)``
```

## ✅ Correct

```jsx
<DropdownTrigger>
  <Button />
</DropdownTrigger>
```
```jsx
<DialogTrigger>
  <XxxButton />
</DialogTrigger>
```
```jsx
import styled from 'styled-components'

const StyledAnchor = styled.a``
const StyledButton = styled.button``
const StyledLink = styled(Link)``
const StyledButton = styled(Button)``
const StyledDropdownTrigger = styled(DropdownTrigger)``
```
