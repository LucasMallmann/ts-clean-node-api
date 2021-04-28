import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', async () => {
    const sut = makeSut()
    const error = sut.validate({ anyField: '' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return if validation succeeds', async () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'value' })
    expect(error).toBeFalsy()
  })
})
