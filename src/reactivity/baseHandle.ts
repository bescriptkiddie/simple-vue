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

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const baseHandle = {
  get,
  set
}

export const readonlyHandle = {
  get: readonlyGet,
  set(key) {
    console.warn(`readonly object:${key} can't be set`)
    return true
  }
}