import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return account
  }
}
