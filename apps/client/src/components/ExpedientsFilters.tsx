import {
	ClearOutlined,
	FilterOutlined,
	SearchOutlined,
} from '@ant-design/icons'
import { IFindExpedientDto } from '@expedients/shared'
import { Button, Col, Flex, Form, Input, Row, theme } from 'antd'
import { FormInstance } from 'antd/lib'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useExpedientsState } from '../hooks/useExpedientsState'
import ExpedientStatusSelect from './ExpedientStatusSelect'
import MatterTypeSelect from './MatterTypeSelect'
import UsersSelect from './UsersSelect'

interface Props {
	onSearch: (values: any) => void
	loading: boolean
	form: FormInstance
}

const expedientTypeTextPlaceHolder = {
	asesoria: 'Busqueda por: empresa, materia, entidad o trámite/consulta...',
	'procesos-judiciales':
		'Busqueda por: expediente, materia, proceso o fiscalia...',
	'procesos-de-investigacion':
		'Busqueda por: expediente, materia, proceso o juzgado...',
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
		// const formSearchParams: IFindExpedientDto = {
		// 	text: null,
		// 	status: null,
		// 	updatedByUser: null,
		// 	matterType: null,
		// }

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
				marginBottom: marginMD,
			}}
		>
			<Form
				autoComplete="off"
				form={form}
				onChange={handleOnChange}
				initialValues={initialFormValues}
				onFinish={onSearch}
			>
				<Flex justify="space-between">
					<h3 style={{ marginBottom: marginMD }}>
						Filtros <FilterOutlined />
					</h3>

					{canDeleteFilter && (
						<Button
							danger
							icon={<ClearOutlined />}
							iconPosition="end"
							type="link"
							onClick={() => {
								form.resetFields()
								setCanDeleteFilters(false)
							}}
						>
							Restablecer filtros
						</Button>
					)}
				</Flex>

				<Row gutter={marginMD}>
					<Col md={9} sm={24}>
						<Form.Item name="text">
							<Input
								allowClear
								placeholder={textPlaceHolder}
								style={{ width: '100%' }}
								suffix={<SearchOutlined />}
								onClear={handleOnChange}
							/>
						</Form.Item>
					</Col>

					<Col md={4} sm={24}>
						<MatterTypeSelect
							fieldNames={{ label: 'label', value: 'label' }}
							name={'matterType'}
							onChange={handleOnChange}
						/>
					</Col>

					<Col md={4} sm={24}>
						<ExpedientStatusSelect
							fieldNames={{ label: 'label', value: 'label' }}
							name={'status'}
							onChange={handleOnChange}
						/>
					</Col>

					<Col md={4} sm={24}>
						<UsersSelect
							name={'updatedByUser'}
							placeholder={'Actualizado por'}
							onChange={(updatedByUser) => {
								form.setFieldsValue({ updatedByUser })
								handleOnChange()
							}}
						/>
					</Col>

					<Col md={3} sm={24}>
						<Form.Item>
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
