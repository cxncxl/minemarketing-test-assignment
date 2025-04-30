export interface DbOperation<I, O> {
    execute(input: I): Promise<O>;
}

export class InvalidInputError extends Error{}
export class DuplicateValueError extends Error {
    constructor(
        public readonly duplicateId: any,
    ) {
        super();
    }

    override toString() {
        return `Duplicate exists in the db: ${this.duplicateId}`;
    }
}
export class InvalidRelationError extends Error{}
export class UnknownEntityError extends Error{}
