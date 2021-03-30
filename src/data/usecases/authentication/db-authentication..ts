import {
  Authentication,
  AuthenticationParams,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
  }

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByRepository.auth(authenticationParams)

    if (account) {
      const isPasswordValid = await this.hashComparer.compare(authenticationParams.password, account.password)
      if (isPasswordValid) {
        const accessToken = await this.encrypter.encrypt(account?.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }

    return null
  }
}
