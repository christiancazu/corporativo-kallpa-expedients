import type React from 'react'

import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import {
	EXPEDIENT_TYPE,
	EXPEDIENT_TYPE_COURT_NAME,
	type IExpedient,
	type IReview,
	type IUser,
} from '@expedients/shared'
import {
	Button,
	Space,
	type TableColumnsType,
	type TableProps,
	Tag,
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
	const {
		currentExpedientTypeRoute,
		currentExpedientTypeName,
		currentExpedientTypeCodeName,
	} = useExpedientsState()

	const columns: TableColumnsType<DataType> = [
		{
			title: currentExpedientTypeCodeName,
			dataIndex: 'code',
			key: 'code',
			width: 150,
			render: (text, expedient) => (
				<Link to={`/${currentExpedientTypeRoute}/${expedient.id}`}>
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
									color: 'var(--ant-color-primary)',
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
			render: (_: any, expedient: IExpedient) =>
				expedient.matterType ? (
					<Tag color={expedient.matterType?.color}>
						{expedient.matterType?.description}
					</Tag>
				) : null,
		},
		...(currentExpedientTypeName !== EXPEDIENT_TYPE.CONSULTANCY
			? [
					{
						title: 'Proceso',
						dataIndex: 'processType',
						key: 'processType',
						width: 140,
						render: (_: any, expedient: IExpedient) =>
							expedient.processType?.description,
					},
					{
						title: EXPEDIENT_TYPE_COURT_NAME[currentExpedientTypeRoute],
						dataIndex: 'court',
						key: 'court',
						width: 140,
					},
				]
			: [
					{
						title: 'Entidad',
						dataIndex: 'entity',
						key: 'entity',
						width: 140,
					},

					{
						title: 'Trámite/Consulta',
						dataIndex: 'procedure',
						key: 'procedure',
						width: 140,
					},
				]),
		{
			title: 'Estado',
			dataIndex: 'status',
			key: 'status',
			width: 140,
			align: 'center',
			render: (_, expedient) => <Tag>{expedient.status?.description}</Tag>,
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
					<Link to={`/${currentExpedientTypeRoute}/${expedient.id}/editar`}>
						<Tooltip title="Editar expediente">
							<Button
								icon={<EditOutlined />}
								shape="circle"
								style={{ background: 'var(--ant-blue-2)' }}
								variant="solid"
							/>
						</Tooltip>
					</Link>
					<Link to={`/${currentExpedientTypeRoute}/${expedient.id}`}>
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
