import type React from 'react'
import { useEffect, useState } from 'react'

import { PlusOutlined } from '@ant-design/icons'
import { IFindExpedientDto } from '@expedients/shared'
import { Form } from 'antd'
import { useNavigate, useSearchParams } from 'react-router'
import FilterExpedients, {} from '../components/ExpedientsFilters'
import TableExpedients from '../components/ExpedientsTable'
import ButtonBase from '../components/base/ButtonBase'
import DocumentDetail from '../components/document/DocumentDetail'
import { useExpedientsState } from '../hooks/useExpedientsState'
import { useExpedientsService } from '../services/expedients.service'
import type { DocumentFile } from './ExpedientView'

const dom = document
let mentions: HTMLElement[] | Element[] = []

export const getInitialFormValues = () => ({
	text: null,
	status: null,
	updatedByUser: null,
	matterType: null,
})

const ExpedientsView: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const { currentExpedientTypeRoute, currentExpedientTypeNameSingular } =
		useExpedientsState()

	const navigate = useNavigate()
	const [form] = Form.useForm<IFindExpedientDto>()
	const [documentFile, setDocumentFile] = useState<DocumentFile>({
		id: '',
		showDetail: false,
		showUpload: false,
		isLoading: false,
		action: 'create',
	})

	const { getExpedients } = useExpedientsService()

	const { data, isFetching, refetch } = getExpedients

	const handleSearch = () => {
		setSearchParams((prev) => {
			for (const key in form.getFieldsValue()) {
				const formKey = key as keyof IFindExpedientDto
				const formParam = form.getFieldValue(formKey)

				if (formParam) {
					if (Array.isArray(formParam)) {
						for (const formParamValue of formParam as string[]) {
							prev.append(key, formParamValue)
						}
					} else {
						prev.set(key, form.getFieldValue(formKey)!)
					}
				} else {
					prev.delete(key)
				}
			}

			return prev
		})

		refetch()
	}

	const handleClearFilters = () => {
		form.resetFields()
		setSearchParams()
	}

	useEffect(() => {
		if (currentExpedientTypeRoute) {
			const initialFormValues = getInitialFormValues()
			for (const searchKey in initialFormValues) {
				let value: string | string[] | null = null

				if (
					Array.isArray(initialFormValues[searchKey as keyof IFindExpedientDto])
				) {
					value = searchParams.getAll(searchKey)
				} else {
					value = searchParams.get(searchKey)
				}

				initialFormValues[searchKey as keyof IFindExpedientDto] =
					value as unknown as any
			}

			form.setFieldsValue(initialFormValues)

			refetch()
		}
	}, [currentExpedientTypeRoute])

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
				onSearch={handleSearch}
				onClearFilters={handleClearFilters}
			/>

			<TableExpedients
				data={data!}
				loading={isFetching}
				onChangePagination={(page) => {
					setSearchParams((prev) => {
						prev.set('page', page.toString())
						return prev
					})
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

export default ExpedientsView
