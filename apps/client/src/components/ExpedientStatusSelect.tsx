import { EXPEDIENT_STATUS } from '@expedients/shared'
import { Form, Select } from 'antd'
import type React from 'react'

const expedientStatusOptions = Object.entries(EXPEDIENT_STATUS).map(
	([value, label]) => ({
		label,
		value,
	}),
)

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message: string }]
	onChange?: () => void
}

const ExpedientStatusSelect: React.FC<Props> = (props) => {
	return (
		<Form.Item {...props}>
			<Select
				allowClear
				options={expedientStatusOptions}
				placeholder="Estado"
				style={{ width: '100%' }}
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default ExpedientStatusSelect
