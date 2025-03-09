import { useQuery } from '@tanstack/react-query'
import { Form, Select, Tag } from 'antd'
import type { SelectProps } from 'antd'
import type React from 'react'
import { getMatterTypes } from '../services/api.service'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message?: string }]
	onChange?: () => void
	fieldNames?: SelectProps['fieldNames']
}

const MatterTypesSelect: React.FC<Props> = ({
	label,
	fieldNames = { value: 'value', label: 'label' },
	...props
}) => {
	const { data, isFetching } = useQuery({
		queryKey: ['matter-type'],
		queryFn: () => getMatterTypes(),
		select: (processTypes) =>
			processTypes.map((matterType) => ({
				...matterType,
				label: matterType.description,
				value: matterType.id,
			})),
	})

	const getTagColorByLabel = (label: string): string => {
		return data?.find((m) => m.label === label)?.color as string
	}

	return (
		<Form.Item label={label} {...props}>
			<Select
				allowClear
				fieldNames={fieldNames}
				loading={isFetching}
				optionRender={(option) => (
					<Tag color={option.data.color}>{option.label}</Tag>
				)}
				labelRender={(option) => (
					<Tag color={getTagColorByLabel(option.label as unknown as string)}>
						{option.label}
					</Tag>
				)}
				options={data}
				style={{ width: '100%' }}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default MatterTypesSelect
