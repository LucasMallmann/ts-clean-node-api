import { LoadAccountByToken } from '../../../../domain/usecases/load-account-by-token'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { DbLoadAccountByToken } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import env from '../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbLoadAccountByToken = new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
  return dbLoadAccountByToken
}
