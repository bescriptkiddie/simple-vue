import { baseHandle, ReactiveFlags, readonlyHandle } from './baseHandle'

const reactive = (target) => {
  // 如果传入的是一个对象，那么就创建一个响应式对象
  if (typeof target === "object" && target !== null) {
    return new Proxy(target, baseHandle)
  }
  return target
}

export const readonly = (target) => {
  return new Proxy(target, readonlyHandle)
}

export const isReactive = (value): Boolean => {
  // 通过访问 value 的 key，触发 get 操作，然后在 get 里面进行判断
  return value && !!value[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (value): Boolean => {
  return value && !!value[ReactiveFlags.IS_READONLY]
}
export default reactive