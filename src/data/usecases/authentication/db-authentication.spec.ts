import { DbAuthentication } from './db-authentication'
import {
  AuthenticationParams,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { AccountModel } from '../add-account/db-add-account-protocols'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

const makeAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('Db Authentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(authenticationModel)
    expect(loadSpy).toHaveBeenLastCalledWith(authenticationModel.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const authPromise = sut.auth(authenticationModel)
    await expect(authPromise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
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

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(authenticationModel)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
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

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(authenticationModel)
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const authenticationModel = makeFakeAuthenticationParams()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const authPromise = sut.auth(authenticationModel)
    await expect(authPromise).rejects.toThrow()
  })
})
