import type React from 'react'

import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import type {
	EXPEDIENT_STATUS,
	IExpedient,
	IReview,
	IUser,
} from '@expedients/shared'
import {
	Button,
	Space,
	type TableColumnsType,
	type TableProps,
	Tooltip,
} from 'antd'
import htmlReactParser from 'html-react-parser'
import { Link } from 'react-router'
import { useExpedientsState } from '../hooks/useExpedientsState'
import UserAvatarName from '../modules/shared/components/UserAvatarName'
import { dateUtil } from '../utils'
import { TableBase } from './base/TableBase'
import { StyledTable } from './styled/table.styled'

type DataType = {
	dataIndex?: string
} & IExpedient

type Props = {
	expedients: DataType[]
	onChangePagination: () => void
} & TableProps

const TableExpedients: React.FC<Props> = ({
	expedients,
	loading,
	onChangePagination,
}) => {
	const { currentExpedientType } = useExpedientsState()

	const columns: TableColumnsType<DataType> = [
		{
			title: 'Expediente',
			dataIndex: 'code',
			key: 'code',
			width: 150,
			render: (text, expedient) => (
				<Link to={`/${currentExpedientType}/${expedient.id}`}>
					<Tooltip title={text}>
						<Button
							className="text-left"
							style={{ width: '142px', paddingLeft: 0, paddingRight: 4 }}
							type="link"
						>
							<span
								style={{
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									display: 'block',
									textOverflow: 'ellipsis',
								}}
							>
								{text}
							</span>
						</Button>
					</Tooltip>
				</Link>
			),
		},
		{
			title: 'Materia',
			dataIndex: 'subject',
			key: 'subject',
			width: 140,
		},
		{
			title: 'Proceso',
			dataIndex: 'process',
			key: 'process',
			width: 140,
		},
		{
			title: 'Juzgado',
			dataIndex: 'court',
			key: 'court',
			width: 140,
		},
		{
			title: 'Estado',
			dataIndex: 'status',
			key: 'status',
			width: 140,
			align: 'center',
			render: (status: EXPEDIENT_STATUS) => <>{status.replace('_', ' ')}</>,
		},
		{
			title: 'Asignados',
			key: 'assigned',
			width: 180,
			render: (_, expedient) => (
				<>
					{expedient.assignedLawyer && (
						<UserAvatarName user={expedient.assignedLawyer} title="Abogado" />
					)}
					{expedient.assignedAssistant && (
						<UserAvatarName
							user={expedient.assignedAssistant}
							title="Asistente"
						/>
					)}
				</>
			),
		},
		{
			title: 'Actualizado Por',
			dataIndex: 'updatedByUser',
			key: 'updatedByUser',
			width: 140,
			ellipsis: true,
			render: (user: IUser) => <UserAvatarName user={user} />,
		},
		{
			title: 'Actualizado el',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			width: 130,
			render: (text: Date) => (
				<span
					style={{ textAlign: 'center', textWrap: 'wrap', display: 'flex' }}
				>
					{dateUtil.formatDate(text)}
				</span>
			),
		},
		{
			title: 'Última revisión',
			dataIndex: 'reviews',
			key: 'reviews',
			width: 300,
			render: (reviews: IReview) => (
				<>{htmlReactParser(reviews?.description ?? '')}</>
			),
		},
		{
			title: 'Acciones',
			key: 'actions',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (_, expedient) => (
				<Space>
					<Link to={`/expedients/${expedient.id}/edit`}>
						<Tooltip title="Editar expediente">
							<Button
								icon={<EditOutlined />}
								shape="circle"
								style={{ background: 'var(--ant-blue-2)' }}
								variant="solid"
							/>
						</Tooltip>
					</Link>
					<Link to={`/expedients/${expedient.id}`}>
						<Tooltip title="Ver expediente">
							<Button icon={<SearchOutlined />} shape="circle" />
						</Tooltip>
					</Link>
				</Space>
			),
		},
	]

	return (
		<TableBase>
			<StyledTable<DataType>
				columns={columns}
				dataSource={expedients}
				loading={loading}
				pagination={{
					position: ['topRight'],
					hideOnSinglePage: true,
					onChange: onChangePagination,
				}}
				rowKey={(expedient) => expedient.id}
				scroll={{ x: 1200 }}
			/>
		</TableBase>
	)
}

export default TableExpedients
