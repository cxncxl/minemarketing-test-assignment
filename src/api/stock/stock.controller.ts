import {
    Controller,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Query
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { StockService } from './stock.service';
import { GetStockUpdatesDto, GetStockUpdatesResponse } from './stock.dto';
import { Logger } from 'src/shared/logger/logger';
import { InvalidRelationError } from 'src/db/operations/db-operation.interface';

@Controller('stock')
export class StockController {
    constructor(
        private readonly service: StockService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get history of stock updates',
    })
    @ApiResponse({
        status: '2XX',
        type: GetStockUpdatesResponse,
    })
    async getStockUpdates(
        @Query() query: GetStockUpdatesDto,
    ): Promise<GetStockUpdatesResponse> {
        try {
            return await this.service.getStockUpdateLogs(
                query.categoryId,
                query.date ? new Date(query.date) : undefined,
                query.hour,
                query.page,
                query.limit,
            );
        } catch (e) {
            Logger.error(e);

            if (e instanceof InvalidRelationError) {
                throw new HttpException({
                    error: 'unknown category id',
                }, HttpStatus.BAD_REQUEST);
            }

            throw new InternalServerErrorException();
        }
    }
}
