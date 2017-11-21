目前使用 relative 布局实现，请注意父级的 overflow: hidden， 以免 dropdown menu 被部分隐藏， 目前先不支持键盘事件

### 基础样式
```
const Select = require('Select').Select;
const Option = require('Select').Option;
<div>
  <Select value='2' leftIcon={<i className='icon icon-settings' />}>
    <Option value='1'>111111</Option>
    <Option value='2'>222222</Option>
    <Option value='3' disabled>333333</Option>
    <Option value='4' label='444444' />
  </Select>
</div>
```

### loading、disabled
```
<div>
  <div>
    <Select placeholder='Loading' loading />
  </div>
  <br />
  <div>
    <Select placeholder='disabled' disabled />
  </div>
</div>
```

### 大小
```
<div className='list'>
  <div>
    <Select size='xs' placeholder='xs'>
      <Option value='1'>123</Option>
      <Option value='2'>123</Option>
      <Option value='3'>123</Option>
      <Option value='4'>123</Option>
    </Select>
  </div>
  <br/>
  <div>
    <Select size='sm' placeholder='sm'>
      <Option value='1'>123</Option>
      <Option value='2'>123</Option>
      <Option value='3'>123</Option>
      <Option value='4'>123</Option>
    </Select>
  </div>
  <br/>
  <div>
    <Select placeholder='default'>
      <Option value='1'>123</Option>
      <Option value='2'>123</Option>
      <Option value='3'>123</Option>
      <Option value='4'>123</Option>
    </Select>
  </div>
  <br/>
  <div>
    <Select size='lg' placeholder='lg'>
      <Option value='1'>123</Option>
      <Option value='2'>123</Option>
      <Option value='3'>123</Option>
      <Option value='4'>123</Option>
    </Select>
  </div>
  <br/>
</div>
```
