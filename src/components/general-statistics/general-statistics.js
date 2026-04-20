import './general-statistics.scss'
import { useEffect, useState } from 'react'
import { getStatisticsGeneral, getStatisticsTags } from '../../services/logging/logging'
import { useSelector } from 'react-redux'
import { translate as _ } from '../../services/translations'
import classNames from 'classnames'
import { capitalize, getThisMonthAndYearName } from './utils'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export const GeneralStatistics = () => {
  const [generalData, setGeneralData] = useState({})
  const [tagsData, setTagsData] = useState({})
  const password = useSelector((state) => state.application.statisticsPassword)

  useEffect(() => {
    getStatisticsGeneral(password).then((result) => {
      setGeneralData(result.data)
    })

    getStatisticsTags(password).then((result) => {
      setTagsData(result.data)
    })
  }, [])

  const renderChart = () => {
    if (!Object.keys(generalData ?? {}).length) {
      return null
    }

    const data = {
      labels: [
        _(['statistics', 'futureEvents']),
        _(['statistics', 'pastEvents']),
        _(['statistics', 'deletedSoftEvents']),
        _(['statistics', 'deletedHardEvents'])
      ],
      datasets: [
        {
          label: _(['statistics', 'numberOfEvents']),
          data: [
            generalData[`monthFutureEvents`] ?? 0,
            generalData[`monthPastEvents`] ?? 0,
            generalData[`monthSoftDeletedEvents`] ?? 0,
            generalData[`monthHardDeletedEvents`] ?? 0
          ],
          backgroundColor: ['#64B5F6', '#81C784', '#FFA726', '#EF9A9A'],
          borderColor: ['#2196F3', '#4CAF50', '#FFA000', '#EC407A'],
          borderWidth: 1
        }
      ]
    }

    return (
      <>
        <h2>{`${capitalize(getThisMonthAndYearName())}`}</h2>
        <div className="general-chart-container">
          <div className="general-chart-wrapper">
            <Doughnut data={data} />
          </div>
        </div>
      </>
    )
  }

  const renderDataChunk = (timescale) => {
    let key = timescale === 'month' ? 'month' : 'year'
    let tagKey = timescale === 'month' ? 'current' : 'year'

    if (timescale === 'allTime') {
      key = 'allTime'
      tagKey = 'allTime'
    }

    const tag1Key = capitalize(Object.keys(tagsData?.tags1?.[tagKey] ?? {})[0] || '')
    const tag1Value = Object.values(tagsData?.tags1?.[tagKey] ?? {})[0] ?? ''
    const tag1Text = tag1Value
      ? `${_(['statistics', `filterMethod${tag1Key}`])} (${tag1Value})`
      : _(['statistics', 'loadingValue'])

    const tag2Key = capitalize(Object.keys(tagsData?.tags2?.[tagKey] ?? {})[0] || '')
    const tag2Value = Object.values(tagsData?.tags2?.[tagKey] ?? {})[0] ?? ''
    const tag2Text = tag2Value
      ? `${_(['filters', `filterOutputMethod${tag2Key}`])} (${tag2Value})`
      : _(['statistics', 'loadingValue'])

    const tag3Key = (Object.keys(tagsData?.tags3?.[tagKey] ?? {})[0] || '').toUpperCase()
    const tag3Value = Object.values(tagsData?.tags3?.[tagKey] ?? {})[0] ?? ''
    const tag3Text = tag3Value
      ? `${_(['filters', `filterLocation${tag3Key}`])} (${tag3Value})`
      : _(['statistics', 'loadingValue'])

    return (
      <div className={classNames('general-statistics-chunk', key, { mainChunk: key === 'month' })}>
        <h3>{_(['statistics', `${key}Label`])}</h3>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">{_(['statistics', 'addedEvents'])}:</div>
          <div className="general-statistics-info-value">
            {generalData[`${key}AddedEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">{_(['statistics', 'editedEvents'])}:</div>
          <div className="general-statistics-info-value">
            {generalData[`${key}EditedEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">
            {_(['statistics', 'deletedSoftEvents'])}:
          </div>
          <div className="general-statistics-info-value">
            {generalData[`${key}SoftDeletedEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">
            {_(['statistics', 'deletedHardEvents'])}:
          </div>
          <div className="general-statistics-info-value">
            {generalData[`${key}HardDeletedEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">{_(['statistics', 'totalEvents'])}:</div>
          <div className="general-statistics-info-value">
            {generalData[`${key}TotalEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>

        <div className="general-statistics-info">
          <div className="general-statistics-info-title">{_(['statistics', 'futureEvents'])}:</div>
          <div className="general-statistics-info-value">
            {generalData[`${key}FutureEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">{_(['statistics', 'pastEvents'])}:</div>
          <div className="general-statistics-info-value">
            {generalData[`${key}PastEvents`] ?? _(['statistics', 'loadingValue'])}
          </div>
        </div>

        <div className="general-statistics-info">
          <div className="general-statistics-info-title">
            {_(['filters', 'filterMethodLabel'])}:
          </div>
          <div className="general-statistics-info-value">{tag1Text}</div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">
            {_(['filters', 'filterOutputMethodLabel'])}:
          </div>
          <div className="general-statistics-info-value">{tag2Text}</div>
        </div>
        <div className="general-statistics-info">
          <div className="general-statistics-info-title">
            {_(['filters', 'filterLocationLabel'])}:
          </div>
          <div className="general-statistics-info-value">{tag3Text}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="general-statistics">
      {renderChart()}
      <div className="chunks-wrapper">
        {renderDataChunk('month')}
        {renderDataChunk('year')}
        {renderDataChunk('allTime')}
      </div>
    </div>
  )
}
