import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = {name: 'pika', age: 18}
    const observed = readonly(original)
    expect(observed).not.toBe(original) // 响应式对象和原始对象不是同一个对象
    expect(observed.age).toBe(18)
    observed.age = 20
    expect(observed.age).toBe(18)
  })
})