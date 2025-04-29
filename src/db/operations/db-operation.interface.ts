export interface DbOperation<I, O> {
    execute(input: I): Promise<O>;
}

export const defaultPageSize = 500;

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
