import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations = ['name', 'email', 'password', 'passwordConfirmation'].map(
    field => new RequiredFieldValidation(field)
  )

  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
