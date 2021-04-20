import { HeadNext } from '../src/components'

interface Episode {
  id: string
  title: string
  members: string
  published_at: string
  thumbnail: string
  description: string
}

interface HomeProps {
  episodes: [Episode]
}

export default function Home({ episodes }: HomeProps) {
  return (
    <>
      <HeadNext title="Podcaster - Home" />
    </>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8,
  }
}