import { Drawer } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'

export const StyledSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  inset-inline-start: 0;
  top: 0;
  z-index: 1;
  bottom: 0;
  background-color: var(--ant-color-primary);
  scrollbar-width: 'thin';
  scrollbar-gutter: 'stable';
  transition: min-width .2s ease-in-out, width .2s ease-in-out, max-width .2s ease-in-out;

  & .ant-menu-item {
    color: var(--ant-color-text-light-solid) !important;
    padding: var(--ant-padding-xs) !important;

    &-selected {
      background-color: var(--color-bg-app) !important;
    }
  }
`

export const StyledHeader = styled(Header)<{ $colorBgLayout: string }>`
  position: sticky;
  top: 0;
  z-index: 3;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${($props) => $props.$colorBgLayout};
  padding: 0;
`
export const StyledSiderDrawer = styled(Drawer)`
  background: var(--ant-color-primary) !important;
  
  & .ant-drawer-header-title {
    justify-content: end;
  }

  & .ant-drawer-close {
    color: var(--ant-color-text-light-solid);
    font-size: 1.5rem;
  }

  & .ant-menu-item {
    color: var(--ant-color-text-light-solid) !important;
    padding: var(--ant-padding-xs) !important;

    &-selected {
      background-color: var(--color-bg-app) !important;
    }
  }
`
