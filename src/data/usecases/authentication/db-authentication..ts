import { Authentication, AuthenticationParams } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByRepository: LoadAccountByEmailRepository

  constructor (loadAccountByRepository: LoadAccountByEmailRepository) {
    this.loadAccountByRepository = loadAccountByRepository
  }

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    await this.loadAccountByRepository.auth(authenticationParams)
    return 'token'
  }
}
