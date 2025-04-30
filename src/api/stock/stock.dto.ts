import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { PaginationResponse } from '../shared/pagination';

export class GetStockUpdatesDto {
    @ApiProperty({ required: false })
    @MaxLength(10)
    @IsDateString()
    @IsOptional()
    date?: string

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(24)
    @Type(() => Number)
    hour?: number

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    categoryId?: string

    @ApiProperty({ required: false })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number

    @ApiProperty({ required: false })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number
}

export class GetStockUpdatesResponse {
    /**
     * Map category id => StockUpdate
     */
    @ApiProperty({ required: false })
    updates: Record<string, StockUpdate>

    @ApiProperty({ required: false })
    pagination: PaginationResponse
}

export class StockUpdate {
    @ApiProperty()
    totalUpdates: number

    @ApiProperty()
    updatesHistory: StockUpdateEvent[]
}

export class StockUpdateEvent {
    @ApiProperty()
    from: number

    @ApiProperty()
    to: number

    @ApiProperty()
    at: Date

    @ApiProperty()
    productId: string
}
