import reactive, { readonly, isReadonly, isReactive } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = {name: 'pika', age: 18}
    const observed = readonly(original)
    const observed2 = reactive(original)
    expect(observed).not.toBe(original) // 响应式对象和原始对象不是同一个对象
    expect(observed.age).toBe(18)
    observed.age = 20
    expect(observed.age).toBe(18)
    expect(isReactive(observed)).toBe(false)
    expect(isReadonly(observed)).toBe(true)
    expect(isReactive(observed2)).toBe(true)
    expect(isReadonly({})).toBe(false) // 测试为空对象的情况
  })

  it('warn when call set', () => {
    const user = readonly({name: 'pika', age: 18})
    console.warn = jest.fn()
    user.age = 20
    expect(console.warn).toBeCalled()
  })
})