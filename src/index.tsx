import { useEffect, useCallback, useState, useMemo, type ReactNode } from 'react'

interface Options {
  total?: number
  lifecycle?: 'always' | 'session' | {
    setter: (key: string, value: string) => void
    getter: (key: string) => string | null
  }
}

const useCountDown = (
  timerKey: string,
  options?: Options
) => {
  const [addData, getData] = useMemo(() => {
    const total = options?.total ?? 60
    const lifecycle = options?.lifecycle ?? 'session'
    const saveKey = `__MINAX_COUNTDOWN_${timerKey.toUpperCase()}`
    const getExpiredStr = () => (Date.now() + total * 1000).toString()

    let getter: () => string | null = () => null
    let setter: () => void = () => {}

    if (typeof lifecycle === 'string') {
      switch (lifecycle) {
        case 'always': {
          setter = () => {
            localStorage.setItem(saveKey, getExpiredStr())
          }
          getter = () => localStorage.getItem(saveKey)
          break
        }
        case 'session':
        {
          setter = () => {
            sessionStorage.setItem(saveKey, getExpiredStr())
          }
          getter = () => sessionStorage.getItem(saveKey)
          break
        }
        default:
          throw new SyntaxError('Please provide correct lifecycle!')
      }
    } else if (typeof lifecycle === 'object') {
      if (!lifecycle.setter || !lifecycle.getter) {
        throw new SyntaxError('Please provide setter and getter function!')
      }

      setter = () => {
        lifecycle.setter(saveKey, getExpiredStr())
      }
      getter = () => lifecycle.getter(saveKey)
    }

    return [setter, () => {
      try {
        return parseInt(getter() ?? '0', 10)
      } catch {
        return 0
      }
    }] as const
  }, [options, timerKey])

  const getRestTime = useCallback(() => {
    const restTime = Math.floor(((getData() - Date.now()) / 1000))
    return restTime < 0 ? 0 : restTime
  }, [getData])

  const [restTime, setRestTime] = useState(getRestTime())

  useEffect(() => {
    const timer = setInterval(() => {
      const newRestTime = getRestTime()
      if (restTime !== newRestTime) {
        setRestTime(newRestTime)
      }
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [getRestTime, restTime])

  const resetCountDown = addData

  return [
    restTime,
    resetCountDown
  ] as const
}

const CountDownProvider = ({ id, children, options }: {
  id: string
  options?: Options
  children: (restTime: number, resetCountDown: () => void) => ReactNode
}) => {
  const [restTime, resetCountDown] = useCountDown(id, options)

  return children(restTime, resetCountDown)
}

export { useCountDown, CountDownProvider }
