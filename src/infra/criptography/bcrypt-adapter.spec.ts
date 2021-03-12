import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const DEFAULT_SAULT = 12

const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(DEFAULT_SAULT)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', DEFAULT_SAULT)
  })
})
