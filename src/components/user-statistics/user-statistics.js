import './user-statistics.scss'
import { useEffect, useState } from 'react'
import { getStatisticsForUsers, getStatisticsUsers } from '../../services/logging/logging'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { DataTable } from '../data-table'
import { createDataForTable } from './utils'

export const UserStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const password = useSelector((state) => state.application.statisticsPassword)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    getStatisticsUsers(password).then((result) => {
      setLoading(false)
      setUsers(result.data)
    })
  }, [])

  useEffect(() => {
    if (selectedUsers.length) {
      getStatisticsForUsers(
        password,
        selectedUsers.map((u) => u.value)
      ).then((result) => setUsersData(result.data))
    }
  }, [selectedUsers])

  const handleOnUsersSelect = (selectedUsers) => {
    setSelectedUsers(selectedUsers)
  }

  const renderSelect = () => {
    if (!users.length) {
      return null
    }
    const options = users
      .filter((u) => u['user_id'])
      .map((user) => ({ value: user['user_id'], label: user.name || user['user_id'] }))

    return (
      <div className="select-users-wrapper">
        <Select
          options={options}
          closeMenuOnSelect={false}
          isMulti
          onChange={handleOnUsersSelect}
        />
      </div>
    )
  }

  const renderUsersData = () => {
    if (!usersData.length) {
      return null
    }

    const logs = selectedUsers.length ? createDataForTable(usersData, users) : []

    return <DataTable logs={logs} users={selectedUsers} />
  }

  return (
    <div className="user-statistics">
      {loading && <div>Loading...</div>}
      {renderSelect()}
      {renderUsersData()}
    </div>
  )
}
