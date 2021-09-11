import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import Mockdate from 'mockdate'
import { SurveyModel } from '../../../../domain/models/survey'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

type FakeSurvey = Omit<SurveyModel, 'id'>

const makeFakeSurveys = (): FakeSurvey[] => {
  return [
    {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    },
    {
      question: 'other_question_2',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }
  ]
}

describe('Survey Mongo Repository', () => {
  let surveysCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
    Mockdate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    Mockdate.reset()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should create a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer_1',
            image: 'any_image'
          },
          {
            answer: 'any_answer_2'
          }
        ],
        date: new Date()
      })
      const survey = await surveysCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll', () => {
    test('should return surveys on success', async () => {
      const sut = makeSut()
      await surveysCollection.insertMany(makeFakeSurveys())
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question_2')
    })

    test('should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
