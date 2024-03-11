# smarthr/a11y-input-has-name-attribute

- input, textarea, select など入力要素に name 属性を設定することを強制するルールです。
  - 入力要素は name を設定することでブラウザの補完機能が有効になる可能性が高まります。
    - 補完機能はブラウザによって異なるため、補完される可能性が上がるよう、name には半角英数の小文字・大文字と一部記号(`_ , [, ]`)のみ利用可能です。
  - input[type="radio"] は name を適切に設定することでラジオグループが確立され、キーボード操作しやすくなる等のメリットがあります。
- checkTypeオプションに 'allow-spread-attributes' を指定することで spread attributeが設定されている場合はcorrectに出来ます。

## rules

```js
{
  rules: {
    'smarthr/a11y-input-has-name-attribute': [
      'error', // 'warn', 'off'
      // { checkType: 'always' } /* 'always' || 'allow-spread-attributes' */
    ]
  },
}
```

## ❌ Incorrect

```jsx
<RadioButton />
<Input type="radio" />
<input type="text" />
<Textarea />
<Select />

// checkType: 'always'
<AnyInput {...args} />
<AnyInput {...args} any="any" />
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
<Input type="radio" name="fuga" />
<input type="text" name="any" />
<Textarea name="some" />
<Select name="piyo" />

// checkType: 'allow-spread-attributes'
<AnyInput {...args} />
<AnyInput {...args} any="any" />
```

```jsx
import styled from 'styled-components';

const StyledInput = styled.input``;
const StyledInput = styled(Input)``;
const StyledRadioButton = styled(RadioButton)``;
```
