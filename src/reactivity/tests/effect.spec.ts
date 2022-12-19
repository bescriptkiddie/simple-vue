import reactive from '../reactive'
import { effect } from '../effect'
describe("effect", () => {
  it("happy path", () => {
    const count = reactive({ num: 0 });
    let num;
    effect(() => {
      num = count.num;
      console.log('num', num);
    });
    expect(num).toBe(0);
    // 更新响应式数据
    count.num = 7;
    expect(num).toBe(7);
  });

  it('调用effect时可以返回runner', () => {
    // effect(fn) -> function(runner) -> fn -> return
    let number = 10
    const runner = effect(() => {
      number++
      return "number"
    })
    expect(number).toBe(11)
    const r = runner()
    expect(number).toBe(12)
    expect(r).toBe("number")
  })

  it('实现effect的scheduler功能', () => {
    // 1. effect的第二个参数为scheduler
    // 2. 第一次触发effect，执行 fn 跟 scheduler
    // 3. 响应式对象 set update时，不会执行fn，而是执行scheduler
    // 4. 执行runner时，再次执行fn

    let dummy, run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(()=>{
      dummy = obj.foo;
    }, { scheduler })
    // 第一次不会调用 scheduler
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo = 2;
    // fn 不会执行
    expect(dummy).toBe(1);
    // scheduler 在reactive的 set 的时候会执行
    expect(scheduler).toHaveBeenCalledTimes(1);
    run();
    // fn 会执行
    expect(dummy).toBe(2);
  })
});