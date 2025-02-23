import { useMutation } from '@tanstack/react-query'
import { Button, Divider, Modal, theme } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { IExpedient } from '@expedients/shared'
import NavigationBackBtn from '../components/NavigationBackBtn'
import { useExpedientsState } from '../hooks/useExpedientsState'
import useNotify from '../hooks/useNotification'
import ExpedientForm from '../modules/components/ExpedientForm'
import { useExpedientsService } from '../services/expedients.service'

const ExpedientsCreateView: React.FC = () => {
	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const sectionStyle = {
		backgroundColor: colorBgContainer,
		borderRadius: borderRadiusLG,
		padding: paddingMD,
		marginBottom: marginMD,
	}

	const { currentExpedientType } = useExpedientsState()

	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [createdExpedient, setCreatedExpedient] = useState<IExpedient>()
	const notify = useNotify()
	const [form] = useForm()

	const { createExpedient } = useExpedientsService()

	const { mutate, isPending } = useMutation({
		mutationKey: ['expedient-create'],
		mutationFn: createExpedient,
		onSuccess: (res) => {
			notify({ message: 'Expediente creado con éxito' })
			setCreatedExpedient((prev) => ({ ...prev, ...res }))
			setOpen(true)
		},
	})

	const handleCreate = () => {
		mutate(form.getFieldsValue())
	}

	return (
		<div style={sectionStyle}>
			<NavigationBackBtn to={`/${currentExpedientType}`} />
			<Divider className="my-3" />

			<div className="d-flex justify-content-center">
				<ExpedientForm
					form={form}
					isPending={isPending}
					onFinish={handleCreate}
				/>
			</div>

			<Modal
				open={open}
				title="Confirmar"
				footer={() => (
					<>
						<Button
							onClick={() => {
								form.resetFields()
								setOpen(false)
							}}
						>
							Quedarme aquí
						</Button>
						<Button onClick={() => navigate(`/${currentExpedientType}`)}>
							Ver todos los expedientes
						</Button>
						<Button
							type="primary"
							onClick={() =>
								navigate(`/${currentExpedientType}/${createdExpedient?.id}`)
							}
						>
							Ver expediente
						</Button>
					</>
				)}
				onCancel={() => {
					form.resetFields()
					setOpen(false)
				}}
			>
				Elija una opción
			</Modal>
		</div>
	)
}

export default ExpedientsCreateView
