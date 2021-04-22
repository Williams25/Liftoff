import { HeadNext } from '../src/components'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../src/services/axios'
import { convertDurationToTimeString } from '../src/utils/convertDurationToTimeString'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { PlayerContext } from '../src/contexts'
import styles from '../src/styles/home.module.scss'

interface Episode {
  id: string
  title: string
  members: string
  publishedAt: string
  thumbnail: string
  description: string
  file: { url, type, duration, durationAsString }
}

interface HomeProps {
  latestEpisodes: [Episode]
  allEpisodes: [Episode]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const router = useRouter()

  const { play } = useContext(PlayerContext)

  return (
    <>
      <HeadNext title="Podcaster - Home" />
      <div className={styles.homepage}>
        <section className={styles.latestEpisodes}>
          <h2>Ultimos lançamentos</h2>

          <ul>
            {
              latestEpisodes.map((episode: Episode) => {
                return (
                  <li key={episode.id}>
                    <Image
                      width={192}
                      height={192}
                      objectFit="cover"
                      src={episode.thumbnail}
                      alt="thumbnail" />

                    <div className={styles.episodeDetails}>
                      <Link href={`/episodes/${episode.id}`} >
                        {episode.title}
                      </Link>
                      <p>{episode.members}</p>
                      <span>{episode.publishedAt}</span>
                      <span>{episode.file.durationAsString}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => play({
                        duration: episode.file.durationAsString,
                        members: episode.members,
                        thumbnail: episode.thumbnail,
                        title: episode.title,
                        url: episode.file.url
                      })}>
                      <img src="play-green.svg" alt="Tocar episodio" />
                    </button>
                  </li>
                )
              })
            }
          </ul>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {
                allEpisodes.map((episode: Episode) => {
                  return (
                    <tr key={episode.id}>
                      <td>
                        <Image
                          width={120}
                          height={120}
                          objectFit="cover"
                          src={episode.thumbnail}
                          alt={episode.title} />
                      </td>
                      <td>
                        <Link href={`/episodes/${episode.id}`}>
                          {episode.title}
                        </Link>
                      </td>
                      <td>
                        {episode.members}
                      </td>
                      <td style={{ width: 100 }}>
                        {episode.publishedAt}
                      </td>
                      <td>
                        {episode.file.durationAsString}
                      </td>
                      <td>
                        <button type="button">
                          <img src="play-green.svg" alt="Tocar episodio" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      description: episode.description,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      file: {
        url: episode.file.url,
        type: episode.file.type,
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration))
      },
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}