import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate as _ } from '../../services/translations'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { TButton } from '../../components/button'
import { useDispatch, useStore } from 'react-redux'
import { changeLocale } from '../../services/redux-reducers/locale/locale-reducer'
import './settings-page.scss'

export const SettingsPage = ({ onBack }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const storeLocale = store.getState().locale.locale
  const [locale, setLocale] = useState(storeLocale)

  const handleOnBack = () => {
    onBack()
  }

  const handleOnLanguageSelect = (event) => {
    const newLocale = event.target.value
    setLocale(newLocale)
    dispatch(changeLocale(newLocale))
  }

  return (
    <div className="settings-page">
      <div className="settings-page-container">
        <h2>{_(['settings', 'settingsLabel'])}</h2>
        <InputLabel id="language-select-label">{_(['settings', 'languageSelectLabel'])}</InputLabel>
        <Select
          labelId="language-select-label"
          id="week-select"
          value={locale}
          label="Age"
          onChange={handleOnLanguageSelect}>
          <MenuItem value="sk-SK">{`Slovensky`}</MenuItem>
          <MenuItem value="en-150">{`English`}</MenuItem>
        </Select>
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
  onBack: PropTypes.func.isRequired
}
