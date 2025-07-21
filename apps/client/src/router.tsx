import { EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT } from '@expedients/shared'
import { Spin } from 'antd'
import { lazy, Suspense, useEffect, useMemo } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { queryClient } from './config/queryClient'
import useUserState from './hooks/useUserState'

const VerifyAccount = lazy(() => import('./views/VerifyAccount'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))

const HomeView = lazy(() => import('./views/HomeView'))

const ProfileView = lazy(() => import('./modules/users/views/ProfileView'))

const ExpedientsView = lazy(() => import('./views/ExpedientsView'))
const ExpedientView = lazy(() => import('./views/ExpedientView'))
const SignInView = lazy(() => import('./views/SignInView'))
const NotFoundView = lazy(() => import('./views/NotFoundView'))
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const ExpedientsCreateView = lazy(() => import('./views/ExpedientCreateView'))
const ExpedientsIdEditView = lazy(
  () => import('./modules/expedients/id/ExpedientsIdEditView'),
)

const SessionRoutes: React.FC = () => {
  const { user } = useUserState()
  const location = useLocation()
  const [params, setParams] = useSearchParams()

  if (!user) {
    if (location.pathname === '/auth/sign-in') {
      return <Navigate to={location} />
    }

    let redirect = ''

    const isFromLogout = params.get('logout')

    if (isFromLogout === 'true') {
      setParams((prev) => {
        prev.delete('logout')
        return prev
      })
      window.location.replace('/auth/sign-in')
    } else {
      redirect = `?redirect=${location.pathname}`
    }

    return <Navigate replace to={`/auth/sign-in${redirect}`} />
  }

  return <MainLayout />
}

const AuthRoutes: React.FC = () => {
  const { user } = useUserState()
  const location = useLocation()

  const isValidRoute = useMemo(
    () =>
      ['/auth/sign-in', '/auth/verify-account'].some((r) =>
        location.pathname.includes(r),
      ),
    [location],
  )

  if (user && isValidRoute) {
    return <Navigate replace to="/" />
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}

const ConsultancyViewWrapper = () => {
  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [
          EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT.Asesoría,
          'filters',
        ],
      })
    }
  }, [])

  return <Outlet />
}

const JudicialProcessesViewWrapper = () => {
  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [
          EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT['Procesos judiciales'],
          'filters',
        ],
      })
    }
  }, [])
  return <Outlet />
}

const InvestigationProcessesViewWrapper = () => {
  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [
          EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT['Procesos de investigación'],
          'filters',
        ],
      })
    }
  }, [])
  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <SessionRoutes />,
    errorElement: <NotFoundView />,
    children: [
      {
        index: true,
        handle: 'Inicio',
        element: <HomeView />,
      },
      {
        path: EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT.Asesoría,
        handle: 'asesoria',
        element: <ConsultancyViewWrapper />,
        children: [
          {
            index: true,
            path: '',
            handle: 'Asesoria',
            element: <ExpedientsView />,
          },
          {
            path: 'crear',
            handle: 'Crear asesoría',
            element: <ExpedientsCreateView />,
          },
          {
            path: ':id/editar',
            handle: 'Editar asesoría',
            element: <ExpedientsIdEditView />,
          },
          {
            path: ':id',
            handle: 'Detalle de asesoría',
            element: <ExpedientView />,
          },
        ],
      },
      {
        path: EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT['Procesos judiciales'],
        handle: 'procesos-judiciales',
        element: <JudicialProcessesViewWrapper />,
        children: [
          {
            index: true,
            path: '',
            handle: 'Procesos judiciales',
            element: <ExpedientsView />,
          },
          {
            path: 'crear',
            handle: 'Crear proceso judicial',
            element: <ExpedientsCreateView />,
          },
          {
            path: ':id/editar',
            handle: 'Editar proceso judicial',
            element: <ExpedientsIdEditView />,
          },
          {
            path: ':id',
            handle: 'Detalle de proceso judicial',
            element: <ExpedientView />,
          },
        ],
      },
      {
        path: EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT[
          'Procesos de investigación'
        ],
        handle: 'procesos-de-investigacion',
        element: <InvestigationProcessesViewWrapper />,
        children: [
          {
            index: true,
            path: '',
            handle: 'Procesos de investigación',
            element: <ExpedientsView />,
          },
          {
            path: 'crear',
            handle: 'Crear proceso de investigación',
            element: <ExpedientsCreateView />,
          },
          {
            path: ':id/editar',
            handle: 'Editar proceso de investigación',
            element: <ExpedientsIdEditView />,
          },
          {
            path: ':id',
            handle: 'Detalle de proceso de investigación',
            element: <ExpedientView />,
          },
        ],
      },
      {
        path: 'users/profile',
        handle: 'Perfil',
        element: <ProfileView />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthRoutes />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/auth/sign-in" />,
      },
      {
        path: 'sign-in',
        element: <SignInView />,
      },
      {
        path: 'verify-account',
        element: <VerifyAccount />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundView />,
  },
])

const RouterProviderComponent: React.FC<{
  children?: React.ReactNode
}> = () => (
  <Suspense
    fallback={
      <Spin className="d-flex justify-content-center my-5" size="large" />
    }
  >
    <RouterProvider router={router} />
  </Suspense>
)

export default RouterProviderComponent
