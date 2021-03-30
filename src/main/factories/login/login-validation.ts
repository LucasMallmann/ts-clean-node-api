import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = ['email', 'password'].map(
    field => new RequiredFieldValidation(field)
  )
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
