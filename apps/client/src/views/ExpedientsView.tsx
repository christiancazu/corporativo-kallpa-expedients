import { PlusOutlined } from '@ant-design/icons'
import { IFindExpedientDto } from '@expedients/shared'
import { useForm } from 'antd/es/form/Form'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import ButtonBase from '../components/base/ButtonBase'
import DocumentDetail from '../components/document/DocumentDetail'
import FilterExpedients from '../components/ExpedientsFilters'
import TableExpedients from '../components/ExpedientsTable'
import { queryClient } from '../config/queryClient'
import { useExpedientsState } from '../hooks/useExpedientsState'
import { useExpedientsService } from '../services/expedients.service'
import type { DocumentFile } from './ExpedientView'

const dom = document
let mentions: HTMLElement[] | Element[] = []

const getInitialFormValues = (): IFindExpedientDto => ({
  text: null,
  status: null,
  updatedByUser: null,
  matterType: null,
  page: null,
})

const cleanFilterParams = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value))
}

export default function SiniestrosInicioView(): React.ReactNode {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentExpedientTypeRoute, currentExpedientTypeNameSingular } =
    useExpedientsState()

  const location = useLocation()
  const [isLocationReady, setIsLocationReady] = useState(false)

  const navigate = useNavigate()

  const [form] = useForm<IFindExpedientDto>()

  const [documentFile, setDocumentFile] = useState<DocumentFile>({
    id: '',
    showDetail: false,
    showUpload: false,
    isLoading: false,
    action: 'create',
  })

  const { getExpedients } = useExpedientsService()

  const { data = { data: [] }, isFetching, refetch } = getExpedients()

  const handleSearch = (resetPage?: boolean) => {
    setSearchParams((prev) => {
      for (const key in form.getFieldsValue()) {
        const formKey = key as keyof IFindExpedientDto

        const formParam = form.getFieldValue(formKey)

        if (formParam) {
          prev.set(key, form.getFieldValue(formKey)!)
        } else {
          prev.delete(key)
        }
      }

      if (resetPage) {
        prev.delete('page')
        form.setFieldValue('page', null)
      }

      queryClient.setQueryData<IFindExpedientDto>(
        [currentExpedientTypeRoute, 'filters'],
        form.getFieldsValue(),
      )

      return prev
    })

    refetch()
  }

  const handleClearFilters = () => {
    form.resetFields()
    setSearchParams()
  }

  useEffect(() => {
    if (!isLocationReady) return

    const initialFormValues = getInitialFormValues()

    for (const searchKey in initialFormValues) {
      const value = searchParams.get(searchKey)

      if (value !== null) {
        ;(initialFormValues as any)[searchKey] = value
      }
    }

    const storedQueryParams = queryClient.getQueryData<IFindExpedientDto>([
      currentExpedientTypeRoute,
      'filters',
    ])

    const queryParams = cleanFilterParams({
      ...initialFormValues,
      ...storedQueryParams,
    })

    form.setFieldsValue(queryParams)

    handleSearch()
  }, [isLocationReady, location.pathname])

  useEffect(() => {
    setIsLocationReady(true)
  }, [location.pathname])

  const docEventListeners = (event: any) => {
    if (!(event.target instanceof HTMLSpanElement)) {
      return
    }
    setDocumentFile((prev) => ({
      ...prev,
      showDetail: true,
      id: event.target.dataset.id,
    }))
  }

  const setupMentionListeners = () => {
    for (const element of mentions) {
      element.removeEventListener('click', docEventListeners)
    }

    setTimeout(() => {
      mentions = Array.from(dom.getElementsByClassName('doc-mention'))
      for (const element of mentions) {
        element.addEventListener('click', docEventListeners)
      }
    }, 1)
  }

  useEffect(() => {
    if (data.data?.length) {
      setupMentionListeners()
    }

    return () => {
      for (const element of mentions) {
        element.removeEventListener('click', docEventListeners)
      }
    }
  }, [data])

  return (
    <>
      <ButtonBase
        primary
        className="mb-4"
        icon={<PlusOutlined />}
        onClick={() => navigate(`/${currentExpedientTypeRoute}/crear`)}
      >
        Crear {currentExpedientTypeNameSingular}
      </ButtonBase>

      <FilterExpedients
        loading={isFetching}
        form={form}
        onSearch={() => handleSearch(true)}
        onClearFilters={handleClearFilters}
      />

      <TableExpedients
        data={data!}
        loading={isFetching}
        onChangePagination={(page) => {
          form.setFieldValue('page', page)
          handleSearch()
        }}
      />

      {documentFile.showDetail && (
        <DocumentDetail
          documentFile={documentFile}
          setDocumentFile={setDocumentFile}
        />
      )}
    </>
  )
}
