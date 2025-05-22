export abstract class Result<T, E> {
  abstract isOk(): this is Ok<T, E>;
  abstract isErr(): this is Err<T, E>;
  abstract value: T;
  abstract error: E;
}

export class Ok<T, E> extends Result<T, E> {
  constructor(public value: T) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  get error(): E {
    throw new Error("Cannot get error from Ok");
  }

  static of<T, E>(value: T): Ok<T, E> {
    return new Ok(value);
  }
}

export class Err<T, E> extends Result<T, E> {
  constructor(public error: E) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  get value(): T {
    throw new Error("Cannot get value from Err");
  }

  static of<T, E>(error: E): Err<T, E> {
    return new Err(error);
  }
}
