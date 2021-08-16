import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decryptStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decryptStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decryptStub)
  return {
    sut,
    decryptStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decryptStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if Decrypter returns null', async () => {
    const { sut, decryptStub } = makeSut()
    jest.spyOn(decryptStub, 'decrypt').mockReturnValueOnce(await Promise.resolve(null))
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })
})
