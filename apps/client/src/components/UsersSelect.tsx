import { useQuery } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import type React from 'react'

import type { IUser } from '@expedients/shared'
import { DefaultOptionType } from 'antd/es/select'
import UserAvatarName from '../modules/shared/components/UserAvatarName'
import { getUsers } from '../services/api.service'

interface Props {
	label?: string
	name: [number, string] | string
	rules?: [{ required: boolean; message: string }]
	placeholder?: string
	onChange?: (event: any) => void
}

const UsersSelect: React.FC<Props> = ({ ...props }) => {
	const { data, isFetching } = useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers(),
	})

	return (
		<Form.Item {...props}>
			<Select<string, DefaultOptionType & IUser>
				allowClear
				showSearch
				disabled={isFetching}
				loading={isFetching}
				options={
					data?.map((user) => ({
						...user,
						value: user.id,
						label: `${user.firstName} ${user.surname}`,
					})) || []
				}
				optionRender={(option) => <UserAvatarName user={option.data} />}
				placeholder={props.placeholder}
				className="w-full"
				filterOption={(input, option) =>
					((option?.label as string) ?? '')
						.toLowerCase()
						.includes(input.toLowerCase())
				}
				onChange={props.onChange}
			/>
		</Form.Item>
	)
}

export default UsersSelect
