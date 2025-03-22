import { EXPEDIENT_TYPE } from '@expedients/shared'
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	isNotEmpty,
	registerDecorator,
} from 'class-validator'
import { Observable } from 'rxjs'
import { AlsService } from '../../global/als/als.service'
import { REQUEST_EXPEDIENT_TYPE } from '../decorators/set-expedient-type.decorator'
import { CreateExpedientDto } from '../dto/create-expedient.dto'

@ValidatorConstraint({ name: 'ExpedientTypeValidator', async: true })
@Injectable()
export class ExpedientTypeValidator
	implements ValidatorConstraintInterface, NestInterceptor
{
	constructor(private readonly _alsService: AlsService) {}

	validate(_value: any, args: ValidationArguments): boolean {
		const { entity, procedure, processTypeId, court, instance } =
			args.object as CreateExpedientDto

		const currentExpedientType = this._alsService.get(REQUEST_EXPEDIENT_TYPE)

		if (currentExpedientType === EXPEDIENT_TYPE.CONSULTANCY) {
			return isNotEmpty(procedure) && isNotEmpty(entity)
		}

		if (currentExpedientType === EXPEDIENT_TYPE.JUDICIAL_PROCESSES) {
			return (
				isNotEmpty(processTypeId) && isNotEmpty(court) && isNotEmpty(instance)
			)
		}

		if (currentExpedientType === EXPEDIENT_TYPE.INVESTIGATION_PROCESSES) {
			return isNotEmpty(processTypeId) && isNotEmpty(court)
		}

		return true
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const store = new Map<string, any>()

		store.set(
			REQUEST_EXPEDIENT_TYPE,
			Reflect.getMetadata(REQUEST_EXPEDIENT_TYPE, context.getClass()),
		)

		return new Observable((subscriber) => {
			this._alsService.run(() => next.handle().subscribe(subscriber), store)
		})
	}

	defaultMessage(_args: ValidationArguments): string {
		return `fields for ${this._alsService.get(REQUEST_EXPEDIENT_TYPE)} are required`
	}
}

export const ValidateExpedientType = (
	validationOptions?: ValidationOptions,
) => {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			target: object!.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: ExpedientTypeValidator,
		})
	}
}
