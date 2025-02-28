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

@ValidatorConstraint({ name: 'UsuarioGrupoNombre', async: true })
@Injectable()
export class UsuarioGrupoNombre
	implements ValidatorConstraintInterface, NestInterceptor
{
	constructor(private readonly als: AlsService) {}

	validate(value: number, args: ValidationArguments): boolean {
		if (this.als.get(REQUEST_EXPEDIENT_TYPE) === EXPEDIENT_TYPE.EMPRESA) {
			return !!(args.object as CreateExpedientDto).processTypeId
		}

		if (this.als.get(REQUEST_EXPEDIENT_TYPE) === EXPEDIENT_TYPE.ASESORIA) {
			return !!(args.object as CreateExpedientDto).entity
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
			context.switchToHttp().getRequest().headers[REQUEST_EXPEDIENT_TYPE],
		)

		return new Observable((subscriber) => {
			this.als.run(() => {
				return next.handle().subscribe(subscriber)
			}, store)
		})
	}

	defaultMessage(args: ValidationArguments): string {
		if (this.als.get(REQUEST_EXPEDIENT_TYPE) === EXPEDIENT_TYPE.EMPRESA)
			return 'The field processTypeId is required'

		return 'The field entity is required'
	}
}

export const EsUsuarioGrupoNombre = (validationOptions?: ValidationOptions) => {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			target: object!.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: UsuarioGrupoNombre,
		})
	}
}
