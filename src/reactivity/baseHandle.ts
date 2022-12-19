import { track, trigger } from './effect'

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

export const baseHandle = {
  get: createGetter(),
  set: createSetter()
}

export const readonlyHandle = {
  get: createGetter(true),
  set() {
    console.warn("readonly")
    return true
  }
}