import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  test('should call ValidationComposite with all validation', () => {
    makeSignUpValidation()
    const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
      .map(field => new RequiredFieldValidation(field))

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
