# smarthr/a11y-input-has-name-attribute

- input, textarea, select に name 属性を設定することを強制するルールです。
  - input は name を設定することでブラウザの補完機能が有効になる可能性が高まります。
    - 補完機能はブラウザによって異なるため、補完される可能性が上がるよう、name には半角英数の小文字・大文字と一部記号(`_ , [, ]`)のみ利用可能です。
  - input[type="radio"] は name を適切に設定することでラジオグループが確立され、キーボード操作しやすくなる等のメリットがあります。

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
