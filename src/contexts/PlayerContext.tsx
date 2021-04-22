import { createContext, ReactNode, useState } from 'react'

interface Episode {
  title: string
  members: string,
  thumbnail: string,
  duration: string,
  url: string
}

interface PlayerContextData {
  episodeList: Array<Episode>
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episodeList: Episode) => void
  togglePlay: () => void
  setPlayignSate: (state: boolean) => void
}

interface PlayerProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const play = (episodeList: Episode) => {
    setEpisodeList([episodeList])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const setPlayignSate = (state: boolean) => {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayignSate
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}