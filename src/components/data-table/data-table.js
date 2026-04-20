import './data-table.scss'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { formatDate, sortLogs } from './utils'
import { translate as _ } from '../../services/translations'

export const DataTable = ({ logs, users }) => {
  const [sortBy, setSortBy] = useState('timestamp')
  const [asc, setAsc] = useState(false)
  const [sortedLogs, setSortedLogs] = useState([])
  const userNeeded = users.length > 1

  useEffect(() => {
    setSortedLogs(sortLogs(logs, sortBy, asc))
  }, [logs, sortBy, asc])

  const handleOnSortClick = (newValue) => {
    if (newValue === sortBy) {
      setAsc(!asc)
    } else {
      setAsc(true)
      setSortBy(newValue)
    }
  }

  const renderOneTh = (thData) => {
    const { key, value } = thData

    const isSorted = sortBy === key
    let icon = null

    if (isSorted) {
      icon = asc ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
    }

    return (
      <th key={`th-${key}`} onClick={() => handleOnSortClick(key)}>
        <div>
          {value}
          {icon}
        </div>
      </th>
    )
  }

  const renderHeader = () => {
    const thData = userNeeded ? [{ key: 'user_id', value: _(['statistics', 'userTableName']) }] : []
    thData.push({ key: 'action', value: _(['statistics', 'userTableAction']) })
    thData.push({ key: 'value', value: _(['statistics', 'userTableValue']) })
    thData.push({ key: 'timestamp', value: _(['statistics', 'userTableTimestamp']) })
    return <tr>{thData.map(renderOneTh)}</tr>
  }

  const renderRow = (data, userNeeded) => {
    const { id, timestamp, name, action, value } = data

    return (
      <tr key={`user-row-${id}`}>
        {userNeeded && (
          <td>
            <div className="no-wrap-cell">{name}</div>
          </td>
        )}
        <td>
          <div>{action}</div>
        </td>
        <td>
          <div>{value}</div>
        </td>
        <td>
          <div className="no-wrap-cell">{formatDate(timestamp)}</div>
        </td>
      </tr>
    )
  }

  return (
    <div className="data-table">
      <table>
        <thead cellPadding={20}>{renderHeader()}</thead>
        <tbody cellPadding={20}>{sortedLogs.map((log) => renderRow(log, userNeeded))}</tbody>
      </table>
    </div>
  )
}

DataTable.propTypes = {
  logs: PropTypes.array,
  users: PropTypes.array
}
