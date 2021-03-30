import { AuthenticationParams } from '../../../domain/usecases/authentication'
import { AccountModel } from '../../usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail: (authParams: AuthenticationParams) => Promise<AccountModel | null>
}
