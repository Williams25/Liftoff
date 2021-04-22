import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../src/services/axios'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../src/utils/convertDurationToTimeString'
import { useRouter } from 'next/router'
import { HeadNext } from '../../src/components'
import Image from 'next/image'
import styles from '../../src/styles/episode.module.scss'

interface Episode {
  id: string
  title: string
  members: string
  publishedAt: string
  thumbnail: string
  description: string
  file: { url, type, duration, durationAsString }
}

interface EpisodeProps {
  episode: Episode
}

const Episodes = ({ episode }: EpisodeProps) => {
  const router = useRouter()

  const handleToBack = () => router.push('/')

  return (
    <div className={styles.episode}>
      <HeadNext title="Podcaster - Episode" />
      <div className={styles.thumbnailCpntainer}>
        <button type="button" onClick={handleToBack}>
          <img src="/arrow-left.svg" alt="voltar" />
        </button>

        <Image
          width={700}
          height={162}
          objectFit="cover"
          src={episode.thumbnail}
          alt="thumbnail"
        />

        <button type="button">
          <img src="/play.svg" alt="voltar" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.file.durationAsString}</span>
      </header>

      <div className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export default Episodes

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(path => {
    return {
      params: {
        slug: path.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params
  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    description: data.description,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    file: {
      url: data.file.url,
      type: data.file.type,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration))
    },
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24
  }
}