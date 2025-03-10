import { EXPEDIENT_TYPE } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import { FormItemInputProps } from 'antd/es/form/FormItemInput'
import type React from 'react'
import { useMemo } from 'react'
import { useExpedientsState } from '../hooks/useExpedientsState'
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

	const { currentExpedientTypeName } = useExpedientsState()

	const filteredByExpedientTypeData = useMemo(
		() =>
			data?.filter((partType) => {
				return (
					partType.expedientType.some((o) => o === currentExpedientTypeName) ??
					[]
				)
			}),
		[data, currentExpedientTypeName],
	)

	return (
		<Form.Item label={label} {...props}>
			<Select
				allowClear
				fieldNames={{ value: 'id', label: 'description' }}
				loading={isFetching}
				options={filteredByExpedientTypeData}
				style={{ width: '100%' }}
			/>
		</Form.Item>
	)
}

export default PartsTypeSelect
