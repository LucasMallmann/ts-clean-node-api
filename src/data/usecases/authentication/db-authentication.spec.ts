import { AuthenticationParams } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication.'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async auth (authParams: AuthenticationParams): Promise<AccountModel> {
      const account = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'email@email.com',
    password: 'hashed_password'
  }
}

const makeFakeAuthenticationParams = (): AuthenticationParams => ({
  email: 'email@email.com',
  password: 'password'
})

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new TokenGeneratorStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('Db Authentication UseCase', () => {
  test('should call Load AccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'auth')
    await sut.auth(authenticationModel)
    expect(loadSpy).toHaveBeenLastCalledWith(authenticationModel)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const authPromise = sut.auth(authenticationModel)
    await expect(authPromise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const accessToken = await sut.auth(authenticationModel)
    expect(accessToken).toBeNull()
  })

  test('should call HashCompare with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(authenticationModel)
    expect(compareSpy).toHaveBeenCalledWith('password', 'hashed_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const authPromise = sut.auth(authenticationModel)
    await expect(authPromise).rejects.toThrow()
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )
    const accessToken = await sut.auth(authenticationModel)
    expect(accessToken).toBeNull()
  })

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(authenticationModel)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const authPromise = sut.auth(authenticationModel)
    await expect(authPromise).rejects.toThrow()
  })

  test('should return an access token on success', async () => {
    const { sut } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const accessToken = await sut.auth(authenticationModel)
    expect(accessToken).toBe('any_token')
  })
})
