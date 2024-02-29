# smarthr/best-practice-for-button-element

- button要素の利用を禁止し、smarthr/Button、もしくはsmarthr/UnstyledButtonの利用を促すルールです
- button要素のtype属性のデフォルトは 'submit' であり、これはform要素にbuttonを設置すると、clickでformをsubmitする状態になります
- 上記挙動は開発者が意図しづらいため、smarthr/Button, smarthr/UnstyledButtonはtype属性のデフォルトを 'button' に変更しています

## rules

```js
{
  rules: {
    'smarthr/best-practice-for-button-element': 'error', // 'warn', 'off'
  },
}
```

## ❌ Incorrect

```js
<button>click</button>

const AnyButton = styled.button``
```

## ✅ Correct


```js
<button type="button">click</button>
<button type="submit">click</button>
<Button>click</Button>
<AnyButton>click</AnyButton>

const AnyButton = styled(Button)``
```
