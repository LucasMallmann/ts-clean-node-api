import { HttpRequest } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): void | Error {
      return null as unknown as Error
    }
  }

  return new ValidationStub()
}

describe('Add Survey Controller', () => {
  test('should call Validation with correct values', async () => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenLastCalledWith(httpRequest.body)
  })
})
