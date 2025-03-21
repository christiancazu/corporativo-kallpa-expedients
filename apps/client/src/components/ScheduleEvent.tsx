import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, DatePicker, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Title from 'antd/es/typography/Title'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { SetStateAction } from 'react'

import { ScheduleOutlined } from '@ant-design/icons'
import { useExpedientsState } from '../hooks/useExpedientsState'
import useNotify from '../hooks/useNotification'
import { createEvent } from '../services/api.service'
import type { CreateEvent } from '../types'

export interface ScheduleEventProps {
	expedientId: string
	code: string
	show: boolean
}

interface Props {
	event: ScheduleEventProps
	setEvent: React.Dispatch<SetStateAction<ScheduleEventProps>>
}

dayjs.extend(customParseFormat)
const dateFormat = 'YYYY-MM-DD HH:mm'

const minDate = dayjs(new Date().toISOString()).format(dateFormat)

export default function ScheduleEvent({
	event,
	setEvent,
}: Props): React.ReactNode {
	const notify = useNotify()
	const queryClient = useQueryClient()
	const { currentExpedientTypeNameSingular } = useExpedientsState()

	const { mutate, isPending } = useMutation({
		mutationKey: ['create-event'],
		mutationFn: createEvent,
		onSuccess: async () => {
			notify({ message: 'Evento programado con éxito' })
			setEvent((prev) => ({ ...prev, show: false }))
			await queryClient.invalidateQueries({
				queryKey: ['expedients-events', event.expedientId],
			})
			form.resetFields()
			queryClient.invalidateQueries({
				queryKey: ['expedients-events'],
				exact: true,
			})
		},
	})

	const [form] = useForm<CreateEvent>()

	const handleSubmit = (values: CreateEvent) => {
		mutate({
			message: values.message,
			scheduledAt: new Date(values.scheduledAt),
			expedientId: event.expedientId,
		})
	}

	return (
		<Modal
			closable={!isPending}
			maskClosable={!isPending}
			open={event.show}
			title={`Programar evento para ${currentExpedientTypeNameSingular}`}
			footer={[
				<Button
					key="back"
					onClick={() => setEvent((prev) => ({ ...prev, show: false }))}
				>
					Cancelar
				</Button>,
				<Button
					icon={<ScheduleOutlined />}
					key="download"
					loading={isPending}
					type="primary"
					onClick={() => form.submit()}
				>
					Crear
				</Button>,
			]}
			onCancel={() => setEvent((prev) => ({ ...prev, show: false }))}
		>
			<Title level={4} type="secondary">
				{event.code}
			</Title>
			<Form
				autoComplete="off"
				form={form}
				layout="vertical"
				onFinish={(values) => handleSubmit(values)}
			>
				<Form.Item
					label="Programar para"
					name="scheduledAt"
					rules={[{ required: true }]}
				>
					<DatePicker
						format="YYYY-MM-DD HH:mm"
						minDate={dayjs(minDate)}
						showTime={{ format: 'HH:mm' }}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item label="Mensaje" name="message" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
}
