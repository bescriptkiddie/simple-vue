import {track, trigger} from './effect'

const reactive = (target) => {
  // 如果传入的是一个对象，那么就创建一个响应式对象
  if (typeof target === "object" && target !== null) {
    return new Proxy(target,{
      get(obj, key) {
        const res = Reflect.get(obj, key);
        // 收集依赖
        track(obj, key);
        return res;
      },

      set(obj: any, key: string | symbol, newValue: any): boolean {
        const res = Reflect.set(obj, key, newValue);
        // 触发更新
        trigger(obj, key);
        return res;
      }
    });
  }
  // 如果传入的不是一个对象，那么就直接返回
  return target;
}

export default reactive