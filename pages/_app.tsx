import '../src/styles/global.scss'
import { Header, Player } from '../src/components'
import { PlayerProvider } from '../src/contexts'
import styles from '../src/styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.appWrapper}>
      <PlayerProvider>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </PlayerProvider>
    </div>
  )
}

export default MyApp
