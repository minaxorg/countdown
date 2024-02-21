# @minax/countdown &middot; [![npm](https://img.shields.io/npm/v/@minax/countdown.svg)](https://www.npmjs.com/package/@minax/countdown)
React 倒计时组件（本地持久化倒计时记录）

## 安装

``` shell
npm i --save @minax/countdown
```

## 使用场景

点击发送验证码，需要用户等待一分钟才允许再次发送，此时按钮应该有个一分钟的不可点击状态，且用户如果刷新/关闭浏览器再打开该页面时，该计时器状态仍然有效。

## 在线 Demo

[![Edit @minax/countdown Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/v3tjqz?file=%2Fsrc%2Findex.jsx%3A10%2C1)

## 使用方式

### 1. Hooks API `useCountDown`

```jsx
import { useCountDown } from '@minax/countdown'

const Cpt = () => {
  const [restTime, resetCountDown] = useCountDown('cnt', { total: 60, lifecycle: 'session' })

  return null
}

```

### 2. `CountDownProvider`

```jsx
import { CountDownProvider } from '@minax/countdown'

const Cpt = () => (
  <CountDownProvider
    id='cnt'
    options={{
      total: 60,
      lifecycle: 'session'
    }}
  >
    {
      (restTime, resetCountDown) => null
    }
  </CountDownProvider>
)
```

## 参数说明

``` jsx
useCountDown(id, options)

<CountDownProvider id={id} options={options} />
```

name|type|required|default|description
--|--|--|--|--
id|string|true||唯一标识位，通过 id 来持久化时间数据
options|object|false|`{total: 60, lifecycle: 'session'}`|额外参数

options 由下列属性组成

name|type|required|default|description
--|--|--|--|--
total|number|false|60|每次倒计时总时长（秒）
lifecycle|'session' \| 'always' \| { setter: Function, getter: Function } |false|'session'|持久化方式

lifecycle 说明：
 - 使用 'session'，底层使用 sessionStorage 储存数据，即倒计时只在当前页面周期内生效，用户关闭页面或打开新的页面时，计时器失效。
 - 使用 'always'，底层使用 localStorage 存储数据，用户只要不清除浏览器数据，则该计时器一直生效。
 - 传入 getter 和 setter 方法，自定义数据持久化方式，例如传入 'session' 时，实际上等价于下方代码。
```js
const [resetTime, resetCountDown] = useCountDown('cnt', {
  total: 60,
  lifecycle: {
    setter: (key, value) => {
      // 组件回调函数传入保存数据的 key 和 value
      sessionStorage.setItem(key, value)
    },
    // 组件回调函数传入需要获取的数据的 key
    getter: (key) => sessionStorage.getItem(key)
  }
})
```
> 使用场景在使用 React 开发非 Web 端应用时（例如使用 [Remax](https://github.com/remaxjs/remax) 开发微信小程序），全局环境中没有 localStorage 和 sessionStorage，这时可以自定义 getter 和 setter 方法来实现。