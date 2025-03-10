import { useQuery } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import { FormItemInputProps } from 'antd/es/form/FormItemInput'
import type React from 'react'
import { getPartTypes } from '../services/api.service'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message?: string }]
	onChange?: () => void
}

const PartsTypeSelect: React.FC<Props & FormItemInputProps> = ({
	label,
	...props
}) => {
	const { data, isFetching } = useQuery({
		queryKey: ['part-type'],
		queryFn: getPartTypes,
	})

	return (
		<Form.Item label={label} {...props}>
			<Select
				allowClear
				fieldNames={{ value: 'id', label: 'description' }}
				loading={isFetching}
				options={data}
				style={{ width: '100%' }}
			/>
		</Form.Item>
	)
}

export default PartsTypeSelect
