import { ClearOutlined, SearchOutlined } from '@ant-design/icons'
import { IFindExpedientDto } from '@expedients/shared'
import { Button, Col, Flex, Form, Input, Row, theme } from 'antd'
import { FormInstance } from 'antd/lib'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useExpedientsState } from '../hooks/useExpedientsState'
import ExpedientStatusSelect from './ExpedientStatusSelect'
import MatterTypesSelect from './MatterTypeSelect'
import UsersSelect from './UsersSelect'

interface Props {
	onSearch: (values: any) => void
	loading: boolean
	form: FormInstance
}

const expedientTypeTextPlaceHolder = {
	asesoria: 'empresa, materia, entidad o trámite/consulta...',
	'procesos-judiciales': 'expediente, materia, proceso o fiscalia...',
	'procesos-de-investigacion': 'expediente, materia, proceso o juzgado...',
}

const initialFormValues: IFindExpedientDto = {
	text: null,
	status: null,
	updatedByUser: null,
	matterType: null,
}

const FilterExpedients: React.FC<Props> = ({ onSearch, loading, form }) => {
	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const { currentExpedientTypeRoute } = useExpedientsState()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		for (const searchKey in initialFormValues) {
			let value: string | string[] | null = null

			if (
				Array.isArray(initialFormValues[searchKey as keyof IFindExpedientDto])
			) {
				value = searchParams.getAll(searchKey)
			} else {
				value = searchParams.get(searchKey)
			}

			initialFormValues[searchKey as keyof IFindExpedientDto] = value as any
		}

		form.setFieldsValue(initialFormValues)

		if (searchParams.size) {
			setCanDeleteFilters(true)
		}
	}, [currentExpedientTypeRoute])

	const [canDeleteFilter, setCanDeleteFilters] = useState(false)

	function handleOnChange() {
		setCanDeleteFilters(
			Object.values(form.getFieldsValue()).some((value: any) =>
				Array.isArray(value) ? value.length : !!value,
			),
		)
	}

	const textPlaceHolder = useMemo(
		() => expedientTypeTextPlaceHolder[currentExpedientTypeRoute],
		[currentExpedientTypeRoute],
	)

	return (
		<div
			style={{
				backgroundColor: colorBgContainer,
				borderRadius: borderRadiusLG,
				padding: paddingMD,
				paddingBottom: 0,
				marginBottom: marginMD,
			}}
		>
			<Form
				autoComplete="off"
				form={form}
				onChange={handleOnChange}
				initialValues={initialFormValues}
				onFinish={onSearch}
				layout="vertical"
				validateTrigger="onSubmit"
			>
				<Row gutter={marginMD}>
					<Col md={9} sm={24}>
						<Form.Item name="text" label="Buscar por:" rules={[{ min: 3 }]}>
							<Input
								allowClear
								placeholder={textPlaceHolder}
								suffix={<SearchOutlined />}
								onClear={handleOnChange}
							/>
						</Form.Item>
					</Col>

					<Col md={4} sm={24}>
						<MatterTypesSelect
							label="Materia:"
							fieldNames={{ label: 'label', value: 'label' }}
							name={'matterType'}
							onChange={handleOnChange}
						/>
					</Col>

					<Col md={4} sm={24}>
						<ExpedientStatusSelect
							label="Estado:"
							fieldNames={{ label: 'label', value: 'label' }}
							name={'status'}
							onChange={handleOnChange}
						/>
					</Col>

					<Col md={4} sm={24}>
						<UsersSelect
							label="Actualizado por:"
							name={'updatedByUser'}
							onChange={(updatedByUser) => {
								form.setFieldsValue({ updatedByUser })
								handleOnChange()
							}}
						/>
					</Col>

					<Col
						md={3}
						sm={24}
						className={
							canDeleteFilter
								? 'flex flex-col justify-between'
								: 'flex flex-col justify-end'
						}
					>
						<Form.Item className="w-full">
							<Flex justify="end">
								{canDeleteFilter && (
									<Button
										danger
										icon={<ClearOutlined />}
										iconPosition="end"
										style={{ transform: 'translateY(-8px)' }}
										type="link"
										onClick={() => {
											form.resetFields()
											setCanDeleteFilters(false)
										}}
									>
										Quitar filtros
									</Button>
								)}
							</Flex>
							<Button
								block
								htmlType="submit"
								icon={<SearchOutlined />}
								iconPosition="end"
								loading={loading}
								type="primary"
							>
								Buscar
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	)
}

export default FilterExpedients
