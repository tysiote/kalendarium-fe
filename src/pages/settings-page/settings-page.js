import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate as _ } from '../../services/translations'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { TButton } from '../../components/button'
import { useDispatch, useStore } from 'react-redux'
import { changeLocale } from '../../services/redux-reducers/locale/locale-reducer'
import './settings-page.scss'
import { logUserAction } from '../../services/redux-reducers/user-settings/user-settings-reducer'
import { StatisticsPage } from '../statistics-page'

export const SettingsPage = ({ onBack, onLogout }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const storeLocale = store.getState().locale.locale
  const localUsername = store.getState().userSettings.username
  const localLevel = store.getState().userSettings.level
  const applicationVersion = store.getState().application.version
  const [locale, setLocale] = useState(storeLocale)

  useEffect(() => {
    dispatch(logUserAction({ a: 'settings_page_opened' }))
  }, [])

  const handleOnBack = () => {
    dispatch(logUserAction({ a: 'settings_cancel_clicked' }))
    onBack()
  }

  const handleOnLogout = () => {
    const URL = 'https://kalendarium.tasr.sk/public/index.php/logout'
    fetch(URL, { method: 'POST' })
    onLogout()
  }

  const handleOnLanguageSelect = (event) => {
    const newLocale = event.target.value
    dispatch(logUserAction({ a: 'language_change', v: { newLocale } }))
    setLocale(newLocale)
    dispatch(changeLocale(newLocale))
  }

  return (
    <div className="settings-page">
      <div className="settings-page-container">
        <h2>{_(['settings', 'settingsLabel'])}</h2>

        <h3>{_(['settings', 'applicationLabel'])}</h3>
        <div className="settings-section">
          <div className="application-version">{`${_([
            'settings',
            'applicationVersion'
          ])}: ${applicationVersion}`}</div>
        </div>

        <h3>{_(['settings', 'languageSettingsLabel'])}</h3>
        <div className="settings-section">
          <InputLabel id="language-select-label">
            {_(['settings', 'languageSelectLabel'])}
          </InputLabel>
          <Select
            labelId="language-select-label"
            id="week-select"
            value={locale}
            label="Age"
            onChange={handleOnLanguageSelect}>
            <MenuItem value="sk-SK">{`Slovensky`}</MenuItem>
            <MenuItem value="en-150">{`English`}</MenuItem>
          </Select>
        </div>

        <h3>{_(['settings', 'loginSettingsLabel'])}</h3>
        <div className="settings-section">
          <div>{`${_(['settings', 'loggedInAs'])}: ${localUsername}`}</div>
          <TButton onClick={handleOnLogout} id="settings-logout-button" className="logout-button">
            {_(['settings', 'logout'])}
          </TButton>
        </div>

        {localLevel >= 3 && (
          <>
            <h3>{_(['settings', 'statisticsLabel'])}</h3>
            <p>
              {_([
                'settings',
                localLevel === 3 ? 'statisticsDescriptionLevel3' : 'statisticsDescriptionLevel4'
              ])}
            </p>
            <div className="settings-section">
              <StatisticsPage full={localLevel > 3} />
            </div>
          </>
        )}

        <div className="settings-page-buttons">
          <TButton onClick={handleOnBack} id="back-from-settings-button" className="back-button">
            {_(['settings', 'backFromSettings'])}
          </TButton>
        </div>
      </div>
    </div>
  )
}

SettingsPage.propTypes = {
  onBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
}
