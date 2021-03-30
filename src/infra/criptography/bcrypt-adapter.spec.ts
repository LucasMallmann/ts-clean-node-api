import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const DEFAULT_SAULT = 12

let sut: BcryptAdapter

describe('Bcrypt Adapter', () => {
  beforeEach(() => {
    sut = new BcryptAdapter(DEFAULT_SAULT)
  })

  test('should call bcrypt hash with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', DEFAULT_SAULT)
  })

  test('should call compare with correct values', async () => {
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('should return a valid hash on hash success', async () => {
    const hashedValue = await sut.hash('any_value')
    expect(hashedValue).toBe('hashed_value')
  })

  test('should throw an exception if Bcrypt hash throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const hashPromise = sut.hash('any_value')
    await expect(hashPromise).rejects.toThrow()
  })
})
