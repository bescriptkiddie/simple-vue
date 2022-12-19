class ReactiveEffect {
  private readonly fn: Function;

  constructor(fn: Function, public scheduler?: Function) {
    this.fn = fn;
  }
  run() {
    activeEffect = this;
    return this.fn();
  }
}

/**
 * 收集依赖：把当前的 effect-callback 放到 dep 中
 * @param target
 * @param key
 * */
// 一个空间，存储 target 跟 dep 的对应关系
const targetMap = new Map();
export const track = (target, key) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // target 转化为 key => dep: 与key关联的callback, 由于一个key只能有一个callback，所以这里用Set
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect)
}

/**
 * 触发更新
 * */
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    console.log(effect.schuduler);
    if (effect.scheduler) {
      effect.scheduler();
    }else {
      effect.run();
    }
  }
}

let activeEffect;
export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  _effect.run();
  return _effect.run.bind(_effect);
}