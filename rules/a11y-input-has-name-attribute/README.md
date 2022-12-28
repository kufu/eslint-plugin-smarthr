# smarthr/a11y-input-has-name-attribute

- ラジオボタンに name 属性を設定することを強制するルールです。
  - name を適切に設定することでラジオグループが確立され、キーボード操作しやすくなる等のメリットがあります。

## rules

```js
{
  rules: {
    'smarthr/a11y-input-has-name-attribute': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```jsx
<RadioButton />
```

```jsx
<Input type="radio" />
```

```jsx
<input type="radio" />
```

```jsx
import styled from 'styled-components';

const StyledHoge = styled.input``;
const StyledFuga = styled(Input)``;
const StyledPiyo = styled(RadioButton)``;
```

## ✅ Correct

```jsx
<RadioButton name="hoge" />
```

```jsx
<Input type="radio" name="hoge" />
```

```jsx
<input type="radio" name="hoge" />
```

```jsx
import styled from 'styled-components';

const StyledInput = styled.input``;
const StyledInput = styled(Input)``;
const StyledRadioButton = styled(RadioButton)``;
```
