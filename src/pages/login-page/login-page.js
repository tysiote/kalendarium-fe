import PropTypes from 'prop-types'
import { useState } from 'react'
import md5 from 'md5'
import { TInput } from '../../components/input'
import { TButton } from '../../components/button'
// import { useImage } from '../../services/use-image'
import { translate as _ } from '../../services/translations'

import './login-page.scss'
import { useCookies } from 'react-cookie'
import { Bars } from 'react-loader-spinner'
import { useDispatch } from 'react-redux'
import {
  changeLevel,
  changeUsername
} from '../../services/redux-reducers/user-settings/user-settings-reducer'

export const LoginPage = ({ onLoginSuccess }) => {
  const [lastUsedUsername, setLastUsedUsername] = useCookies(['lastUsedUsername'])
  const [username, setUsername] = useState(lastUsedUsername?.lastUsedUsername ?? '')
  const [password, setPassword] = useState('')
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)
  // const [image] = useImage('calendar')
  const dispatch = useDispatch()

  const errorLabel = _(['loginPage', error])

  const handleOnUserFailed = () => {
    setError('invalidUsername')
  }

  const handleOnPasswordFailed = () => {
    setError('invalidPassword')
  }

  const handleOnExpired = () => {
    setError('usernameExpired')
  }

  const handleOnLoginSuccess = (data) => {
    dispatch(changeUsername(data.username))
    dispatch(changeLevel(data.level))
    setLastUsedUsername('lastUsedUsername', username)
    onLoginSuccess()
  }

  const handleOnUsernameChange = (newValue) => {
    setError(false)
    setUsername(newValue)
  }

  const handleOnPasswordChange = (newValue) => {
    setError(false)
    setPassword(newValue)
  }

  const handleOnButtonClick = () => {
    const URL = 'https://kalendarium.tasr.sk/public/index.php/login'
    const body2 = {
      username,
      password: 123,
      password_md5: md5(password)
    }
    setFetching(true)

    fetch(URL, {
      headers: { 'content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(body2),
      method: 'POST',
      mode: 'cors',
      credentials: 'include'
    })
      .then((result) => result.json())
      .then((data) => {
        setFetching(false)
        if (data.status.code === 2) {
          handleOnUserFailed()
        }

        if (data.status.code === 3) {
          handleOnPasswordFailed()
        }

        if (data.status.code === 8) {
          handleOnExpired()
        }

        if (data.status.code === 101) {
          handleOnLoginSuccess(data)
        }
      })
  }

  const handleOnKeyDown = (event) => {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      handleOnButtonClick()
    }
  }

  const handleOnRedirectClick = () => {
    window.open('https://kalendarium.tasr.sk/stare', '_blank')
  }

  const buttonDisabled = fetching || !password.length || !username.length

  const buttonLoader = (
    <Bars height={25} width={40} color="#888" wrapperClass="login-button-loader" />
  )

  return (
    <div className="login-page" onKeyDown={handleOnKeyDown}>
      <div className="login-page-content">
        <div className="login-logo-wrapper">
          <div className="login-image">
            {/*<img src={image} alt="Kalendarium image" />*/}
            <img src="https://kalendarium.tasr.sk/assets/calendar.png" alt="Kalendarium image" />
            <h3>{_(['loginPage', 'calendariumLabel'])}</h3>
          </div>
        </div>
        <div className="login-form-wrapper">
          <div className="login-form">
            <div className="login-inputs">
              <TInput
                onChange={handleOnUsernameChange}
                defaultValue={username}
                label={_(['loginPage', 'usernameLabel'])}
              />
              <TInput
                onChange={handleOnPasswordChange}
                defaultValue={password}
                label={_(['loginPage', 'passwordLabel'])}
                type="password"
              />
              <div className="login-error">{errorLabel}</div>
            </div>
            <div className="login-button">
              <TButton
                className={buttonDisabled ? 'disabled' : ''}
                onClick={handleOnButtonClick}
                id="login-button"
                disabled={buttonDisabled}
                variant="standard">
                {fetching && buttonLoader}
                {_(['loginPage', 'proceedLogin'])}
                {fetching && buttonLoader}
              </TButton>
            </div>
            <div className="old-version">
              <TButton onClick={handleOnRedirectClick} id="old-version-redirect-button">
                {_(['loginPage', 'oldVersionLabel'])}
              </TButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
}
