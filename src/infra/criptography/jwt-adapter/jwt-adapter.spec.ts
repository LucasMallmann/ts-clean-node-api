import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('jwt_value'))
  },

  async verify (token: string): Promise<string> {
    return await Promise.resolve('any_value')
  }
}))

const SECRET_KEY = 'secret'

let sut: JwtAdapter

describe('Jwt Adapter', () => {
  beforeEach(() => {
    sut = new JwtAdapter(SECRET_KEY)
  })

  describe('signin()', () => {
    test('should call jsonwebtoken sign with correct values', async () => {
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET_KEY)
    })

    test('should return a token on sign success', async () => {
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('jwt_value')
    })

    test('should throw if jsonwebtoken throws', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessTokenPromise = sut.encrypt('any_id')
      await expect(accessTokenPromise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', SECRET_KEY)
    })

    test('should return a value on verify success', async () => {
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
  })
})
