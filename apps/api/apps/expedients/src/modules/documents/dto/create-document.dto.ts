import type { IDocument } from '@expedients/shared'
import { IsOptional, IsUUID } from 'class-validator'

export class CreateDocumentDto implements Partial<IDocument> {
	@IsUUID()
	expedientId: string

	@IsOptional()
	name: string
}
