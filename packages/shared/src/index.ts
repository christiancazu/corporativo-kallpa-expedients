export const FIELD = {
	USER_EMAIL_MAX_LENGTH: 50,
	USER_PASSWORD_MAX_LENGTH: 25,
	USER_AVATAR_MAX_LENGTH: 40,

	USER_FIRST_NAME_MAX_LENGTH: 50,
	USER_LAST_NAME_MAX_LENGTH: 50,

	EXPEDIENT_CODE_MAX_LENGTH: 100,
	EXPEDIENT_PROCEDURE_MAX_LENGTH: 100,
	EXPEDIENT_ENTITY_MAX_LENGTH: 100,
	EXPEDIENT_COURT_MAX_LENGTH: 100,
	EXPEDIENT_STATUS_DESCRIPTION_MAX_LENGTH: 50,

	EXPEDIENT_STATUS_MAX_LENGTH: 50,
	PROCESS_TYPE_MAX_LENGTH: 50,
	MATTER_TYPE_MAX_LENGTH: 50,
	MATTER_TYPE_COLOR_MAX_LENGTH: 10,

	PART_NAME_MAX_LENGTH: 50,
	PART_TYPE_DESCRIPTION_MAX_LENGTH: 50,

	DOCUMENT_NAME_MAX_LENGTH: 200,
	DOCUMENT_KEY_MAX_LENGTH: 36,
	DOCUMENT_EXTENSION_MAX_LENGTH: 5,

	NOTIFICATION_ENDPOINT_MAX_LENGTH: 255,
	NOTIFICATION_AUTH_MAX_LENGTH: 32,
	NOTIFICATION_P256DH_MAX_LENGTH: 120,

	UUID_MAX_LENGTH: 36,
}

export const SETTINGS = {
	FILE_SIZE_LIMIT: 52428800, // 50MB

	UPLOAD_PRESIGNED_URL_EXPIRATION: 120, // 2 min
	GET_PRESIGNED_URL_EXPIRATION: 300, // 5 min

	MESSENGER_SERVICE: 'MESSENGER_SERVICE',
	EVENT_MAIL_ACTIVATE_ACCOUNT: 'EVENT_MAIL_ACTIVATE_ACCOUNT',
	EVENT_SCHEDULED: 'EVENT_SCHEDULED',
	NOTIFICATION_SCHEDULED: 'NOTIFICATION_SCHEDULED',
}

export enum EXPEDIENT_TYPE {
	CONSULTANCY = 'Asesoría',
	JUDICIAL_PROCESSES = 'Procesos judiciales',
	INVESTIGATION_PROCESSES = 'Procesos de investigación',
}

export const EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT = {
	Asesoría: 'asesoria',
	'Procesos judiciales': 'procesos-judiciales',
	'Procesos de investigación': 'procesos-de-investigacion',
}

export type TYPE_EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT =
	keyof typeof EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT

export const EXPEDIENT_TYPE_FRONTEND_TO_BACKEND_ENDPOINT = {
	asesoria: 'consultancy',
	'procesos-judiciales': 'judicial-processes',
	'procesos-de-investigacion': 'investigation-processes',
}

export const FRONTEND_ROUTES_AS_EXPEDIENT_TYPE_NAME = {
	asesoria: EXPEDIENT_TYPE.CONSULTANCY,
	'procesos-judiciales': EXPEDIENT_TYPE.JUDICIAL_PROCESSES,
	'procesos-de-investigacion': EXPEDIENT_TYPE.INVESTIGATION_PROCESSES,
}

export const EXPEDIENT_TYPE_CODE_NAME = {
	asesoria: 'Empresa',
	'procesos-judiciales': 'Carpeta fiscal',
	'procesos-de-investigacion': 'Expediente',
}

export const EXPEDIENT_TYPE_NAME_SINGULAR = {
	asesoria: 'asesoría',
	'procesos-judiciales': 'proceso judicial',
	'procesos-de-investigacion': 'proceso de investigación',
}

export const EXPEDIENT_TYPE_COURT_NAME = {
	asesoria: '',
	'procesos-judiciales': 'Fiscalia',
	'procesos-de-investigacion': 'Juzgado',
}

export type TYPE_EXPEDIENT_FRONTEND_ROUTES =
	keyof typeof FRONTEND_ROUTES_AS_EXPEDIENT_TYPE_NAME

export enum USER_ROLES {
	ADMIN = 'ADMIN',
	ABOGADO = 'ABOGADO',
	PRACTICANTE = 'PRACTICANTE',
}

export enum JUDICIAL_PROCESSES_INSTANCES {
	FIRST_INSTANCE = 'Primera Instancia',
	SECOND_INSTANCE = 'Segunda Instancia',
	RATING = 'Tasación',
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
	code: string // [ASESORIA] -> EMPRESA | [PROCESOS JUDICIALES] Expediente | [PROCESOS DE INVESTIGACION] CARPETA FISCAL
	type: EXPEDIENT_TYPE
	procedure: string | null // [ASESORIA] -> trámite/consulta
	entity: string | null // [ASESORIA]
	court: string | null // [PROCESOS JUDICIALES] corte | [PROCESOS DE INVESTIGACION] fiscalía
	processType: IProcessType
	matterType: IMatterType
	status: IExpedientStatus
	statusDescription: string | null
	instance: JUDICIAL_PROCESSES_INSTANCES
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

export interface IExpedientStatus {
	id: string
	description: string
}

export interface IProcessType {
	id: string
	description: string
}

export interface IMatterType {
	id: string
	description: string
	color: string
}

export interface IPart {
	id: string
	name: string
	type: IPartType
	typeDescription: string | null
}

export interface IPartType {
	id: string
	description: string
	expedientType: EXPEDIENT_TYPE[]
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

export interface IFindExpedientDto {
	text?: string | null
	updatedByUser?: string | null
	matterType?: string | null
	status?: string | null
}

export interface ICreateExpedientDto {
	code?: string
	procedure?: string
	entity?: string
	court?: string
	processTypeId?: string
	matterTypeId?: string
	statusId?: string
	statusDescription?: string
	instance?: JUDICIAL_PROCESSES_INSTANCES
	assignedLawyerId?: string
	assignedAssistantId?: string
	parts?: IUpdatePartDto[]
}

export interface ICreatePartDto {
	name: string
	typeDescription: string
	typeId: string
}

export interface IUpdatePartDto extends ICreatePartDto {
	id?: string
}
