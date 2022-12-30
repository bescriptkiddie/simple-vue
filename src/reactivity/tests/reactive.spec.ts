import reactive, {
  isReactive,
  isReadonly,
  shadowReadonly,
  isProxy,
} from '../reactive';
describe('reactive', () => {
  it('happy path', () => {
    // 通过reactive创建一个响应式对象
    const original = { name: 'pika', age: 18 };
    const observed = reactive(original);
    expect(observed).not.toBe(original); // 响应式对象和原始对象不是同一个对象
    expect(observed.age).toBe(18);
    original.age = 20;
    expect(observed.age).toBe(20);
    expect(isProxy(observed)).toBe(true); // isProxy 判断是否是响应式对象
  });

  it('嵌套对象的响应式', () => {
    const user = { userInfo: { name: 'pika' }, friends: [{ name: 'lulu' }] };
    const observed = reactive(user);
    expect(isReactive(observed.userInfo)).toBe(true);
    expect(isReactive(observed.friends)).toBe(true);
    expect(isReactive(observed.friends[0])).toBe(true);
  });

  it('不完全的响应式对象 shadowReadonly', () => {
    const shadowUser = shadowReadonly({ user: { name: 'pika', age: 18 } });
    expect(isReadonly(shadowUser)).toBe(true);
    expect(isReadonly(shadowUser.user)).toBe(false);
  });
});
