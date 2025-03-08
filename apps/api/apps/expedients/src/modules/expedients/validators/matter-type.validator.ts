import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator'
import { MatterType } from '../modules/matter-types/entities/matter-types.entity'
import { MatterTypesService } from '../modules/matter-types/matter-types.service'

type ConstrainField = 'id' | 'description'

@ValidatorConstraint({ name: 'MatterTypeValidator', async: true })
@Injectable()
export class MatterTypeValidator
	implements OnApplicationBootstrap, ValidatorConstraintInterface
{
	private _matterTypes: MatterType[]

	constructor(
		@Inject(MatterTypesService)
		private readonly _matterTypeService: MatterTypesService,
	) {}

	async onApplicationBootstrap() {
		this._matterTypes = await this._matterTypeService.findAll()
	}

	validate(value: string, args: ValidationArguments): boolean {
		const [validateBy] = args.constraints as [ConstrainField]

		return this._matterTypes.some((mt) => mt[validateBy] === value)
	}

	defaultMessage(args: ValidationArguments): string {
		return `The field ${args.property} is not valid`
	}
}

export const ValidateMatterType = (validateBy: ConstrainField) => {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			target: (object as Record<string, any>).constructor,
			propertyName: propertyName,
			constraints: [validateBy],
			validator: MatterTypeValidator,
		})
	}
}
