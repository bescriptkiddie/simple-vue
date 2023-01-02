import { isTracking, trackEffects, triggerEffects } from './effect'

/**
 * ref 接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。
 * */
class RefImpl {
  // 保存内部值
  private _value: any
  // 依赖收集
  public dep

  constructor(value) {
    this._value = value
    this.dep = new Set()
  }
  get value() {
    // 收集依赖
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    // 如果值没有变化，不做处理
    if (Object.is(this._value, newValue)) return
    // 更新内部值
    this._value = newValue
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
