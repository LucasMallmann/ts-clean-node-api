import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error | void {
    this.validations.forEach(validation => {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    })
  }
}
