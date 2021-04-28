import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite
} from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

jest.mock('../../../../validation/validators/validation-composite')

describe('Login Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = ['email', 'password']
      .map(field => new RequiredFieldValidation(field))

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
