import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidation } from './signup-validation'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'

export const makeSignUpController = (): Controller => {
  const salt = 12
  // Build dependencies
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
