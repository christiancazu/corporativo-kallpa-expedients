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
	registerDecorator,
} from 'class-validator'
import { Observable } from 'rxjs'
import { AlsService } from '../../global/als/als.service'
import { CreateExpedientDto } from '../dto/create-expedient.dto'
import { REQUEST_EXPEDIENT_TYPE } from '../guards/expedient-type.guard'

@ValidatorConstraint({ name: 'ExpedientTypeValidator', async: true })
@Injectable()
export class ExpedientTypeValidator
	implements ValidatorConstraintInterface, NestInterceptor
{
	constructor(private readonly als: AlsService) {}

	validate(_value: any, args: ValidationArguments): boolean {
		const { entity, procedure, processTypeId, court, instance } =
			args.object as CreateExpedientDto

		if (this.als.get(REQUEST_EXPEDIENT_TYPE) === EXPEDIENT_TYPE.CONSULTANCY) {
			return !!(entity && procedure)
		}

		if (
			this.als.get(REQUEST_EXPEDIENT_TYPE) === EXPEDIENT_TYPE.JUDICIAL_PROCESSES
		) {
			return !!(processTypeId && court && instance)
		}

		return !!(processTypeId && court)
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const store = new Map<string, any>()

		store.set(
			REQUEST_EXPEDIENT_TYPE,
			context.switchToHttp().getRequest().headers[REQUEST_EXPEDIENT_TYPE],
		)

		return new Observable((subscriber) => {
			this.als.run(() => {
				return next.handle().subscribe(subscriber)
			}, store)
		})
	}

	defaultMessage(_args: ValidationArguments): string {
		return `fields for ${this.als.get(REQUEST_EXPEDIENT_TYPE)} are required`
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
