import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('jwt_value'))
  }
}))

const SECRET_KEY = 'secret'

describe('Jwt Adapter', () => {
  test('should call jsonwebtoken sign with correct values', async () => {
    const sut = new JwtAdapter(SECRET_KEY)
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET_KEY)
  })

  test('should return a token on sign success', async () => {
    const sut = new JwtAdapter(SECRET_KEY)
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('jwt_value')
  })

  test('should throw if jsonwebtoken throws', async () => {
    const sut = new JwtAdapter(SECRET_KEY)
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const accessTokenPromise = sut.encrypt('any_id')
    await expect(accessTokenPromise).rejects.toThrow()
  })
})
