export class Ok<T, E> {
  value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  static of<T, E>(value: T): Ok<T, E> {
    return new Ok(value);
  }
  
  isOk(): boolean {
    return true;
  }
  
  isErr(): boolean {
    return false;
  }
}

export class Err<T, E> {
  error: E;
  
  constructor(error: E) {
    this.error = error;
  }
  
  static of<T, E>(error: E): Err<T, E> {
    return new Err(error);
  }
  
  isOk(): boolean {
    return false;
  }
  
  isErr(): boolean {
    return true;
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
