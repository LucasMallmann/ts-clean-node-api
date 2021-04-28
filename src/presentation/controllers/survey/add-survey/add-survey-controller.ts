import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return await Promise.resolve(null as unknown as HttpResponse)
  }
}
