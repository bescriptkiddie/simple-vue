import reactive from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    // 通过reactive创建一个响应式对象
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
});
