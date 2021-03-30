import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {
  test('should return an InvalidParamError if validation fails', async () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'stuff',
      fieldToCompare: 'different stuff'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return if validation succeeds', async () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'stuff',
      fieldToCompare: 'stuff'
    })
    expect(error).toBeFalsy()
  })
})
