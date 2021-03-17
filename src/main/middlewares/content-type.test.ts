import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test-content-type-json', (_, response) => {
      return response.send('')
    })

    await request(app).get('/test-content-type-json').expect('content-type', /json/)
  })

  test('should return XML content type when forced', async () => {
    app.get('/test-content-type-xml', (_, response) => {
      response.type('xml')
      return response.send('')
    })

    await request(app).get('/test-content-type-xml').expect('content-type', /xml/)
  })
})
