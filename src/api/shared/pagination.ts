import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
    constructor(
        public readonly page?: number,
        public readonly limit?: number,
    ) {
        if (!page) this.page = 0;
        if (!limit) this.limit = PaginationUtils.defaultPageSize;
    }

    public get skip() {
        return this.page * this.limit;
    }
}

export class PaginationResponse {
    @ApiProperty()
    nextPage?: number
}

export class PaginationUtils {
    public static readonly defaultPageSize = 500;

    public static next(
        prev: Pagination,
        took: number,
    ): PaginationResponse {
        if (took == 0) {
            return {
                nextPage: prev.page ?? 0,
            };
        }

        return {
            nextPage: took >= prev.limit ? prev.page + 1 : undefined,
        };
    }
}
