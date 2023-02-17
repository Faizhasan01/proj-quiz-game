import queryValidator from '@/helpers/gameConfig'
import getQuestions from '@/helpers/getQuestions'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../Footer'
import GameInfo from './GameInfo'
import PlayHeader from './PlayHeader'
import Questions from './Questions'
import categories from '@/assets/categories.json'

export default function PlayHome ({ loading, setLoading, setErrorQ, errorQ }) {
	const [questions, setQuestions] = useState([])
	const [queries, setQueries] = useState({})
	const router = useRouter()

	useEffect(() => {
		if (router.isReady) {
			const validQuery = queryValidator(router.query)
			const cate = validQuery.categories.map(cat => categories.find(c => c.id === cat).name)
			setQueries(validQuery)
			getQuestions(cate, validQuery.infinitymode ? 5 : validQuery.questions)
				.then((q) => {
					setQuestions(q)
				}).catch((err) => {
					setErrorQ([true, err])
				}).finally(() => {
					setLoading(false)
				})
		}
		if (!loading) router.reload()
	}, [router.isReady, router.query])

	return (
		<>
			{
				!loading && !errorQ[0] && <>
					<PlayHeader />
					<GameInfo queries={queries} />
					<Questions queries={queries} questions={questions} setQuestions={setQuestions} />
					<Footer alert={true} />
					<style jsx global>
						{`
							body {
								background: url(https://garticphone.com/images/textura.png) 100% 100% no-repeat;
								background-size: cover;
							}
						`}
					</style>
				</>
			}
		</>
	)
}
