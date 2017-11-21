多选框组，依赖 Checkbox 组件, 此时 children 的 onchange 属性将失效
```
const Checkbox = require('../Checkbox').default;
<div>
  <CheckboxGroup value={['bj']}>
    <Checkbox value='sh' label='上海' />
    <Checkbox value='bj' label='北京' />
    <Checkbox value='gz' label='广州' />
    <Checkbox value='sz' label='深圳' />
    <Checkbox value='sz' label='深圳' disabled />
  </CheckboxGroup>
</div>
```
