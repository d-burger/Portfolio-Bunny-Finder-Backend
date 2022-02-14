class ErrorResponse extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
  }
}

export default ErrorResponse;

// Example: throw new Error(`User with id of ${id} doesn't exist`)
// here constructor only takes one parameter: the message
// super keyword  is used to call the constructor of its parent class to
// access the parent's properties and methods. Here we pass message
// to parent class (Error) and create object property statusCode
