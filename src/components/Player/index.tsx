import { useContext, useRef, useEffect } from 'react'
import { PlayerContext } from '../../contexts'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import Image from 'next/image'
import styles from './styles.module.scss'

export const Player = () => {

  const { currentEpisodeIndex, episodeList, isPlaying, togglePlay, setPlayignSate } = useContext(PlayerContext)
  const episode = episodeList[currentEpisodeIndex]

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {
        episode ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              objectFit="cover"
              src={episode.thumbnail}
              alt="thumbnail"
            />

            <strong>
              {episode.title}
            </strong>

            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {
              episode ? (
                <Slider
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                />
              ) :
                (
                  <div className={styles.emptySlider} />
                )
            }
          </div>
          <span>{episode ? episode.duration : '00:00'}</span>
        </div>

        {
          episode && (
            <audio
              src={episode.url}
              autoPlay={true}
              ref={audioRef}
              onPlay={() => setPlayignSate(true)}
              onPause={() => setPlayignSate(false)}
            />
          )
        }

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!episode}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {
              isPlaying ? (
                <img src="/pause.svg" alt="Tocar" />
              ) : (
                <img src="/play.svg" alt="Tocar" />
              )
            }
          </button>

          <button
            type="button"
            disabled={!episode}
          >
            <img src="/play-next.svg" alt="Proximo" />
          </button>

          <button
            type="button"
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}