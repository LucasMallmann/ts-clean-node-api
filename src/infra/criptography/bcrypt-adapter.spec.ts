import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

const DEFAULT_SAULT = 12

const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(DEFAULT_SAULT)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', DEFAULT_SAULT)
  })

  test('should return hashed value on success', async () => {
    const sut = makeSut()

    const hashedValue = await sut.encrypt('any_value')

    expect(hashedValue).toBe('hashed_value')
  })
})
