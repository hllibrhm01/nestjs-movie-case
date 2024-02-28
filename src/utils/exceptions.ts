export class DatabaseElementNotFoundError extends Error {}

export class PropertyNotFoundError extends DatabaseElementNotFoundError {}

export class DocumentNotFoundError extends DatabaseElementNotFoundError {}
