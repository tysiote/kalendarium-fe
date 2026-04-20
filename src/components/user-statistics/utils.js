export const createDataForTable = (data, users) =>
  users?.length
    ? data.map((item) => {
        const log = { ...item }
        if (item.value === 'undefined') {
          log.value = undefined
        }
        log.name = users.find(
          (user) => user['user_id']?.toLowerCase() === item['user_id']?.toLowerCase()
        )?.name

        return log
      })
    : []
