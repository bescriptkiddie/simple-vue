import { effect } from '../effect'
import { ref } from '../ref'

describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it('ref 是一个响应式对象', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      console.log('a.value', a.value)
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    // 赋一个重复值，不会触发effect
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })
})
