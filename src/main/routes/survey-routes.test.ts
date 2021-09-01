import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Survey Routes', () => {
  let surveysCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
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
  })
})
