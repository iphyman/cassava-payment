export abstract class ErrorResult extends Error {
  public constructor(public code: number | string, public message: string) {
    super(message);
  }
}

export class BadRequestResult extends ErrorResult {}

export class ConfigurationErrorResult extends ErrorResult {}

export class ForbiddenResult extends ErrorResult {}

export class InternalServerErrorResult extends ErrorResult {}

export class NotFoundResult extends ErrorResult {}
