export const FIELD = {
	USER_EMAIL_MAX_LENGTH: 50,
	USER_PASSWORD_MAX_LENGTH: 25,
	USER_AVATAR_MAX_LENGTH: 40,

	USER_FIRST_NAME_MAX_LENGTH: 50,
	USER_LAST_NAME_MAX_LENGTH: 50,

	EXPEDIENT_CODE_MAX_LENGTH: 100,
	EXPEDIENT_SUBJECT_MAX_LENGTH: 100,
	EXPEDIENT_ENTITY_MAX_LENGTH: 100,
	EXPEDIENT_COURT_MAX_LENGTH: 100,
	EXPEDIENT_STATUS_DESCRIPTION_MAX_LENGTH: 255,

	PROCESS_TYPE_DESCRIPTION_MAX_LENGTH: 50,

	PART_NAME_MAX_LENGTH: 50,

	DOCUMENT_NAME_MAX_LENGTH: 200,
	DOCUMENT_KEY_MAX_LENGTH: 36,
	DOCUMENT_EXTENSION_MAX_LENGTH: 5,

	NOTIFICATION_ENDPOINT_MAX_LENGTH: 255,
	NOTIFICATION_AUTH_MAX_LENGTH: 32,
	NOTIFICATION_P256DH_MAX_LENGTH: 120,
}

export const SETTINGS = {
	FILE_SIZE_LIMIT: 10485760, // 10MB

	UPLOAD_PRESIGNED_URL_EXPIRATION: 120, // 2 min
	GET_PRESIGNED_URL_EXPIRATION: 300, // 5 min

	MESSENGER_SERVICE: 'MESSENGER_SERVICE',
	EVENT_MAIL_ACTIVATE_ACCOUNT: 'EVENT_MAIL_ACTIVATE_ACCOUNT',
	EVENT_SCHEDULED: 'EVENT_SCHEDULED',
	NOTIFICATION_SCHEDULED: 'NOTIFICATION_SCHEDULED',
}

export enum EXPEDIENT_STATUS {
	DEMANDA = 'DEMANDA',
	INADMISIBLE = 'INADMISIBLE',
	AUTO_EMISARIO = 'AUTO EMISARIO',
	CONTESTACION = 'CONTESTACIÓN DE DEMANDA',
	SANEADO = 'SANEADO',
	FIJACION_PUNTOS = 'FIJACIÓN PUNTOS CONTROVERTIDOS',
	SANEAMIENTO = 'SANEAMIENTO PROBATORIO',
	SENTENCIA = 'SENTENCIA',
	APELACION = 'APELACIÓN',
	CASACION = 'CASACIÓN',
	EN_EJECUCION = 'EN EJECUCIÓN',
}

export enum EXPEDIENT_TYPE {
	EMPRESA = 'EMPRESA',
	ASESORIA = 'ASESORIA',
}

export enum PENAL_PART_TYPES {
	DENUNCIANTE = 'DENUNCIANTE',
	DENUNCIADO = 'DENUNCIADO',
}

export enum CIVIL_PART_TYPES {
	DEMANDANTE = 'DEMANDANTE',
	DEMANDADO = 'DEMANDADO',
}

export enum PART_TYPES {
	DENUNCIANTE = 'DENUNCIANTE',
	DENUNCIADO = 'DENUNCIADO',
	DEMANDANTE = 'DEMANDANTE',
	DEMANDADO = 'DEMANDADO',
}

export enum USER_ROLES {
	ADMIN = 'ADMIN',
	ABOGADO = 'ABOGADO',
	PRACTICANTE = 'PRACTICANTE',
}

export interface IUser {
	id: string
	email: string
	firstName: string
	surname: string
	role: USER_ROLES
	avatar?: string
	createdExpedients: IExpedient[]
	updatedExpedients: IExpedient[]
	assignedLawyerExpedients: IExpedient[]
	assignedAssistantExpedients: IExpedient[]
	createdDocuments: IDocument[]
	updatedDocuments: IDocument[]
	events: IEvent[]

	verifiedAt: Date | string
	createdAt: Date | string
}

export interface IExpedient {
	id: string
	code: string
	type: EXPEDIENT_TYPE
	subject: string
	entity: string
	court: string
	processType: IProcessType
	status: EXPEDIENT_STATUS
	statusDescription: string
	assignedLawyer: IUser
	assignedAssistant: IUser
	createdByUser: IUser
	updatedByUser: IUser
	parts: IPart[]
	reviews: IReview[]
	events: IEvent[]
	documents: IDocument[]

	createdAt: Date | string
	updatedAt: Date | string
}

export interface IProcessType {
	id: string
	description: string
}

export interface IPart {
	id: string
	name: string
	type: PART_TYPES
	expedient: IExpedient
}

export interface IReview {
	id: string
	description: string
	expedient?: IExpedient
	createdByUser?: IUser
	createdAt: Date | string
}

export interface IDocument {
	id: string
	name: string
	key: string
	extension: string
	expedient: IExpedient
	createdByUser: IUser
	updatedByUser: IUser
	createdAt: Date | string
	updatedAt: Date | string
}

export interface IEvent {
	id: string
	message: string
	isSent: boolean
	isSeenByLawyer: boolean
	isSeenByAssistant: boolean
	createdAt: Date | string
	createdByUser: IUser
	scheduledAt: Date | string
	expedient: IExpedient
}
