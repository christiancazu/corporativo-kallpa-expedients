import { Avatar, Card, Drawer, Typography } from 'antd'
import styled from 'styled-components'

const { Text } = Typography

export const StyledDrawer = styled(Drawer)`
  & .ant-drawer-body {
    padding: var(--ant-padding-md);
  }
`

export const StyledCardNotification = styled(Card)`
  width: 100%;
  & .ant-card-body {
    padding: var(--ant-padding-sm);
  }
`

export const StyledCardNotificationText = styled(Text)<{ $lineClamp?: string }>`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${(p) => p.$lineClamp ?? '1'};
  -webkit-box-orient: vertical;
`

export const StyledNotificationAvatar = styled(Avatar)<{
	$active?: boolean
}>`
  background-color: ${(p) => (p.$active ? 'var(--ant-color-primary)' : '')};
`
