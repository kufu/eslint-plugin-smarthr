const rule = require('../rules/a11y-delegate-element-has-role-presentation');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
});

const defaultInteractiveRegex = '/((i|I)nput$|(t|T)extarea$|(s|S)elect$|InputFile$|RadioButtonPanel$|Check(b|B)ox$|Combo(b|B)ox$|DatePicker$|DropZone$|FieldSet$|(b|B)utton$|Anchor$|Link$|TabItem$|^a$|(f|F)orm$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/'
const messageNonInteractiveEventHandler = (nodeName, onAttrs, interactiveComponentRegex = defaultInteractiveRegex) => {
  const onAttrsText = onAttrs.join(', ')

  return `${nodeName} に${onAttrsText}を設定するとブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1:  ${nodeName}がinput、buttonやaなどのインタラクティブな要素の場合、コンポーネント名の末尾をインタラクティブなコンポーネントであることがわかる名称に変更してください
   - "${interactiveComponentRegex}" の正規表現にmatchするコンポーネントに差し替える、もしくは名称を変更してください
 - 方法2: インタラクティブな親要素、もしくは子要素が存在する場合、直接${onAttrsText}を設定することを検討してください
 - 方法3: インタラクティブな親要素、もしくは子要素が存在しない場合、インタラクティブな要素を必ず持つようにマークアップを修正後、${onAttrsText}の設定要素を検討してください
 - 方法4: インタラクティブな子要素から発生したイベントをキャッチすることが目的で${onAttrsText}を設定している場合、'role="presentation"' を設定してください`
}
const messageRolePresentationNotHasInteractive = (nodeName, onAttrs, interactiveComponentRegex = defaultInteractiveRegex) => `${nodeName}に 'role="presentation"' が設定されているにも関わらず、子要素にinput、buttonやaなどのインタラクティブな要素が見つからないため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 子要素にインタラクティブな要素が存在するにも関わらずこのエラーが表示されている場合、子要素の名称を変更してください
   - "${interactiveComponentRegex}" の正規表現にmatchするよう、インタラクティブな子要素全てを差し替える、もしくは名称を変更してください
 - 方法2: ${nodeName}自体がインタラクティブな要素の場合、'role="presentation"'を削除した上で名称を変更してください
   - "${interactiveComponentRegex}" の正規表現にmatchするよう、${nodeName}の名称を変更してください
 - 方法3: 子要素にインタラクティブな要素が存在し、${onAttrs.join(', ')}全属性をそれらの要素に移動させられる場合、'role="presentation"'を消した上で実施してください`
const messageInteractiveHasRolePresentation = (nodeName, interactiveComponentRegex = defaultInteractiveRegex) => `${nodeName}はinput、buttonやaなどのインタラクティブな要素にもかかわらず 'role="presentation"' が設定されているため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 'role="presentation"' を削除してください
 - 方法2: ${nodeName}の名称を "${interactiveComponentRegex}" とマッチしない名称に変更してください`

ruleTester.run('smarthr/a11y-delegate-element-has-role-presentation', rule, {
  valid: [
    { code: '<Input />' },
    { code: '<HogeForm>any</HogeForm>' },
    { code: '<FugaButton>any</FugaButton>' },
    { code: '<Link />' },
    { code: '<div onClick={any} role="presentation"><Link /></div>' },
    { code: '<div onClick={any} role="presentation"><button /></div>' },
    { code: '<Wrapper onClick={any} role="presentation"><Link /></Wrapper>' },
    { code: '<Wrapper onClick={any} role="presentation"><Hoge /></Wrapper>', options: [{ additionalInteractiveComponentRegex: ['^Hoge$'] }] },
    { code: '<Wrapper onClick={any} role="presentation"><any><Link /></any></Wrapper>' },
  ],
  invalid: [
    { code: '<Input role="presentation" />', errors: [ { message: messageInteractiveHasRolePresentation('Input') } ] },
    { code: '<HogeForm role="presentation">any</HogeForm>', errors: [ { message: messageInteractiveHasRolePresentation('HogeForm') } ] },
    { code: '<FugaButton role="presentation">any</FugaButton>', errors: [ { message: messageInteractiveHasRolePresentation('FugaButton') } ] },
    { code: '<Link role="presentation" />', errors: [ { message: messageInteractiveHasRolePresentation('Link') } ] },
    { code: '<div onClick={any} onSubmit={any2} role="presentation"><Hoge /></div>', errors: [ { message: messageRolePresentationNotHasInteractive('div', ['onClick', 'onSubmit']) } ] },
    { code: '<div onClick={any}><Link /></div>', errors: [ { message: messageNonInteractiveEventHandler('div', ['onClick']) } ] },
    { code: '<Wrapper onClick={any}><Link /></Wrapper>', errors: [ { message: messageNonInteractiveEventHandler('Wrapper', ['onClick']) } ] },
    { code: '<Wrapper onSubmit={any}><Hoge /></Wrapper>', options: [{ additionalInteractiveComponentRegex: ['^Hoge$'] }], errors: [ { message: messageNonInteractiveEventHandler('Wrapper', ['onSubmit'], '/((i|I)nput$|(t|T)extarea$|(s|S)elect$|InputFile$|RadioButtonPanel$|Check(b|B)ox$|Combo(b|B)ox$|DatePicker$|DropZone$|FieldSet$|(b|B)utton$|Anchor$|Link$|TabItem$|^a$|(f|F)orm$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$|^Hoge$)/') } ] },
    { code: '<Wrapper onClick={any} onChange={anyany}><any><Link /></any></Wrapper>', errors: [ { message: messageNonInteractiveEventHandler('Wrapper', ['onClick', 'onChange']) } ] },
  ],
});
