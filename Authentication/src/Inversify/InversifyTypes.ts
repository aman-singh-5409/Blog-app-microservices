export const INVERSIFY_TYPES = {
  //Middlewares
  ErrorMiddleware: Symbol.for('ErrorMiddleware'),
  
  //Datastores
  UserDatastore: Symbol.for('UserDatastore'),

  //Repository
  AuthRepository: Symbol.for('AuthRepository'),

  //Controllers
  Controller: Symbol.for('AuthController'),

  //Database
  DatabaseConnection: Symbol.for('DatabaseConnection'),

  //Logging
  Logger: Symbol.for("Logger"),

  //Server
  Server: Symbol.for("Server"),
};
