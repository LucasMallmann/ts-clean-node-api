import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('should return an account on success', async () => {
    await request(app).post('/api/signup').send({
      name: 'any_name',
      email: 'anyemail@gmail.com',
      password: 'anypassword',
      passwordConfirmation: 'anypassword'
    }).expect(200)
  })
})
