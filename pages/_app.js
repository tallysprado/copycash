import '../styles/globals.scss'
import '../components/Navbar/styles.scss'
import '../components/Landing/styles.scss'
import '../components/Sobre/styles.scss'
import '../components/Login/styles.scss'

import store from '../store'
import {Provider} from 'react-redux'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>

  )
}

export default MyApp
