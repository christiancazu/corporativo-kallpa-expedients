import { useQuery } from '@tanstack/react-query'
import { Form, Select, Tag } from 'antd'
import type { SelectProps } from 'antd'
import type React from 'react'
import { getExpedientStatus } from '../services/api.service'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message?: string }]
	onChange?: () => void
	fieldNames?: SelectProps['fieldNames']
}

const ExpedientStatusSelect: React.FC<Props> = ({
	label,
	fieldNames = { value: 'value', label: 'label' },
	...props
}) => {
	const { data, isFetching } = useQuery({
		queryKey: ['expedient-status'],
		queryFn: () => getExpedientStatus(),
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
				fieldNames={fieldNames}
				loading={isFetching}
				labelRender={(option) => <Tag>{option.label}</Tag>}
				options={data}
				style={{ width: '100%' }}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default ExpedientStatusSelect
