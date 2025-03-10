import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Divider, Modal, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { ICreateExpedientDto, IExpedient } from '@expedients/shared'
import { useForm } from 'antd/es/form/Form'
import Title from 'antd/es/typography/Title'
import { AxiosError, HttpStatusCode } from 'axios'
import NavigationBackBtn from '../../../components/NavigationBackBtn'
import { useExpedientsState } from '../../../hooks/useExpedientsState'
import useNotify from '../../../hooks/useNotification'
import { useExpedientsService } from '../../../services/expedients.service'
import ExpedientForm from '../../components/ExpedientForm'

export default function ExpedientsIdEditView(): React.ReactNode {
	const { id } = useParams<{ id: string }>()

	const {
		currentExpedientTypeRoute,
		currentExpedientTypeNameSingular,
		currentExpedientTypeName,
	} = useExpedientsState()
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)

	const { getExpedient, updateExpedient } = useExpedientsService()

	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const sectionStyle = {
		backgroundColor: colorBgContainer,
		borderRadius: borderRadiusLG,
		padding: paddingMD,
		marginBottom: marginMD,
	}
	const notify = useNotify()
	const [form] = useForm<ICreateExpedientDto>()

	const { data, isSuccess, error } = useQuery<IExpedient, AxiosError>({
		queryKey: ['expedient', id],
		queryFn: () => getExpedient(id!),
		refetchOnMount: true,
	})

	useEffect(() => {
		form.setFieldsValue({
			...data,
			assignedLawyerId: data?.assignedLawyer?.id,
			assignedAssistantId: data?.assignedAssistant?.id,
			processTypeId: data?.processType?.id,
			statusId: data?.status?.id,
			matterTypeId: data?.matterType?.id,
			parts: data?.parts?.map((part) => {
				return {
					id: part.id,
					name: part.name,
					typeId: part.type?.id,
					typeDescription: part.typeDescription,
				}
			}),
		} as ICreateExpedientDto)
	}, [data, isSuccess])

	const { mutate, isPending } = useMutation({
		mutationKey: ['expedient-update'],
		mutationFn: (expedient: ICreateExpedientDto) =>
			updateExpedient({ id: id!, expedient }),
		onSuccess: () => {
			notify({
				message: `${currentExpedientTypeNameSingular} actualizado con éxito`,
			})
			setOpen(true)
		},
	})

	return (
		<div style={sectionStyle}>
			<NavigationBackBtn to={`/${currentExpedientTypeRoute}`} />

			<Divider className="my-3" />

			{error?.status === HttpStatusCode.BadRequest ? (
				<Title level={4} className="text-center pt-4">
					{currentExpedientTypeNameSingular} no existente
				</Title>
			) : (
				<div className="d-flex justify-content-center">
					<ExpedientForm
						form={form}
						isPending={isPending}
						mode="edit"
						onFinish={mutate}
					/>
				</div>
			)}

			<Modal
				open={open}
				title="Confirmar"
				footer={() => (
					<>
						<Button
							onClick={() => {
								setOpen(false)
							}}
						>
							Quedarme aquí
						</Button>
						<Button onClick={() => navigate(`/${currentExpedientTypeRoute}`)}>
							Volver al listado de {currentExpedientTypeName}
						</Button>
						<Button
							type="primary"
							onClick={() => navigate(`/${currentExpedientTypeRoute}/${id}`)}
						>
							Ver {currentExpedientTypeNameSingular}
						</Button>
					</>
				)}
				onCancel={() => {
					setOpen(false)
				}}
			>
				Elija una opción
			</Modal>
		</div>
	)
}
