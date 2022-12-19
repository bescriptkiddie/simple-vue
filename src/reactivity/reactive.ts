import { baseHandle, readonlyHandle } from './baseHandle'

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
export default reactive