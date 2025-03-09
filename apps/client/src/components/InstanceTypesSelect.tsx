import { JUDICIAL_PROCESSES_INSTANCES } from '@expedients/shared'
import { Form, Select, Tag } from 'antd'
import type { SelectProps } from 'antd'
import type React from 'react'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message?: string }]
	onChange?: () => void
	fieldNames?: SelectProps['fieldNames']
}

const data = Object.entries(JUDICIAL_PROCESSES_INSTANCES).map(([_, label]) => ({
	label,
	value: label,
}))

const InstanceTypesSelect: React.FC<Props> = ({
	label,
	fieldNames = { value: 'value', label: 'label' },
	...props
}) => {
	return (
		<Form.Item label={label} {...props}>
			<Select
				allowClear
				fieldNames={fieldNames}
				labelRender={(option) => <Tag>{option.label}</Tag>}
				options={data}
				style={{ width: '100%' }}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default InstanceTypesSelect
