import { useMutation } from '@tanstack/react-query'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import type React from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { useForm } from 'antd/es/form/Form'
import useNotify from '../hooks/useNotification'
import useUserState from '../hooks/useUserState'
import { signIn } from '../services/api.service'

interface FieldType {
	email?: string
	password?: string
}

const SignInView: React.FC = () => {
	const [form] = useForm()
	const { setUserSession } = useUserState()
	const navigate = useNavigate()
	const [params, setParams] = useSearchParams()

	const notify = useNotify()

	const { mutate, isPending } = useMutation({
		mutationKey: ['sign-in'],
		mutationFn: () =>
			signIn({
				email: form.getFieldValue('email'),
				password: form.getFieldValue('password'),
			}),
		onSuccess: (data) => {
			setUserSession(data)

			setTimeout(() => {
				notify({ message: 'La sessión ha sido iniciada con éxito' })
				navigate(params.get('redirect') ?? '/')
				setParams((params) => {
					params.delete('redirect')
					return params
				})
			}, 1)
		},
	})

	return (
		<section className="login-view">
			<Row align={'middle'} justify={'center'} style={{ height: '100vh' }}>
				<Col className="d-flex justify-content-center" md={6} xs={22}>
					<Card
						bordered={true}
						className="mb-0"
						style={{ width: '100%' }}
						title={<p style={{ textAlign: 'center' }}>Iniciar Sesión</p>}
					>
						<Form
							autoComplete="off"
							disabled={isPending}
							form={form}
							layout="vertical"
							name="login"
							onFinish={mutate}
						>
							<Form.Item<FieldType>
								label="Correo electrónico"
								name="email"
								rules={[
									{ required: true, message: 'ingrese su correo electrónico' },
								]}
							>
								<Input type="email" />
							</Form.Item>

							<Form.Item<FieldType>
								label="Contraseña"
								name="password"
								rules={[{ required: true, message: 'Ingrese su contraseña' }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item className="mb-0">
								<Button
									block
									className="mt-5"
									htmlType="submit"
									loading={isPending}
									type="primary"
								>
									Ingresar
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</section>
	)
}

export default SignInView
