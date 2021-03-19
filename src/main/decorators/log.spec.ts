import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {}
      }

      return await new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut, controllerStub
  }
}

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()

    const controllerHandleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    await sut.handle(httpRequest)
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
