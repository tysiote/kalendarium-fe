import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TButton } from '../../components/button'
import { translate as _ } from '../../services/translations'
import { TInput } from '../../components/input'
import { pingStatistics } from '../../services/logging/logging'
import {
  updateStatisticsLoaded,
  updateStatisticsPassword
} from '../../services/redux-reducers/application/application-reducer'
import classNames from 'classnames'
import './statistics-page.scss'
import { Tabs } from '../../components/tabs'
import { UserStatistics } from '../../components/user-statistics'
import { GeneralStatistics } from '../../components/general-statistics'
import { logUserAction } from '../../services/redux-reducers/user-settings/user-settings-reducer'
import PropTypes from 'prop-types'

export const StatisticsPage = ({ full = false }) => {
  const STATISTICS_CONTENT_TABS_LABELS = [
    _(['statistics', 'generalStatistics']),
    _(['statistics', 'advancedStatistics'])
  ]
  if (full) {
    STATISTICS_CONTENT_TABS_LABELS.push(_(['statistics', 'userStatistics']))
  }

  const [password, setPassword] = useState('')
  const isLoaded = useSelector((state) => state.application.statisticsLoaded)
  const statisticsSavedPassword = useSelector((state) => state.application.statisticsPassword)
  const [loading, setLoading] = useState(false)
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(STATISTICS_CONTENT_TABS_LABELS[0])
  const dispatch = useDispatch()

  const handleOnPasswordSubmit = async () => {
    if (password?.length) {
      setLoading(true)
      await pingStatistics(password).then((result) => {
        setLoading(false)
        if (result.status === 'OK') {
          setIncorrectPassword(false)
          dispatch(updateStatisticsPassword(password))
          dispatch(updateStatisticsLoaded(true))
          dispatch(logUserAction({ a: 'statistics_showed' }))
        } else {
          setIncorrectPassword(true)
          dispatch(updateStatisticsLoaded(false))
        }
      })
    }
  }

  const handleOnPasswordChange = (newValue) => {
    setPassword(newValue)
  }

  const handleOnPasswordInputFocus = () => {
    setIncorrectPassword(false)
  }

  const handleOnTabChange = (newTabLabel) => {
    setActiveTab(newTabLabel)
  }

  const renderData = () => {
    if (!statisticsSavedPassword) {
      return null
    }

    return (
      <div>
        <Tabs
          labels={STATISTICS_CONTENT_TABS_LABELS}
          activeTab={activeTab}
          onChange={handleOnTabChange}
          disabled={[STATISTICS_CONTENT_TABS_LABELS[1]]}
        />
      </div>
    )
  }

  const renderPasswordForm = () => {
    if (isLoaded) {
      return null
    }

    return (
      <div className="statistics-page-password-form">
        <div className="password-form">
          <TInput
            onChange={handleOnPasswordChange}
            value={password}
            type="password"
            placeholder={_(['statistics', 'insertStatisticsPassword'])}
            disabled={loading || isLoaded}
            onFocus={handleOnPasswordInputFocus}
            className="password-input"
          />
          <TButton
            onClick={handleOnPasswordSubmit}
            id="statistics-page-password-submit-button"
            disabled={loading}>
            {_(['statistics', loading ? 'loadingStatistics' : 'submitStatisticsPassword'])}
          </TButton>
        </div>

        <div
          className={classNames('statistics-incorrect-password', { visible: incorrectPassword })}>
          {_(['statistics', 'incorrectStatisticsPassword'])}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (!isLoaded) {
      return null
    }

    if (activeTab === STATISTICS_CONTENT_TABS_LABELS[0]) {
      return renderGeneralStatistics()
    }

    if (activeTab === STATISTICS_CONTENT_TABS_LABELS[2]) {
      return renderUserStatistics()
    }

    return null
  }

  const renderUserStatistics = () => <UserStatistics />

  const renderGeneralStatistics = () => <GeneralStatistics />

  return (
    <div className="statistics-page">
      {renderPasswordForm()}
      {renderData()}
      {renderContent()}
    </div>
  )
}

StatisticsPage.propTypes = {
  full: PropTypes.bool
}
