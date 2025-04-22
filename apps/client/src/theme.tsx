import { ConfigProvider, theme } from 'antd'
import esEs from 'antd/locale/es_ES'
import type { ReactNode } from 'react'
import useToogleTheme from './hooks/useToogleTheme'

import variables from './assets/styles/_export.module.scss'

const {
	colorBgContainerDark,
	colorBgContainerLight,
	colorBgLayoutDark,
	colorBgLayoutLight,
} = variables
interface Props {
	children: ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
	const { isDarkTheme } = useToogleTheme()

	return (
		<ConfigProvider
			locale={esEs}
			theme={{
				cssVar: true,
				algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					colorPrimary: '#d5b169',
					fontFamily: 'Assistant',
					colorBgLayout: isDarkTheme ? colorBgLayoutDark : colorBgLayoutLight,
					colorBgContainer: isDarkTheme
						? colorBgContainerDark
						: colorBgContainerLight,
				},
				components: {
					Table: {
						cellPaddingInline: 16,
						cellPaddingBlock: 8,
					},
				},
			}}
		>
			{children}
		</ConfigProvider>
	)
}

export default ThemeProvider
