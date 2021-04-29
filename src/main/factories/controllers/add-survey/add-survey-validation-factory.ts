import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = ['question', 'answers'].map(
    field => new RequiredFieldValidation(field)
  )
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
