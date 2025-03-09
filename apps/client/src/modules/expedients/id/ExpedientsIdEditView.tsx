import { useMutation, useQuery } from '@tanstack/react-query'
import { Divider, theme } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router'

import { IExpedient } from '@expedients/shared'
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

	const { currentExpedientTypeRoute } = useExpedientsState()

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
	const [form] = useForm()

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
		})
	}, [data, isSuccess])

	const { mutate, isPending } = useMutation({
		mutationKey: ['expedient-update'],
		mutationFn: () =>
			updateExpedient({ id: id!, expedient: form.getFieldsValue() }),
		onSuccess: () => {
			notify({ message: 'Expediente actualizado con éxito' })
		},
	})

	return (
		<div style={sectionStyle}>
			<NavigationBackBtn to={`/${currentExpedientTypeRoute}`} />

			<Divider className="my-3" />

			{error?.status === HttpStatusCode.BadRequest ? (
				<Title level={4} className="text-center pt-4">
					El expediente no ha sido encontrado
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
		</div>
	)
}
