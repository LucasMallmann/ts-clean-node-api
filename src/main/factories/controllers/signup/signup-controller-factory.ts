import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAddAccount } from '../../usecases/authentication/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'

export const makeSignUpController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const dbAddAccount = makeDbAddAccount()
  const dbAuthentication = makeDbAuthentication()
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
