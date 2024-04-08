const rule = require('../rules/best-practice-for-layouts')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
})

const errorMessage = (type, name) => `${name}には子要素が一つしか無いため、${type}でマークアップする意味がありません。
 - styleを確認し、div・spanなど、別要素でマークアップし直すか、${name}を削除してください
 - as, forwardedAsなどでSectioningContent系要素に変更している場合、対応するsmarthr-ui/Section, Aside, Nav, Article のいずれかに差し替えてください`

ruleTester.run('best-practice-for-button-element', rule, {
  valid: [
    { code: `<Center />` },
    { code: `<Cluster />` },
    { code: `<Stack />` },
    { code: `<HogeCenter />` },
    { code: `<HogeCluster />` },
    { code: `<HogeStack />` },
    { code: `<Center><Hoge /></Center>` },
    { code: `<Center><Hoge /><Hoge /></Center>` },
    { code: `<Stack><Hoge /><Hoge /></Stack>` },
    { code: `<Stack>{a}<Hoge /></Stack>` },
    { code: `<AnyStack>{a.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a?.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a.b?.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a?.b?.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a && <><Hoge /><Hoge /></>}</AnyStack>` },
    { code: `<AnyStack>{a && a.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a && a.b.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a || <><Hoge /><Hoge /></>}</AnyStack>` },
    { code: `<AnyStack>{a || a.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a || a.b.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a ? a.b.map(action) : <Hoge />}</AnyStack>` },
    { code: `<AnyStack>{a ? <Hoge /> : a.b.map(action)}</AnyStack>` },
    { code: `<AnyStack>{a ? <Hoge /> : a ? <Hoge /> : a.b.map(action)}</AnyStack>` },
    { code: `<Cluster><Hoge /><Hoge /></Cluster>` },
    { code: `<Cluster>{a}<Hoge /></Cluster>` },
    { code: `<AnyCluster>{a.map(action)}</AnyCluster>` },
    { code: `<AnyCluster>{a && <><Hoge /><Hoge /></>}</AnyCluster>` },
    { code: `<AnyCluster>{a && a.map(action)}</AnyCluster>` },
    { code: `<AnyCluster>{a && a.b.map(action)}</AnyCluster>` },
    { code: `<AnyCluster>{a || <><Hoge /><Hoge /></>}</AnyCluster>` },
    { code: `<AnyCluster>{a || a.map(action)}</AnyCluster>` },
    { code: `<AnyCluster>{a || a.b.map(action)}</AnyCluster>` },
    { code: `<AnyCluster>{a ? a.b.map(action) : <Hoge />}</AnyCluster>` },
    { code: `<AnyCluster>{a ? <Hoge /> : a.b.map(action)}</AnyCluster>` },
    { code: `<AnyCluster>{a ? <Hoge /> : a ? <Hoge /> : a.b.map(action)}</AnyCluster>` },
    { code: `<Cluster justify="flex-end">{a}</Cluster>` },
    { code: `<HogeCluster justify="end">{a}</HogeCluster>` },
    { code: `<Stack align="flex-end">{a}</Stack>` },
    { code: `<HogeStack align="end">{a}</HogeStack>` },
  ],
  invalid: [
    { code: `<Stack><Hoge /></Stack>`, errors: [ { message: errorMessage('Stack', 'Stack') } ] },
    { code: `<Stack>{a}</Stack>`, errors: [ { message: errorMessage('Stack', 'Stack') } ] },
    { code: `<AnyStack>{a.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a && <><Hoge /></>}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a && a.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a && a.b.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a || <><Hoge /></>}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a || a.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a || a.b.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a ? a.b.hoge(action) : <Hoge />}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a ? <Hoge /> : a.b.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<AnyStack>{a ? <Hoge /> : a ? <Hoge /> : a.b.hoge(action)}</AnyStack>`, errors: [ { message: errorMessage('Stack', 'AnyStack') } ] },
    { code: `<Cluster><Hoge /></Cluster>`, errors: [ { message: errorMessage('Cluster', 'Cluster') } ] },
    { code: `<Cluster>{a}</Cluster>`, errors: [ { message: errorMessage('Cluster', 'Cluster') } ] },
    { code: `<AnyCluster>{a.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a && <><Hoge /></>}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a && a.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a && a.b.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a || <><Hoge /></>}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a || a.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a || a.b.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a ? a.b.hoge(action) : <Hoge />}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a ? <Hoge /> : a.b.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<AnyCluster>{a ? <Hoge /> : a ? <Hoge /> : a.b.hoge(action)}</AnyCluster>`, errors: [ { message: errorMessage('Cluster', 'AnyCluster') } ] },
    { code: `<HogeCluster justify="center">{a}</HogeCluster>`, errors: [ { message: 'HogeCluster は smarthr-ui/Cluster ではなく smarthr-ui/Center でマークアップしてください' } ] },
    { code: `<HogeStack align="center">{a}</HogeStack>`, errors: [ { message: 'HogeStack は smarthr-ui/Stack ではなく smarthr-ui/Center でマークアップしてください' } ] },
  ]
})

