import {track, trigger} from './effect'

const createGetter = (isReadonly = false) => {
  return function get(target: object, key: string | symbol) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

const createSetter = () => {
  return function set(target: object, key: string | symbol, value: any) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}
const reactive = (target) => {
  // 如果传入的是一个对象，那么就创建一个响应式对象
  if (typeof target === "object" && target !== null) {
    return new Proxy(target, {
      get: createGetter(),
      set: createSetter()
    })
  }
  // 如果传入的不是一个对象，那么就直接返回
  return target
}

export const readonly = (target) => {
  return new Proxy(target, {
    get: createGetter(true),
    set() {
      console.warn("readonly")
      return true
    }
  })
}
export default reactive