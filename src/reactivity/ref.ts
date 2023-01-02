import { isTracking, trackEffects, triggerEffects } from './effect'
import reactive from './reactive'
import { isObject } from 'lodash'

/**
 * ref 接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。
 * */
class RefImpl {
  // 保存内部值
  private _value: any
  // 依赖收集
  public dep: Set<Function>
  // ref的真值
  private _rewValue: any

  constructor(value) {
    this._rewValue = value
    // 如果是对象，转换为响应式对象
    this._value = convertReactiveObject(value)
    this.dep = new Set()
  }
  get value() {
    // 收集依赖
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    // 如果值没有变化，不做处理
    if (Object.is(this._rewValue, newValue)) return
    // 更新内部值
    this._value = convertReactiveObject(newValue)
    triggerEffects(this.dep)
  }
}
export const ref = value => {
  return new RefImpl(value)
}

const trackRefValue = ref => {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

// 转化响应式对象
const convertReactiveObject = value =>
  isObject(value) ? reactive(value) : value
