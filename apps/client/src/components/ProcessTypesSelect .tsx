import { useQuery } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import { FormItemInputProps } from 'antd/es/form/FormItemInput'
import type React from 'react'
import { getProcessTypes } from '../services/api.service'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message: string }]
	className?: string
}

const ProcessTypesSelect: React.FC<Props & FormItemInputProps> = ({
	label = 'Tipo de proceso',
	...props
}) => {
	const { data, isFetching } = useQuery({
		queryKey: ['process-types'],
		queryFn: () => getProcessTypes(),
		select: (processTypes) =>
			processTypes.map((processType) => ({
				label: processType.description,
				value: processType.id,
			})),
	})

	return (
		<Form.Item label={label} {...props}>
			<Select
				allowClear
				loading={isFetching}
				options={data}
				style={{ width: '100%' }}
				placeholder="Tipo de proceso"
			/>
		</Form.Item>
	)
}

export default ProcessTypesSelect
