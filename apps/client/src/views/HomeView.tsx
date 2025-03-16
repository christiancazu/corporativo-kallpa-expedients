import { Card, Grid } from 'antd'
import Meta from 'antd/es/card/Meta'
import type React from 'react'

import { EXPEDIENT_TYPE } from '@expedients/shared'
import { Flex } from 'antd/lib'
import { useNavigate } from 'react-router'
import asesoriaIcon from '../assets/images/asesoria.png'
import procesosDeInvestigacion from '../assets/images/procesos-de-investigacion.png'
import procesosJudicialesIcon from '../assets/images/procesos-judiciales.png'

const { useBreakpoint } = Grid

const HomeView: React.FC = () => {
	const navigate = useNavigate()
	const screens = useBreakpoint()

	return (
		<Flex justify="center" className="mt-10">
			<Flex
				style={{ maxWidth: 800 }}
				className={screens.md ? 'w-full justify-around mt-10' : 'flex-col'}
			>
				{[
					{
						title: EXPEDIENT_TYPE.CONSULTANCY,
						image: asesoriaIcon,
						to: '/asesoria',
					},
					{
						title: EXPEDIENT_TYPE.JUDICIAL_PROCESSES,
						image: procesosJudicialesIcon,
						to: '/procesos-judiciales',
					},
					{
						title: EXPEDIENT_TYPE.INVESTIGATION_PROCESSES,
						image: procesosDeInvestigacion,
						to: '/procesos-de-investigacion',
					},
				].map((item) => (
					<Card
						className="hover:bg-primary mb-8"
						key={item.title}
						hoverable
						onClick={() => navigate(item.to)}
						style={{ width: 240 }}
						cover={<img alt={item.title} src={item.image} />}
					>
						<Meta className="text-center" title={item.title} />
					</Card>
				))}
			</Flex>
		</Flex>
	)
}

export default HomeView
