import { track, trigger } from './effect'
import reactive, { readonly } from './reactive'
import { isObject } from 'lodash'

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

const createGetter = (isReadonly = false, shadow = false) => {
  return function get(target: object, key: string | symbol) {

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    if (shadow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
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
const shallowReadonlyGet = createGetter(true, true)

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

export const shadowReadonlyHandle = Object.assign({}, readonlyHandle, {
  get: shallowReadonlyGet
})