import { Authentication, AuthenticationParams } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {
  }

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByRepository.auth(authenticationParams)

    if (account) {
      const isPasswordValid = await this.hashComparer.compare(authenticationParams.password, account.password)
      if (isPasswordValid) {
        const accessToken = await this.tokenGenerator.generate(account?.id)
        return accessToken
      }
    }

    return null
  }
}
