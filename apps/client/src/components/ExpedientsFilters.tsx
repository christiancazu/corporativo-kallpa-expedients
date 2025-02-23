import {
	ClearOutlined,
	FilterOutlined,
	SearchOutlined,
} from '@ant-design/icons'
import {
	Button,
	Checkbox,
	type CheckboxOptionType,
	Col,
	Flex,
	Form,
	Input,
	Row,
	theme,
} from 'antd'
import { FormInstance } from 'antd/lib'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useExpedientsState } from '../hooks/useExpedientsState'
import { SearchParams } from '../views/ExpedientsView'
import ExpedientStatusSelect from './ExpedientStatusSelect'
import UsersSelect from './UsersSelect'

const textFilterOptions: CheckboxOptionType[] = [
	{ label: 'Código', value: 'code' },
	{ label: 'Materia', value: 'subject' },
	{ label: 'Juzgado', value: 'court' },
]

interface Props {
	onSearch: (values: any) => void
	loading: boolean
	form: FormInstance
}

const FilterExpedients: React.FC<Props> = ({ onSearch, loading, form }) => {
	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const { currentExpedientType } = useExpedientsState()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		const formSearchParams: SearchParams = {
			byText: [],
			text: null,
			status: null,
			updatedByUser: null,
		}

		for (const searchKey in formSearchParams) {
			let value: string | string[] | null = null

			if (Array.isArray(formSearchParams[searchKey as keyof SearchParams])) {
				value = searchParams.getAll(searchKey)
			} else {
				value = searchParams.get(searchKey)
			}

			formSearchParams[searchKey as keyof SearchParams] = value as any
		}

		if (!formSearchParams.byText?.length) {
			formSearchParams.byText = ['code', 'subject', 'court']
		}

		form.setFieldsValue(formSearchParams)

		if (searchParams.size) {
			setCanDeleteFilters(true)
		}
	}, [currentExpedientType])

	const [canDeleteFilter, setCanDeleteFilters] = useState(false)

	function handleOnChange() {
		setCanDeleteFilters(
			Object.values(form.getFieldsValue()).some((value: any) =>
				Array.isArray(value) ? value.length : !!value,
			),
		)
	}

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
				initialValues={{
					byText: ['code', 'subject', 'court'],
					text: null,
					status: null,
					updatedByUser: null,
				}}
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
					<Col md={6} sm={24}>
						<Form.Item label="Filtrar por" name="byText">
							<Checkbox.Group
								options={textFilterOptions}
								onChange={handleOnChange}
							/>
						</Form.Item>
					</Col>

					<Col md={7} sm={24}>
						<Form.Item name="text">
							<Input
								allowClear
								placeholder="Ingrese una busqueda..."
								style={{ width: '100%' }}
								suffix={<SearchOutlined />}
								onClear={handleOnChange}
							/>
						</Form.Item>
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

					<Col md={4} sm={24}>
						<ExpedientStatusSelect name={'status'} onChange={handleOnChange} />
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
