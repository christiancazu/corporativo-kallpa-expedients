import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator'
import { ExpedientStatus } from '../modules/expedient-status/entities/expedient-status.entity'
import { ExpedientStatusService } from '../modules/expedient-status/expedient-status.service'

type ConstrainField = 'id' | 'description'

@ValidatorConstraint({ name: 'ExpedientStatusValidator', async: true })
@Injectable()
export class ExpedientStatusValidator
	implements OnApplicationBootstrap, ValidatorConstraintInterface
{
	private _expedientsStatus: ExpedientStatus[]

	constructor(
		@Inject(ExpedientStatusService)
		private readonly _expedientStatusService: ExpedientStatusService,
	) {}

	async onApplicationBootstrap() {
		this._expedientsStatus = await this._expedientStatusService.findAll()
	}

	validate(value: string, args: ValidationArguments): boolean {
		const [validateBy] = args.constraints as [ConstrainField]

		return this._expedientsStatus.some((es) => es[validateBy] === value)
	}

	defaultMessage(args: ValidationArguments): string {
		return `The field ${args.property} is not valid`
	}
}

export const ValidateExpedientStatus = (validateBy: ConstrainField) => {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			target: (object as Record<string, any>).constructor,
			propertyName: propertyName,
			constraints: [validateBy],
			validator: ExpedientStatusValidator,
		})
	}
}
