import { Authentication, AuthenticationParams } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByRepository = loadAccountByRepository
    this.hashComparer = hashComparer
  }

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByRepository.auth(authenticationParams)

    if (account) {
      await this.hashComparer.compare(authenticationParams.password, account.password)
    }

    return null
  }
}
