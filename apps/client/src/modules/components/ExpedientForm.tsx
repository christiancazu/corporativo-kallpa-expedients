import {
	CloseOutlined,
	FolderAddOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import {
	EXPEDIENT_TYPE,
	EXPEDIENT_TYPE_COURT_NAME,
	FIELD,
	ICreateExpedientDto,
	IExpedientStatus,
	IUpdatePartDto,
} from '@expedients/shared'
import { Button, Card, Col, Form, Grid, Input, Row } from 'antd'
import type { FormInstance } from 'antd/lib'
import { useMemo } from 'react'
import ExpedientStatusSelect from '../../components/ExpedientStatusSelect'
import InstanceTypesSelect from '../../components/InstanceTypesSelect'
import MatterTypesSelect from '../../components/MatterTypeSelect'
import PartsTypeSelect from '../../components/PartsTypeSelect'
import ProcessTypesSelect from '../../components/ProcessTypesSelect '
import UsersSelect from '../../components/UsersSelect'
import { queryClient } from '../../config/queryClient'
import { useExpedientsState } from '../../hooks/useExpedientsState'

interface Props {
	form: FormInstance
	isPending: boolean
	onFinish: (data: any) => void
	mode?: 'create' | 'edit'
}
const { useBreakpoint } = Grid

export default function ExpedientForm({
	form,
	isPending,
	onFinish,
	mode = 'create',
}: Props): React.ReactNode {
	const screens = useBreakpoint()

	const {
		currentExpedientTypeCodeName,
		currentExpedientTypeName,
		currentExpedientTypeRoute,
		currentExpedientTypeNameSingular,
	} = useExpedientsState()

	const statusId = Form.useWatch('statusId', form)

	const isOtrosStatus = useMemo(() => {
		return (
			queryClient
				.getQueryData<IExpedientStatus[]>(['expedient-status'])
				?.find((status) => status.id === statusId)?.description === 'Otros'
		)
	}, [statusId])

	const handleOnFinish = (formData: ICreateExpedientDto) => {
		onFinish({
			...formData,
			parts: formData.parts?.map<IUpdatePartDto>((part) => ({
				id: part.id,
				name: part.name,
				typeId: part.typeId,
				typeDescription: part.typeDescription,
			})),
		})
	}

	return (
		<Form
			autoComplete="off"
			form={form}
			labelCol={{ xs: { span: 24 }, lg: { span: 6 } }}
			style={{ width: '100%', maxWidth: 800 }}
			wrapperCol={{ xs: { span: 24 }, lg: { span: 18 } }}
			onFinish={handleOnFinish}
		>
			<Form.Item
				label={currentExpedientTypeCodeName}
				name="code"
				className="capitalize"
				rules={[{ required: true, max: FIELD.EXPEDIENT_CODE_MAX_LENGTH }]}
			>
				<Input />
			</Form.Item>

			<MatterTypesSelect
				label="Materia"
				name="matterTypeId"
				rules={[{ required: true }]}
			/>

			{currentExpedientTypeName !== EXPEDIENT_TYPE.CONSULTANCY ? (
				<>
					<ProcessTypesSelect
						name="processTypeId"
						rules={[{ required: true }]}
					/>
					<Form.Item
						label={EXPEDIENT_TYPE_COURT_NAME[currentExpedientTypeRoute]}
						name="court"
						rules={[{ required: true, max: FIELD.EXPEDIENT_COURT_MAX_LENGTH }]}
					>
						<Input />
					</Form.Item>
				</>
			) : (
				<>
					<Form.Item
						label="Entidad"
						name="entity"
						rules={[{ required: true, max: FIELD.EXPEDIENT_ENTITY_MAX_LENGTH }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Trámite/Consulta"
						name="procedure"
						rules={[
							{ required: true, max: FIELD.EXPEDIENT_PROCEDURE_MAX_LENGTH },
						]}
					>
						<Input />
					</Form.Item>
				</>
			)}

			{currentExpedientTypeName === EXPEDIENT_TYPE.INVESTIGATION_PROCESSES && (
				<InstanceTypesSelect
					label="Instancia"
					name="instance"
					rules={[{ required: true }]}
				/>
			)}

			<ExpedientStatusSelect
				label="Estado"
				name="statusId"
				rules={[{ required: true }]}
			/>

			{isOtrosStatus && (
				<Form.Item
					label="Descripción de estado"
					name="statusDescription"
					rules={[
						{
							required: true,
							max: FIELD.EXPEDIENT_STATUS_DESCRIPTION_MAX_LENGTH,
						},
					]}
				>
					<Input />
				</Form.Item>
			)}

			<UsersSelect label={'Abogado asignado'} name={'assignedLawyerId'} />

			<UsersSelect label={'Asistente asignado'} name={'assignedAssistantId'} />

			<Row>
				<Col xs={{ span: 24 }} lg={{ span: 18, offset: 6 }}>
					<Form.List name="parts">
						{(fields, { add, remove }) => (
							<div
								style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}
							>
								{fields.map(({ key, name, ...restField }) => (
									<Card
										key={key}
										size="small"
										title={`Parte ${name + 1}`}
										extra={
											<CloseOutlined
												onClick={() => {
													remove(name)
												}}
											/>
										}
									>
										{currentExpedientTypeName !== EXPEDIENT_TYPE.CONSULTANCY ? (
											<PartsTypeSelect
												{...restField}
												label={'Tipo'}
												labelCol={{ span: 3 }}
												wrapperCol={{ span: 21 }}
												name={[name, 'typeId']}
												rules={[{ required: true }]}
											/>
										) : (
											<Form.Item
												{...restField}
												label="Tipo"
												name={[name, 'typeDescription']}
												labelCol={{ span: 3 }}
												wrapperCol={{ span: 21 }}
												rules={[
													{
														required: true,
														max: FIELD.PART_TYPE_DESCRIPTION_MAX_LENGTH,
													},
												]}
											>
												<Input />
											</Form.Item>
										)}

										<Form.Item
											{...restField}
											label="Nombre"
											name={[name, 'name']}
											labelCol={{ span: 3 }}
											wrapperCol={{ span: 21 }}
											rules={[
												{ required: true, max: FIELD.PART_NAME_MAX_LENGTH },
											]}
										>
											<Input />
										</Form.Item>
									</Card>
								))}

								<Button type="dashed" onClick={add}>
									<PlusOutlined /> Agregar parte
								</Button>
							</div>
						)}
					</Form.List>
				</Col>
			</Row>

			<Form.Item wrapperCol={{ offset: screens.md ? 6 : 0 }} className="mt-8">
				<Button
					htmlType="submit"
					style={{ width: '256px' }}
					icon={<FolderAddOutlined />}
					loading={isPending}
					type="primary"
				>
					{mode === 'create' ? 'Crear ' : 'Editar '}
					{currentExpedientTypeNameSingular}
				</Button>
			</Form.Item>
		</Form>
	)
}
