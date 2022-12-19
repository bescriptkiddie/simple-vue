class ReactiveEffect {
  private readonly fn: Function;
  deps = [];
  active = true;
  onStop?: ()=> void;
  constructor(fn: Function, public scheduler?: Function) {
    this.fn = fn;
  }
  run() {
    activeEffect = this;
    return this.fn();
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

const cleanupEffect = (effect: ReactiveEffect) => {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
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
  if (!activeEffect) return
  // 将 effect 放到 dep 中
  dep.add(activeEffect)
  // 反向收集：将 dep 放到 effect 中
  activeEffect.deps.push(dep);
}

/**
 * 触发更新
 * */
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    }else {
      effect.run();
    }
  }
}

export const  stop = (runner) => { // 传入的是 effect 的返回值
  runner.effect.stop();
}

let activeEffect;
export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  Object.assign(_effect, options);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  // 将 effect 的实例返回
  runner.effect = _effect;
  return runner;
}