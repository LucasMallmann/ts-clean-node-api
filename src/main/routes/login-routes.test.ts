import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on signup success', async () => {
      await request(app).post('/api/signup').send({
        name: 'any_name',
        email: 'anyemail@gmail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }).expect(200)
    })
  })
})
