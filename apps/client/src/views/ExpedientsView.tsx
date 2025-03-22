import type React from 'react'
import { useEffect, useState } from 'react'

import { PlusOutlined } from '@ant-design/icons'
import { IFindExpedientDto } from '@expedients/shared'
import { Form } from 'antd'
import { useNavigate, useSearchParams } from 'react-router'
import FilterExpedients from '../components/ExpedientsFilters'
import TableExpedients from '../components/ExpedientsTable'
import ButtonBase from '../components/base/ButtonBase'
import DocumentDetail from '../components/document/DocumentDetail'
import { useExpedientsState } from '../hooks/useExpedientsState'
import { useExpedientsService } from '../services/expedients.service'
import type { DocumentFile } from './ExpedientView'

const dom = document
let mentions: HTMLElement[] | Element[] = []

const ExpedientsView: React.FC = () => {
	const [_, setSearchParams] = useSearchParams()
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

	const handleSearch = (search: IFindExpedientDto) => {
		const urlSearchParams = new URLSearchParams()

		for (const key in search) {
			const searchKey = key as keyof IFindExpedientDto
			if (search[searchKey]) {
				if (Array.isArray(search[searchKey])) {
					for (const value of search[searchKey] as string[]) {
						urlSearchParams.append(key, value)
					}
				} else {
					urlSearchParams.append(key, search[searchKey] as string)
				}
			}
		}

		setSearchParams(urlSearchParams)

		refetch()
	}

	useEffect(() => {
		if (currentExpedientTypeRoute) refetch()
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
		if (data?.length) {
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
			/>

			<TableExpedients
				expedients={data!}
				loading={isFetching}
				onChangePagination={setupMentionListeners}
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
