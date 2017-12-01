单选按钮组
子组件本身属性中的 checked、onChange 将失效
```
const Radio = require('../Radio').default;
<div>
  <RadioGroup value='bj'>
    <Radio value='sh' label='上海' />
    <Radio value='bj' label='北京' />
    <Radio value='gz' label='广州' />
    <Radio value='sz' label='深圳' />
    <Radio value='sz' label='深圳' disabled />
  </RadioGroup>
</div>
```
