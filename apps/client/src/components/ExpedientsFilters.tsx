import {
	ClearOutlined,
	FilterOutlined,
	SearchOutlined,
} from '@ant-design/icons'
import { Button, Col, Flex, Form, Input, Row, theme } from 'antd'
import { FormInstance } from 'antd/lib'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useExpedientsState } from '../hooks/useExpedientsState'
import { SearchParams } from '../views/ExpedientsView'
import ExpedientStatusSelect from './ExpedientStatusSelect'
import UsersSelect from './UsersSelect'

interface Props {
	onSearch: (values: any) => void
	loading: boolean
	form: FormInstance
}

const FilterExpedients: React.FC<Props> = ({ onSearch, loading, form }) => {
	const {
		token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
	} = theme.useToken()

	const { currentExpedientType, isExpedientEmpresa } = useExpedientsState()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		const formSearchParams: SearchParams = {
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

	const textPlaceHolder = useMemo(
		() =>
			isExpedientEmpresa
				? 'Busqueda por: empresa, materia proceso o juzgado...'
				: 'Busqueda por: asesoría, materia, entidad o trámite/consulta...',
		[isExpedientEmpresa],
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
				initialValues={{
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
					<Col md={11} sm={24}>
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

					<Col md={5} sm={24}>
						<UsersSelect
							name={'updatedByUser'}
							placeholder={'Actualizado por'}
							onChange={(updatedByUser) => {
								form.setFieldsValue({ updatedByUser })
								handleOnChange()
							}}
						/>
					</Col>

					<Col md={5} sm={24}>
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
