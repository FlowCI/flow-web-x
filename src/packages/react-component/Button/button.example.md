### 预定义样式
```
<div>
  <Button>默认按钮</Button>
  <Button type='text'>Text</Button>
  <Button type='primary'>Primary</Button>
  <Button type='secondary'>Secondary</Button>
  <Button type='danger'>Danger</Button>
  <Button type='success'>Success</Button>
  <Button type='warning'>Warning</Button>
  <Button type='text' component='a' href='/'>Link</Button>
</div>
```

### plain 预定义样式
```
<div>
  <Button plain>默认按钮</Button>
  <Button type='text' plain>Text</Button>
  <Button type='primary' plain>Primary</Button>
  <Button type='secondary' plain>Secondary</Button>
  <Button type='danger' plain>Danger</Button>
  <Button type='success' plain>Success</Button>
  <Button type='warning' plain>Warning</Button>
</div>
```
### disabled 状态
```
<div>
  <Button disabled>默认按钮</Button>
  <Button type='text' disabled>Text 按钮</Button>
  <Button type='secondary' disabled>Secondary</Button>
  <Button disabled plain>Plain 按钮</Button>
  <Button type='secondary' disabled plain>Secondary Plain 按钮</Button>
  <Button type='text' component='a' href='/' disabled>Link</Button>
</div>
```
### loading 状态
待加 icon
```
<div>
  <Button loading>默认按钮</Button>
  <Button loading plain>Plain</Button>
  <Button type='secondary' loading>Secondary</Button>
</div>
```
### Icon Button
```
<div>
  <Button leftIcon={<i className='icon icon-settings' />}>
    系统设置
  </Button>
  <Button type='primary' leftIcon={<i className='icon icon-settings' />}>
    系统设置
  </Button>
  <Button type='primary' rightIcon={<i className='icon icon-pencil' />}>
    编辑
  </Button>
  <Button type='primary' loading
    rightIcon={<i className='icon icon-pencil' />}>
    编辑
  </Button>
</div>
```

### Button Size
```
<div>
  <Button size='xs' type='primary'>超小</Button>
  <Button size='sm' type='primary'>小号</Button>
  <Button type='primary'>默认</Button>
  <Button size='lg' type='primary'>超大</Button>
</div>
```
