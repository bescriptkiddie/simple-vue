import reactive from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    // 通过reactive创建一个响应式对象
    const original = { name: 'pika', age: 18 };
    const observed = reactive(original);
    expect(observed).not.toBe(original); // 响应式对象和原始对象不是同一个对象
    expect(observed.age).toBe(18);
    original.age = 20;
    expect(observed.age).toBe(20);
  });
});
