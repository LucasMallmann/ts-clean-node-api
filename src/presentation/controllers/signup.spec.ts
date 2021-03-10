import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // sut = System Under Test
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        // name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})
