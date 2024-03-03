const rule = require('../rules/a11y-numbered-text-within-ol')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

ruleTester.run('a11y-numbered-text-within-ol', rule, {
  valid: [
    { code: `const HogeOrderedFugaList = styled.ol` },
    { code: `const HogeOrderedFugaList = styled(HogeOrderedList)` },
    { code: `<p>1: hoge</p>` },
    { code: `<p title="2. hoge" />` },
    { code: `<><p>2: hoge</p><p>1: hoge</p></>` },
    { code: `<ol><li>abc</li><li>def</li></ol>` },
    { code: `<OrderedList><li>abc</li><li>def</li></OrderedList>` },
    { code: `<Hoge as="ol"><li>abc</li><li>def</li></Hoge>` },
    { code: `<Hoge forwardedAs="ol"><li>abc</li><li>def</li></Hoge>` },
    { code: `<Select><optgroup><option value="hoge">1. hoge</option><option value="fuga">2. fuga</option></optgroup></Select>` },
    { code: `<><Hoge width="100%" /><Hoge height="200%" /><Hoge maxWidth="30px" /></>` },
  ],
  invalid: [
    { code: `<><p>1: hoge</p><p>2: hoge</p></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`1: hoge\` と \`2: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `
      <>
        <div>
          1. abc
        </div>
        <p>
          2. def
        </p>
      </>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`1. abc\` と \`2. def\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><p>2: hoge</p><p>1: hoge</p><p>2: hoge</p></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`1: hoge\` と \`2: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><p>1: hoge</p><ol><li>2: hoge</li></ol></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`1: hoge\` が \`2: hoge\` を囲んでいるol要素内(<ol>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<ol>)に存在する必要があります` }, { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` } ] },
    { code: `<><p>1: hoge</p><p title="2. hoge" /></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`1: hoge\` と \`title="2. hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><ol><li>1: hoge</li></ol><p>2: hoge</p></>`, errors: [ { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` }, { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`2: hoge\` が \`1: hoge\` を囲んでいるol要素内(<ol>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<ol>)に存在する必要があります` } ] },
    { code: `<><ol><li>1: hoge</li></ol><ol><li>2: hoge</li></ol></>`, errors: [ { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` }, { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` }, { message: `連番を含むテキストが同一のol要素でマークアップされていません。同一のol要素でマークアップすることでリスト内の要素関連性を正しく表せるためマークアップの修正を行ってください。
 - \`1: hoge\` と \`2: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><Hoge any="1: hoge" /><Hoge any="2: hoge" /></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="1: hoge"\` と \`any="2: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><Hoge any="2: hoge" /><Hoge any="1: hoge" /><Hoge any="2: hoge" /></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="1: hoge"\` と \`any="2: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><Hoge any="1: hoge" /><ol><li><Hoge any="2: hoge" /></li></ol></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="1: hoge"\` が \`any="2: hoge"\` を囲んでいるol要素内(<ol>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<ol>)に存在する必要があります` }, { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` } ] },
    { code: `<><ol><li><Hoge any="1: hoge" /></li></ol><Hoge any="2: hoge" /></>`, errors: [ { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` }, { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="2: hoge"\` が \`any="1: hoge"\` を囲んでいるol要素内(<ol>)に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol要素内(<ol>)に存在する必要があります` } ] },
    { code: `<><ol><li><Hoge any="1: hoge" /></li></ol><ol><li><Hoge any="2: hoge" /></li></ol></>`, errors: [ { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` }, { message: `ol 内で連番がテキストとして記述されています。連番はol要素で表現できるため、削除してください。
 - ol要素のデフォルトで表示される連番のフォーマット、スタイルから変更したい場合、counter-reset と counter-increment を利用してください
   - 参考: [MDN CSS カウンターの使用](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)` }, { message: `連番を含むテキストが同一のol要素でマークアップされていません。同一のol要素でマークアップすることでリスト内の要素関連性を正しく表せるためマークアップの修正を行ってください。
 - \`any="1: hoge"\` と \`any="2: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><Hoge any="1: hoge" /><Hoge any="2: hoge" /><Hoge any="3: hoge" /><Hoge any="4: hoge" /></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="1: hoge"\` と \`any="2: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` }, { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="2: hoge"\` と \`any="3: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` }, { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="3: hoge"\` と \`any="4: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><Hoge any="1: hoge" /><Hoge any="3: hoge" /><Hoge any="4: hoge" /><Hoge any="6: hoge" /></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`any="3: hoge"\` と \`any="4: hoge"\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><p>1: hoge</p><p>2: hoge</p><p>3: hoge</p><p>4: hoge</p></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`1: hoge\` と \`2: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` }, { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`2: hoge\` と \`3: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` }, { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`3: hoge\` と \`4: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><p>1: hoge</p><p>3: hoge</p><p>4: hoge</p><p>6: hoge</p></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`3: hoge\` と \`4: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
    { code: `<><p>3: hoge</p><select><option value="hoge">1: hoge</option></select><p>4: hoge</p></>`, errors: [ { message: `連番を含むテキストがol要素でマークアップされていません。ol要素でマークアップすることで関連する順番に意味のある要素を適切にマークアップできるため以下の方法で修正してください。
 - \`3: hoge\` と \`4: hoge\` が同じol要素内に存在するように修正してください
 - 上記以外にも関連する連番をふくむ要素が存在する場合、それらも同じol内に存在する必要があります` } ] },
  ]
})
