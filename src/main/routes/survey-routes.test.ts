import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import { sign } from 'jsonwebtoken'

describe('Survey Routes', () => {
  let surveysCollection: Collection
  let accountsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await surveysCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 403 on add survey success', async () => {
      await request(app).post('/api/surveys').send({
        question: 'question',
        answers: [
          {
            answer: 'answer_1',
            image: 'http://image-name.com'
          },
          {
            answer: 'answer_2'
          }
        ]
      }).expect(403)
    })

    test('should return 204 on add survey with valid token', async () => {
      const res = await accountsCollection.insertOne({
        name: 'any_name',
        email: 'anyemail@gmail.com',
        password: 'any_password',
        role: 'admin'
      })

      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)

      await accountsCollection.updateOne({ _id: id }, {
        $set: {
          accessToken
        }
      })

      await request(app)
        .post('/api/surveys').set({
          'x-access-token': accessToken
        })
        .send({
          question: 'question',
          answers: [
            {
              answer: 'answer_1',
              image: 'http://image-name.com'
            },
            {
              answer: 'answer_2'
            }
          ]
        }).expect(204)
    })
  })
})
