import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should parse body as jsonw', async () => {
    app.post('/test_body_parser', (request, response) => {
      return response.send(request.body)
    })

    await request(app).post('/test_body_parser')
      .send({ name: 'Lucas' })
      .expect({ name: 'Lucas' })
  })
})
