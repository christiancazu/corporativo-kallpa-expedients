import { IPagination, IPaginationDto } from '@expedients/shared'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto<T> implements IPaginationDto<T> {
	@IsArray()
	readonly data: T[]

	readonly pagination: Pagination

	constructor(data: T[], pagination: Pagination) {
		this.data = data
		this.pagination = pagination
	}
}

export class Pagination implements IPagination {
	readonly page: number

	readonly perPage: number

	readonly totalCount: number

	readonly pageCount: number

	readonly hasPreviousPage: boolean

	readonly hasNextPage: boolean

	constructor({ pageOptionsDto, totalCount }: PaginationDtoParameters) {
		this.page = pageOptionsDto.page!
		this.perPage = pageOptionsDto.perPage!
		this.totalCount = totalCount
		this.pageCount = Math.ceil(this.totalCount / this.perPage)
		this.hasPreviousPage = this.page > 1
		this.hasNextPage = this.page < this.pageCount
	}
}

export interface PaginationDtoParameters {
	pageOptionsDto: PaginationOptionsDto
	totalCount: number
}

export enum PaginationOrder {
	ASC = 'ASC',
	DESC = 'DESC',
}

export class PaginationOptionsDto {
	@IsEnum(PaginationOrder)
	@IsOptional()
	order?: PaginationOrder = PaginationOrder.DESC

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	page?: number = 1

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	perPage?: number = 10

	get skip(): number {
		return (this.page! - 1) * this.perPage!
	}
}
