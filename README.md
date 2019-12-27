# @minax/countdown &middot; [![npm](https://img.shields.io/npm/v/@minax/countdown.svg)](https://www.npmjs.com/package/@minax/countdown)
React 倒计时组件（本地持久化倒计时记录）

## 安装

``` shell
npm i --save @minax/countdown
```

## 使用场景

点击发送验证码，需要用户等待一分钟才允许再次发送，此时按钮应该有个一分钟的不可点击状态，且用户如果刷新/关闭浏览器再打开该页面时，该计时器状态仍然有效。

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
lifecycle|'session' \| 'always'|false|'session'|持久化方式

lifecycle 说明：
 - 使用 'session'，底层使用 sessionStorage 储存数据，即倒计时只在当前页面周期内生效，用户关闭页面或打开新的页面时，计时器失效。
 - 使用 'always',底层使用 localStorage 存储数据，用户只要不清除浏览器数据，则该计时器一直生效。
