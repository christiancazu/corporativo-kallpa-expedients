import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import {
  EXPEDIENT_TYPE,
  EXPEDIENT_TYPE_COURT_NAME,
  type IExpedient,
  IPaginationDto,
  type IReview,
  type IUser,
} from '@expedients/shared'
import {
  Button,
  Divider,
  Flex,
  Space,
  type TableColumnsType,
  type TableProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import htmlReactParser from 'html-react-parser'
import type React from 'react'
import { Link } from 'react-router'
import { useExpedientsState } from '../hooks/useExpedientsState'
import UserAvatarName from '../modules/shared/components/UserAvatarName'
import { dateUtil, limitString } from '../utils'
import { StyledTable } from './styled/table.styled'

const { Text } = Typography

type DataType = {
  dataIndex?: string
} & IExpedient

type Props = {
  data: IPaginationDto<IExpedient>
  onChangePagination: (page: number) => void
} & TableProps

const TableExpedients: React.FC<Props> = ({
  data,
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
      width: 220,
      render: (text, expedient) => (
        <Link to={`/${currentExpedientTypeRoute}/${expedient.id}`}>
          <Tooltip title={text}>
            <Button
              className="text-left"
              style={{ width: '212px', paddingLeft: 0, paddingRight: 4 }}
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
      dataIndex: 'matterType',
      key: 'matterType',
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
      render: (_, expedient) =>
        expedient.status?.description !== 'Otros' ? (
          <Tag>{expedient.status?.description}</Tag>
        ) : (
          <span>{expedient.statusDescription}</span>
        ),
    },
    {
      title: 'Partes',
      dataIndex: 'parts',
      key: 'parts',
      width: 180,
      align: 'center',
      render: (_, expedient) => (
        <>
          {expedient.parts?.map((part, i) => (
            <Flex vertical key={part.id} className="text-left text-wrap">
              <Text className="font-bold text-xs">
                {currentExpedientTypeName !== EXPEDIENT_TYPE.CONSULTANCY
                  ? part.type?.description
                  : part.typeDescription}
              </Text>
              <Text>{part.name}</Text>

              {expedient.parts?.length - 1 !== i && (
                <Divider className="my-1" variant="dashed" />
              )}
            </Flex>
          ))}
        </>
      ),
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
          {expedient.assignedLawyer && expedient.assignedAssistant && (
            <Divider className="my-1" variant="dashed" />
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
      render: (reviews: IReview) => {
        return (
          <Tooltip title={htmlReactParser(reviews?.description ?? '')}>
            {htmlReactParser(limitString(reviews?.description))}
          </Tooltip>
        )
      },
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
            <Tooltip title="Editar">
              <Button
                icon={<EditOutlined />}
                shape="circle"
                style={{ background: 'var(--ant-blue-2)' }}
                variant="solid"
              />
            </Tooltip>
          </Link>
          <Link to={`/${currentExpedientTypeRoute}/${expedient.id}`}>
            <Tooltip title="Ver detalle">
              <Button icon={<SearchOutlined />} shape="circle" />
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ]

  return (
    <StyledTable<DataType>
      columns={columns}
      dataSource={data.data}
      loading={loading}
      pagination={{
        defaultCurrent: 1,
        current: data.pagination?.page ?? 1,
        total: data.pagination?.totalCount ?? 0,
        position: ['topRight'],
        hideOnSinglePage: true,
        onChange: onChangePagination,
      }}
      rowKey={(expedient) => expedient.id}
      scroll={{ x: 1200 }}
    />
  )
}

export default TableExpedients
