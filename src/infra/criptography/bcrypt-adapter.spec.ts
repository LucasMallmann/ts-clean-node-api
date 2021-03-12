import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

const DEFAULT_SAULT = 12

let sut: BcryptAdapter

describe('Bcrypt Adapter', () => {
  beforeEach(() => {
    sut = new BcryptAdapter(DEFAULT_SAULT)
  })

  test('should call bcrypt with correct values', async () => {
    // const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', DEFAULT_SAULT)
  })

  test('should return hashed value on success', async () => {
    // const sut = makeSut()

    const hashedValue = await sut.encrypt('any_value')

    expect(hashedValue).toBe('hashed_value')
  })

  test('should throw an exception if Bcrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const hashPromise = sut.encrypt('any_value')
    await expect(hashPromise).rejects.toThrow()
  })
})
