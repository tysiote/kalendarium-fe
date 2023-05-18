import { Main } from './main'
import { useState, useEffect } from 'react'
import { LoginPage } from './pages/login-page'
import { ThreeDots } from 'react-loader-spinner'

import './app.scss'
import './fonts/GothamLight.otf'
import { useDispatch } from 'react-redux'
import {
  changeLevel,
  changeUsername
} from './services/redux-reducers/user-settings/user-settings-reducer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fetching, setFetching] = useState(true)
  const dispatch = useDispatch()
  // const [fetching] = useState(true)

  useEffect(() => {
    const URL = 'https://kalendarium.tasr.sk/public/index.php/ping'
    fetch(URL, {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      body: '',
      headers: { 'content-type': 'application/json' }
    })
      .then((result) => result.json())
      .then((data) => {
        setFetching(false)
        if (data.status.code === 1) {
          setIsLoggedIn(false)
        }

        if (data.status.code === 100) {
          dispatch(changeUsername(data.username))
          dispatch(changeLevel(data.level))
          setIsLoggedIn(true)
        }
      })
  }, [])

  const handleOnLoginSuccess = (value) => {
    setIsLoggedIn(value)
  }

  const renderLoading = () => {
    return (
      <div className="loading-login-wrapper">
        <ThreeDots height={200} width={200} color="#202c8a" />
      </div>
    )
  }

  const renderContent = () => {
    if (isLoggedIn) {
      return <Main onLogout={() => handleOnLoginSuccess(false)} />
    }

    return <LoginPage onLoginSuccess={() => handleOnLoginSuccess(true)} />
  }

  return <div className="App">{fetching ? renderLoading() : renderContent()}</div>
}

export default App
