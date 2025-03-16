import { NotificationOutlined } from '@ant-design/icons'
import { Avatar, Button, Flex, Modal, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import { type SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router'
import { useEvents } from '../../hooks/useEvents'
import useUserState from '../../hooks/useUserState'
import { StyledScrollbar } from '../StyledScrollbar'
import ButtonBase from '../base/ButtonBase'
import {
	StyledCardNotification,
	StyledCardNotificationText,
	StyledDrawer,
} from './styled'

interface Props {
	drawer: boolean
	setDrawer: React.Dispatch<SetStateAction<boolean>>
}

const { Text } = Typography

export default function DrawerEvents({
	drawer,
	setDrawer,
}: Props): React.ReactNode {
	const { isUserNotificationEnabled } = useUserState()
	const { data } = useEvents()

	const navigate = useNavigate()

	const [isModalVisible, setIsModalVisible] = useState(false)

	return (
		<>
			<StyledDrawer
				open={drawer}
				title={
					<Flex justify="end">
						<Button
							icon={<NotificationOutlined />}
							type={isUserNotificationEnabled ? 'default' : 'primary'}
							onClick={() => setIsModalVisible(true)}
						>
							{isUserNotificationEnabled
								? 'Desactivar Notificaciones'
								: 'Activar Notificaciones'}
						</Button>
					</Flex>
				}
				onClose={() => setDrawer(false)}
			>
				<Title level={3}>Eventos</Title>
				<StyledScrollbar style={{ height: '92%' }}>
					{data?.map((event) => (
						<StyledCardNotification hoverable className="mb-3" key={event.id}>
							<Flex
								onClick={() => {
									navigate(`/expedients/${event.expedient.id}`)
									setDrawer(false)
								}}
							>
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
								<Flex vertical className="ml-3 w-full" justify="space-between">
									<StyledCardNotificationText>
										{event.message}
									</StyledCardNotificationText>
									<StyledCardNotificationText code $lineClamp="2">
										exp: {event.expedient.code}
									</StyledCardNotificationText>
									<Text className="d-flex justify-content-end" type="secondary">
										{event.scheduledAt as string}
									</Text>
								</Flex>
							</Flex>
						</StyledCardNotification>
					))}
				</StyledScrollbar>
			</StyledDrawer>

			<Modal
				closable={false}
				open={isModalVisible}
				title="Notificaciones"
				footer={[
					<ButtonBase
						primary
						icon={<NotificationOutlined />}
						key="activate"
						onClick={() => setIsModalVisible(false)}
					>
						Entendido
					</ButtonBase>,
				]}
			>
				<Title className="my-5" level={3}>
					Es necesario {isUserNotificationEnabled ? 'desactivar' : 'activar'}{' '}
					las notificaciones de forma manual en el navegador
				</Title>
			</Modal>
		</>
	)
}
