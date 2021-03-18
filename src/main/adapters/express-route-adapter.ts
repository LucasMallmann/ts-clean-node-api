import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

// Decouple express from controllers
export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest)
    response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
