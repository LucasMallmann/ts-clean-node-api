import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = ['question', 'answers'].map(field => new RequiredFieldValidation(field))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
