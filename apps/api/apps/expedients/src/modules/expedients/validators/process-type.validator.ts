import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator'
import { ProcessType } from '../modules/process-types/entities/process-types.entity'
import { ProcessTypesService } from '../modules/process-types/process-types.service'

@ValidatorConstraint({ name: 'ProcessTypeValidator', async: true })
@Injectable()
export class ProcessTypeValidator
	implements OnApplicationBootstrap, ValidatorConstraintInterface
{
	private _processType: ProcessType[]

	constructor(
		@Inject(ProcessTypesService)
		private readonly _matterTypeService: ProcessTypesService,
	) {}

	async onApplicationBootstrap() {
		this._processType = await this._matterTypeService.cacheFindAll()
	}

	validate(value: string, args: ValidationArguments): boolean {
		return this._processType.some((mt) => mt.id === value)
	}

	defaultMessage(args: ValidationArguments): string {
		return `The field ${args.property} is not valid`
	}
}

export const ValidateProcessType = () => {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			target: (object as Record<string, any>).constructor,
			propertyName: propertyName,
			constraints: [],
			validator: ProcessTypeValidator,
		})
	}
}
