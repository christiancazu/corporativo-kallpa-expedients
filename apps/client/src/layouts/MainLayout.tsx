import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Flex, Grid, Layout, Menu, type MenuProps, theme } from 'antd'
import Text from 'antd/es/typography/Text'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useMatches, useNavigate } from 'react-router'
import asesoriaIcon from '../assets/images/asesoria.png'
import procesosDeInvestigacion from '../assets/images/procesos-de-investigacion.png'
import procesosJudicialesIcon from '../assets/images/procesos-judiciales.png'
import HeaderToolbar from '../components/header/HeaderToolbar'
import NotificationModal from '../components/NotificationModal'
import { StyledAvatar } from '../components/styled/avatar.styled'
import { useExpedientsState } from '../hooks/useExpedientsState'
import { StyledHeader, StyledSider, StyledSiderDrawer } from './styled'

const { Content } = Layout
const { useBreakpoint } = Grid

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const matches = useMatches()
  const screens = useBreakpoint()
  const { currentExpedientTypeRoute } = useExpedientsState()

  const { colorBgLayout } = theme.useToken().token

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [sidebarDrawerAvailabled, setSidebarDrawerAvailabled] = useState(false)
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false)

  const [viewTitle, setViewTitle] = useState('')

  useEffect(() => {
    const handle = matches[matches.length - 1]?.handle || ''
    setViewTitle(handle as string)
  }, [matches])

  useEffect(() => {
    if (screens.md === false) {
      setSidebarCollapsed(true)
      setSidebarDrawerAvailabled(true)
    } else {
      setSidebarDrawerAvailabled(false)
    }
  }, [screens.md])

  useEffect(() => {
    if (!screens.md) {
      setSidebarCollapsed(false)
    }
  }, [])

  const menuItems: MenuProps['items'] = [
    {
      key: '/asesoria',
      icon: React.createElement(() => (
        <img alt="asesoria" width={32} src={asesoriaIcon} className="mr-2" />
      )),
      label: <Link to="/asesoria">Asesoría</Link>,
    },
    {
      key: '/procesos-judiciales',
      icon: React.createElement(() => (
        <img
          alt="empresa"
          width={32}
          src={procesosJudicialesIcon}
          className="mr-2"
        />
      )),
      label: <Link to="/procesos-judiciales">Procesos judiciales</Link>,
    },
    {
      key: '/procesos-de-investigacion',
      icon: React.createElement(() => (
        <img
          alt="empresa"
          width={32}
          src={procesosDeInvestigacion}
          className="mr-2"
        />
      )),
      label: (
        <Link to="/procesos-de-investigacion">Procesos de investigación</Link>
      ),
    },
  ]

  const defaultActiveKey = useMemo(
    () =>
      menuItems.find((i: any) => location.pathname.includes(i.key))
        ?.key as string,
    [location.pathname, currentExpedientTypeRoute],
  )

  return (
    <>
      <Layout className="min-h-screen">
        {!sidebarDrawerAvailabled ? (
          <StyledSider
            collapsible
            collapsed={sidebarCollapsed}
            collapsedWidth="0"
            trigger={null}
            width={230}
          >
            <Flex vertical justify="space-between" className="mt-16 px-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="d-flex flex-column align-items-center justify-content-center my-5 cursor-pointer"
                style={{ background: 'none', border: 'none', padding: 0 }}
                aria-label="Go to home"
              >
                <StyledAvatar
                  size={160}
                  src="https://corporativokallpa.com/images/logo.png"
                />
              </button>

              <Menu
                selectedKeys={[defaultActiveKey]}
                items={menuItems}
                mode="inline"
                style={{ backgroundColor: 'transparent' }}
              />
            </Flex>
          </StyledSider>
        ) : (
          <StyledSiderDrawer
            closeIcon={<MenuFoldOutlined />}
            open={sidebarDrawerOpen}
            placement="left"
            width={288}
            onClose={() => setSidebarDrawerOpen(false)}
          >
            <Flex vertical justify="space-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="d-flex flex-column align-items-center justify-content-center my-5 cursor-pointer"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                  aria-label="Go to home"
                >
                  <StyledAvatar
                    size={160}
                    src="https://corporativokallpa.com/images/logo.png"
                  />
                </button>

                <Menu
                  selectedKeys={[defaultActiveKey]}
                  items={menuItems}
                  mode="inline"
                  style={{ backgroundColor: 'transparent' }}
                  theme="dark"
                  onClick={() => setSidebarDrawerOpen(false)}
                />
              </div>
            </Flex>
          </StyledSiderDrawer>
        )}
        <Layout
          style={{
            marginLeft:
              sidebarCollapsed || !screens.md || sidebarDrawerAvailabled
                ? 0
                : 230,
            transition: 'all .2s ease-in-out, background-color 0s',
          }}
        >
          <StyledHeader $colorBgLayout={colorBgLayout}>
            <Flex align="center" className="w-full" justify="space-between">
              <Flex align="center">
                <Button
                  size="large"
                  icon={
                    sidebarCollapsed ? (
                      <MenuUnfoldOutlined />
                    ) : (
                      <MenuFoldOutlined />
                    )
                  }
                  type="text"
                  className="mx-1"
                  onClick={() => {
                    if (sidebarDrawerAvailabled) {
                      setSidebarCollapsed(false)
                      setSidebarDrawerOpen(true)
                    } else {
                      setSidebarCollapsed(!sidebarCollapsed)
                    }
                  }}
                />
                <Text className={screens.md ? 'text-2xl' : 'text-base'}>
                  {viewTitle}
                </Text>
              </Flex>
              <HeaderToolbar />
            </Flex>
          </StyledHeader>
          <Content className="m-4">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <NotificationModal />
    </>
  )
}

export default MainLayout
