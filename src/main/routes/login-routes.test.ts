import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login Routes', () => {
  let accountsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
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

  describe('POST /login', () => {
    test('should return 200 on login success', async () => {
      const password = await hash('anypassword', 12)
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'anyemail@gmail.com',
        password
      })

      await request(app).post('/api/login').send({
        email: 'anyemail@gmail.com',
        password: 'anypassword'
      }).expect(200)
    })
  })
})
