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

ruleTester.run('smarthr/a11y-delegate-element-has-role-presentation', rule, {
  valid: [
    { code: '<Input />' },
    { code: '<HogeForm>any</HogeForm>' },
    { code: '<FugaButton>any</FugaButton>' },
    { code: '<Link />' },
    { code: '<div onClick={any} role="presentation"><Link /></div>' },
    { code: '<Wrapper onClick={any} role="presentation"><Link /></Wrapper>' },
    { code: '<Wrapper onClick={any} role="presentation"><Hoge /></Wrapper>', options: [{ additionalInteractiveComponentRegex: ['^Hoge$'] }] },
    { code: '<Wrapper onClick={any} role="presentation"><any><Link /></any></Wrapper>' },
  ],
  invalid: [
    { code: '<Input role="presentation" />', errors: [ { message: `Inputはinput、buttonやaなどのインタラクティブな要素にもかかわらず 'role="presentation"' が設定されているため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 'role="presentation"' を削除してください
 - 方法2: Inputの名称を "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" とマッチしない名称に変更してください` } ] },
    { code: '<HogeForm role="presentation">any</HogeForm>', errors: [ { message: `HogeFormはinput、buttonやaなどのインタラクティブな要素にもかかわらず 'role=\"presentation\"' が設定されているため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 'role="presentation"' を削除してください
 - 方法2: HogeFormの名称を "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" とマッチしない名称に変更してください` } ] },
    { code: '<FugaButton role="presentation">any</FugaButton>', errors: [ { message: `FugaButtonはinput、buttonやaなどのインタラクティブな要素にもかかわらず 'role="presentation"' が設定されているため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 'role="presentation"' を削除してください
 - 方法2: FugaButtonの名称を "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" とマッチしない名称に変更してください` } ] },
    { code: '<Link role="presentation" />', errors: [ { message: `Linkはinput、buttonやaなどのインタラクティブな要素にもかかわらず 'role="presentation"' が設定されているため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 'role="presentation"' を削除してください
 - 方法2: Linkの名称を "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" とマッチしない名称に変更してください` } ] },
    { code: '<div onClick={any} onSubmit={any2} role="presentation"><Hoge /></div>', errors: [ { message: `divに 'role="presentation"' が設定されているにも関わらず、子要素にinput、buttonやaなどのインタラクティブな要素が見つからないため、ブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1: 子要素にインタラクティブな要素が存在するにも関わらずこのエラーが表示されている場合、子要素の名称を変更してください
   - "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" の正規表現にmatchするよう、インタラクティブな子要素全ての名称を変更してください
 - 方法2: div自体がインタラクティブな要素の場合、'role="presentation"'を削除した上で名称を変更してください
   - "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" の正規表現にmatchするよう、divの名称を変更してください
 - 方法3: 子要素にインタラクティブな要素が存在し、onClick, onSubmit全属性をそれらの要素に移動させられる場合、'role="presentation"'を消した上で実施してください` } ] },
    { code: '<div onClick={any}><Link /></div>', errors: [ { message: `div にonClickを設定するとブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1:  divがinput、buttonやaなどのインタラクティブな要素の場合、コンポーネント名の末尾をインタラクティブなコンポーネントであることがわかる名称に変更してください
   - "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" の正規表現にmatchする名称に変更してください
 - 方法2: インタラクティブな親要素、もしくは子要素が存在する場合、直接onClickを設定することを検討してください
 - 方法3: インタラクティブな親要素、もしくは子要素が存在しない場合、インタラクティブな要素を必ず持つようにマークアップを修正後、onClickの設定要素を検討してください
 - 方法4: インタラクティブな子要素から発生したイベントをキャッチすることが目的でonClickを設定している場合、'role="presentation"' を設定してください` } ] },
    { code: '<Wrapper onClick={any}><Link /></Wrapper>', errors: [ { message: `Wrapper にonClickを設定するとブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1:  Wrapperがinput、buttonやaなどのインタラクティブな要素の場合、コンポーネント名の末尾をインタラクティブなコンポーネントであることがわかる名称に変更してください
   - "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" の正規表現にmatchする名称に変更してください
 - 方法2: インタラクティブな親要素、もしくは子要素が存在する場合、直接onClickを設定することを検討してください
 - 方法3: インタラクティブな親要素、もしくは子要素が存在しない場合、インタラクティブな要素を必ず持つようにマークアップを修正後、onClickの設定要素を検討してください
 - 方法4: インタラクティブな子要素から発生したイベントをキャッチすることが目的でonClickを設定している場合、'role="presentation"' を設定してください` } ] },
    { code: '<Wrapper onSubmit={any}><Hoge /></Wrapper>', options: [{ additionalInteractiveComponentRegex: ['^Hoge$'] }], errors: [ { message: `Wrapper にonSubmitを設定するとブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1:  Wrapperがinput、buttonやaなどのインタラクティブな要素の場合、コンポーネント名の末尾をインタラクティブなコンポーネントであることがわかる名称に変更してください
   - "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$|^Hoge$)/" の正規表現にmatchする名称に変更してください
 - 方法2: インタラクティブな親要素、もしくは子要素が存在する場合、直接onSubmitを設定することを検討してください
 - 方法3: インタラクティブな親要素、もしくは子要素が存在しない場合、インタラクティブな要素を必ず持つようにマークアップを修正後、onSubmitの設定要素を検討してください
 - 方法4: インタラクティブな子要素から発生したイベントをキャッチすることが目的でonSubmitを設定している場合、'role="presentation"' を設定してください` } ] },
    { code: '<Wrapper onClick={any} onChange={anyany}><any><Link /></any></Wrapper>', errors: [ { message: `Wrapper にonClick, onChangeを設定するとブラウザが正しく解釈が行えず、ユーザーが利用することが出来ない場合があるため、以下のいずれかの対応をおこなってください。
 - 方法1:  Wrapperがinput、buttonやaなどのインタラクティブな要素の場合、コンポーネント名の末尾をインタラクティブなコンポーネントであることがわかる名称に変更してください
   - "/(Input$|Textarea$|Select$|InputFile$|RadioButtonPanel$|CheckBox$|ComboBox$|DatePicker$|DropZone$|FieldSet$|Button$|Anchor$|Link$|TabItem$|(Anchor|Link)$|Form$|ActionDialogWithTrigger$|RemoteDialogTrigger$|RemoteTrigger(.+)Dialog$|Pagination$|SideNav$|AccordionPanel$)/" の正規表現にmatchする名称に変更してください
 - 方法2: インタラクティブな親要素、もしくは子要素が存在する場合、直接onClick, onChangeを設定することを検討してください
 - 方法3: インタラクティブな親要素、もしくは子要素が存在しない場合、インタラクティブな要素を必ず持つようにマークアップを修正後、onClick, onChangeの設定要素を検討してください
 - 方法4: インタラクティブな子要素から発生したイベントをキャッチすることが目的でonClick, onChangeを設定している場合、'role="presentation"' を設定してください` } ] },
  ],
});
