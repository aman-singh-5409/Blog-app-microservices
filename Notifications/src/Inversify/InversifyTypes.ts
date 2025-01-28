export const INVERSIFY_TYPES = {
  // Services
  EmailService: Symbol.for("EmailService"),

  // Repositories
  MailRespository: Symbol.for('MailRespository'),

  // Controllers
  Controller: Symbol.for("Controller"),

  // Middleware
  ErrorMiddleware: Symbol.for("ErrorMiddleware"),

  // Logger
  Logger: Symbol.for("WinstonLogger"),

  // Server
  Server: Symbol.for("Server"),
};
