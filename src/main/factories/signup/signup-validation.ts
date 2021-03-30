import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
  Validation
} from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation'].map(
    field => new RequiredFieldValidation(field)
  )
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
