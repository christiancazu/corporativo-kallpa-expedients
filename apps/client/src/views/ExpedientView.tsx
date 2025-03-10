import { useMutation, useQuery } from '@tanstack/react-query'
import htmlReactParser from 'html-react-parser'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	NotificationOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Flex,
	Row,
	Space,
	Spin,
	Tag,
	Tooltip,
	Typography,
	theme,
} from 'antd'

import DocumentUpload from '../components/DocumentUpload'
import NavigationBackBtn from '../components/NavigationBackBtn'
import DocumentDetail from '../components/document/DocumentDetail'
import TextEditor from '../components/text-editor/TextEditor'
import { useConfirmModal } from '../hooks/useConfirmModal'

import {
	type IDocument as DocumentType,
	EXPEDIENT_TYPE,
	EXPEDIENT_TYPE_COURT_NAME,
	type IExpedient as ExpedientType,
	type IEvent,
} from '@expedients/shared'
import Title from 'antd/es/typography/Title'
import { AxiosError, HttpStatusCode } from 'axios'
import PopconfirmDelete from '../components/PopconfirmDelete'
import ScheduleEvent, {
	type ScheduleEventProps,
} from '../components/ScheduleEvent'
import { StyledScrollbar } from '../components/StyledScrollbar'
import {
	StyledCardNotification,
	StyledCardNotificationText,
} from '../components/header/styled'
import { queryClient } from '../config/queryClient'
import { useExpedientsState } from '../hooks/useExpedientsState'
import useNotify from '../hooks/useNotification'
import useUserState from '../hooks/useUserState'
import UserAvatarName from '../modules/shared/components/UserAvatarName'
import { deleteEvent, deleteExpedientReview } from '../services/api.service'
import { useExpedientsService } from '../services/expedients.service'
import { dateUtil, getSpritePositionX } from '../utils'

const { Text } = Typography

const dom = document
let mentions: HTMLElement[] | Element[] = []

export interface DocumentFile extends Partial<Document> {
	showDetail: boolean
	showUpload: boolean
	isLoading: boolean
	action: 'create' | 'edit'
	id: string
}

interface Document extends DocumentType {
	spritePositionX: number
}

interface Expedient extends ExpedientType {
	documents: Document[]
}

const ExpedientView: React.FC = () => {
	const {
		currentExpedientTypeRoute,
		currentExpedientTypeName,
		currentExpedientTypeNameSingular,
	} = useExpedientsState()
	const { getExpedient, getExpedientEvents } = useExpedientsService()

	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const notify = useNotify()
	const { user } = useUserState()
	const [documentFile, setDocumentFile] = useState<DocumentFile>({
		id: '',
		showDetail: false,
		showUpload: false,
		isLoading: false,
		action: 'create',
	})
	const [scheduledEvent, setScheduledEvent] = useState<ScheduleEventProps>({
		expedientId: '',
		code: '',
		show: false,
	})

	const {
		token: {
			colorBgContainer,
			borderRadiusLG,
			paddingMD,
			marginMD,
			colorTextSecondary,
		},
	} = theme.useToken()
	const sectionStyle = {
		backgroundColor: colorBgContainer,
		borderRadius: borderRadiusLG,
		padding: paddingMD,
		marginBottom: marginMD,
	}

	const { data, error } = useQuery<Expedient, AxiosError>({
		queryKey: ['expedient', id],
		queryFn: () => getExpedient(id!) as any,
		refetchOnMount: true,
		select: (expedient: Expedient) => {
			expedient.updatedAt = dateUtil.formatDate(expedient.updatedAt)
			expedient.documents = expedient.documents.map((document) => ({
				...document,
				spritePositionX: getSpritePositionX(document.extension),
				updatedAt: dateUtil.formatDate(document.updatedAt),
			}))
			expedient.reviews = expedient.reviews.map((review) => ({
				...review,
				createdAt: dateUtil.formatDate(review.createdAt),
			}))
			return expedient
		},
	})

	const { data: expedientEvents } = useQuery({
		queryKey: ['expedients-events', id],
		queryFn: () => getExpedientEvents(id!),
		refetchOnMount: true,
		select: (expedient) => {
			expedient.events = expedient.events.map((event: IEvent) => ({
				...event,
				scheduledAt: dateUtil.formatDate(event.scheduledAt),
			}))
			return expedient
		},
	})

	const { mutate, isPending } = useMutation({
		mutationFn: deleteExpedientReview,
		onSuccess: (_, reviewId) => {
			notify({ message: 'La revisión ha sido eliminada con éxito' })

			queryClient.setQueryData(['expedient', id], (old: Expedient) => {
				return {
					...old,
					reviews: data?.reviews.filter((review) => review.id !== reviewId),
				}
			})
		},
	})

	const { openConfirmModal } = useConfirmModal(isPending)

	const isWritableByUser = useMemo(
		() =>
			user?.id === data?.assignedLawyer?.id ||
			user?.id === data?.assignedAssistant?.id,
		[data, user],
	)

	const isEditableByUser = useMemo(
		() => user?.id === data?.createdByUser?.id,
		[data, user],
	)

	useEffect(() => {
		mentions = Array.from(dom.getElementsByClassName('mention'))
		mentions.forEach((element) => {
			element.addEventListener('click', docEventListeners)

			return () => {
				mentions.forEach((element) => {
					element.removeEventListener('click', docEventListeners)
				})
			}
		})
	}, [data])

	const docEventListeners = (event: any) => {
		if (!(event.target instanceof HTMLSpanElement)) return

		setDocumentFile((prev) => ({
			...prev,
			showDetail: true,
			action: 'create',
			id: event.target.dataset.id,
		}))
	}

	const { mutate: mutateDeleteEvent } = useMutation({
		mutationKey: ['expedient-review-delete'],
		mutationFn: deleteEvent,
		onSuccess: (_, eventId) => {
			notify({ message: 'Evento eliminado con éxito' })

			queryClient.setQueryData(['expedients-events', id], (expedient: any) => ({
				...expedient,
				events: expedient.events.filter(
					(event: IEvent) => event.id !== eventId,
				),
			}))
			queryClient.invalidateQueries({
				queryKey: ['expedients-events'],
				exact: true,
			})
		},
	})

	if (error?.status === HttpStatusCode.BadRequest) {
		return (
			<>
				<NavigationBackBtn to={`/${currentExpedientTypeRoute}`} />
				<Title level={4} className="text-center pt-4">
					{currentExpedientTypeNameSingular} no existente
				</Title>
			</>
		)
	}

	if (!data) return null

	return (
		<Row gutter={16}>
			<Col md={{ span: 16, order: 1 }} xs={{ span: 24, order: 2 }}>
				<Spin spinning={documentFile.isLoading} tip="Consultando...">
					<div style={sectionStyle}>
						<Flex className="flex justify-between flex-wrap">
							<Flex align="center">
								<NavigationBackBtn to={`/${currentExpedientTypeRoute}`} />
								<Text className="ml-1 text-lg">{data.code}</Text>
							</Flex>
							<Space>
								{isEditableByUser && (
									<Button
										onClick={() =>
											navigate(
												`/${currentExpedientTypeRoute}/${data.id}/editar`,
											)
										}
										variant="outlined"
										icon={<EditOutlined />}
									>
										Editar
									</Button>
								)}
								{isWritableByUser && <TextEditor expedientId={data.id} />}
							</Space>
						</Flex>

						<Divider className="my-3" />

						<Row className="mt-5">
							<Col md={16} xs={24}>
								<p className="mb-3">
									<strong>Materia:</strong>{' '}
									<Tag color={data.matterType?.color}>
										{data.matterType?.description}
									</Tag>
								</p>

								{currentExpedientTypeName !== EXPEDIENT_TYPE.CONSULTANCY ? (
									<>
										<p className="mb-3">
											<strong>Proceso:</strong> {data.processType?.description}
										</p>
										<p className="mb-3">
											<strong>
												{EXPEDIENT_TYPE_COURT_NAME[currentExpedientTypeRoute]}:
											</strong>{' '}
											{data.court}
										</p>
									</>
								) : (
									<>
										<p className="mb-3">
											<strong>Entidad:</strong> {data.entity}
										</p>
										<p className="mb-3">
											<strong>Trámite/Consulta:</strong> {data.procedure}
										</p>
									</>
								)}

								<p className="mb-3">
									<strong>Última actualización:</strong>
									{` ${data.updatedAt}`}
								</p>

								{currentExpedientTypeName ===
									EXPEDIENT_TYPE.JUDICIAL_PROCESSES && (
									<p className="mb-3">
										<strong>Instancia:</strong>
										{` ${data.instance}`}
									</p>
								)}

								<p className="mb-3">
									<strong className="mb-3">Partes:</strong>
								</p>
								<div className="mb-3">
									{data.parts.map((part) => (
										<p className="mb-2" key={part.id}>
											{currentExpedientTypeName !== EXPEDIENT_TYPE.CONSULTANCY
												? part.type?.description
												: part.typeDescription}
											{': '}
											{part.name}
										</p>
									))}
								</div>

								<div className="mb-3">
									<strong>Creado por:</strong>
									<UserAvatarName user={data.createdByUser} />
								</div>

								<p className="mb-3">
									<strong className="mb-3">Asignados:</strong>
								</p>
								<div className="mb-3">
									{data.assignedLawyer && (
										<div className="mb-2">
											<UserAvatarName
												user={data.assignedLawyer}
												title="Abogado"
											/>
										</div>
									)}
									<div className="mb-2">
										{data.assignedAssistant && (
											<div className="mb-2">
												<UserAvatarName
													user={data.assignedAssistant}
													title="Asistente"
												/>
											</div>
										)}
									</div>
								</div>
							</Col>

							<Col
								className="d-flex align-items-end flex-column"
								md={8}
								xs={24}
							>
								{data?.status.description !== 'Otros' ? (
									<Tag className="mb-2 mr-0">{data.status?.description}</Tag>
								) : (
									<em className="text-xs" style={{ color: colorTextSecondary }}>
										{data.statusDescription}
									</em>
								)}
							</Col>
						</Row>

						<Row align={'middle'} className="mb-3">
							<Col md={12} xs={24}>
								<strong>Informes:</strong>

								{!data.reviews?.length && <span> No registra</span>}
							</Col>
						</Row>

						{data.reviews.map((review) => (
							<Card
								className="mb-5 bg-layout-body"
								key={review.id}
								title={<UserAvatarName user={review.createdByUser!} />}
								extra={
									<div
										className="d-flex align-items-end flex-column"
										style={{ color: colorTextSecondary }}
									>
										<div>
											<em>{` ${review.createdAt}`}</em>
											{review.createdByUser?.id === user?.id && (
												<Tooltip title="Eliminar">
													<Button
														danger
														className="ml-2"
														icon={<DeleteOutlined />}
														shape="circle"
														onClick={() => openConfirmModal(mutate, review.id)}
													/>
												</Tooltip>
											)}
										</div>
									</div>
								}
							>
								{htmlReactParser(review.description)}
							</Card>
						))}
					</div>
				</Spin>
			</Col>
			<Col md={{ span: 8, order: 2 }} xs={{ span: 24, order: 1 }}>
				<div style={sectionStyle}>
					<div className="d-flex justify-content-between flex-wrap">
						<Text className="text-lg">Documentos</Text>
						{isWritableByUser && (
							<Button
								icon={<PlusOutlined />}
								type="primary"
								onClick={() =>
									setDocumentFile((prev) => ({
										...prev,
										showUpload: true,
										action: 'create',
										id: id!,
									}))
								}
							>
								Adjuntar documento
							</Button>
						)}
					</div>

					<Divider className="my-3" />

					<Spin spinning={documentFile.isLoading} tip="Consultando...">
						<StyledScrollbar
							style={{ height: data?.documents.length ? 250 : 0 }}
						>
							<Flex vertical wrap align="start">
								{data.documents.map((document) => (
									<div className="text-link w-100" key={document.id}>
										<div className="d-flex justify-content-between align-items-center">
											<div
												className="mr-4"
												style={{ wordBreak: 'break-all' }}
												onClick={() =>
													setDocumentFile((prev) => ({
														...prev,
														showDetail: true,
														action: 'create',
														id: document.id,
													}))
												}
											>
												<div className="d-flex align-items-center">
													<div
														style={{
															background: 'url(/docs.png) no-repeat',
															height: 32,
															width: 32,
															backgroundPositionX: document.spritePositionX,
															display: 'inline-block',
														}}
													/>
													<div className="ml-2">
														<p>{document.name}</p>
														<p style={{ color: colorTextSecondary }}>
															{document.updatedAt as string}
														</p>
													</div>
												</div>
											</div>
											{isWritableByUser && (
												<Tooltip title="Reemplazar">
													<Button
														icon={<EditOutlined />}
														shape="circle"
														onClick={() =>
															setDocumentFile((prev) => ({
																...prev,
																showUpload: true,
																action: 'edit',
																...document,
															}))
														}
													/>
												</Tooltip>
											)}
										</div>
									</div>
								))}
							</Flex>
						</StyledScrollbar>
					</Spin>
				</div>

				<div style={sectionStyle}>
					<div className="d-flex justify-content-between flex-wrap">
						<Text className="text-lg">Eventos</Text>
						{isWritableByUser && (
							<Button
								icon={<PlusOutlined />}
								type="primary"
								onClick={() =>
									setScheduledEvent(() => ({
										expedientId: data.id,
										code: data.code,
										show: true,
									}))
								}
							>
								Programar evento
							</Button>
						)}
					</div>

					<Divider className="my-3" />

					<Spin spinning={documentFile.isLoading} tip="Consultando...">
						<StyledScrollbar
							style={{ height: expedientEvents?.events.length ? 250 : 0 }}
						>
							<Flex vertical wrap align="start">
								{expedientEvents?.events.map((event: IEvent) => (
									<StyledCardNotification className="mb-3" key={event.id}>
										<Flex>
											<Flex>
												<Avatar
													icon={<NotificationOutlined />}
													size={32}
													style={{
														width: 32,
														backgroundColor: 'var(--ant-color-warning)',
													}}
												/>
											</Flex>
											<Flex
												vertical
												className="ml-3 w-100"
												justify="space-between"
											>
												<Flex justify="space-between">
													<StyledCardNotificationText $lineClamp="0">
														{event.message}
													</StyledCardNotificationText>
													<PopconfirmDelete
														onConfirm={() => mutateDeleteEvent(event.id)}
													>
														<Button
															danger
															color="danger"
															icon={<CloseOutlined />}
															shape="circle"
															size="small"
														/>
													</PopconfirmDelete>
												</Flex>
												<Text
													className="d-flex justify-content-end"
													type="secondary"
												>
													{event.scheduledAt as string}
												</Text>
											</Flex>
										</Flex>
									</StyledCardNotification>
								))}
							</Flex>
						</StyledScrollbar>
					</Spin>
				</div>
			</Col>
			{documentFile.showDetail && (
				<DocumentDetail
					documentFile={documentFile}
					setDocumentFile={setDocumentFile}
				/>
			)}
			{documentFile.showUpload && (
				<DocumentUpload
					documentFile={documentFile}
					setDocumentFile={setDocumentFile}
				/>
			)}
			<ScheduleEvent event={scheduledEvent} setEvent={setScheduledEvent} />
		</Row>
	)
}

export default ExpedientView
