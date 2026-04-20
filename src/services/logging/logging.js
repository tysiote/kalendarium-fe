export const sendUserAction = (a, v, u) => {
  const value = v !== null && typeof v === 'object' ? JSON.stringify(v) : v
  try {
    fetch('https://kalendarium.tasr.sk/user-action-logger/log.php', {
      method: 'POST',
      body: JSON.stringify({ a, v: `${value}`, u }),
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    })
  } catch (e) {
    console.log(e)
  }
}

export const getStatistics = (password) => {
  return fetch(`https://kalendarium.tasr.sk/user-action-logger/log.php?key=${password}`).then(
    (res) => res.json()
  )
}

export const getStatisticsUsers = (password) => {
  return fetch(
    `https://kalendarium.tasr.sk/user-action-logger/log.php?key=${password}&usersOnly=true`
  ).then((res) => res.json())
}

export const getStatisticsForUsers = (password, users) => {
  const usersUrl = users.map((u, i) => `users[${i}]=${u}`).join('&')

  return fetch(
    `https://kalendarium.tasr.sk/user-action-logger/log.php?key=${password}&${usersUrl}`
  ).then((res) => res.json())
}

export const getStatisticsGeneral = (password) => {
  return fetch(
    `https://kalendarium.tasr.sk/user-action-logger/log.php?key=${password}&general=true`
  ).then((res) => res.json())
}

export const getStatisticsTags = (password) => {
  return fetch(
    `https://kalendarium.tasr.sk/user-action-logger/log.php?key=${password}&tags=true`
  ).then((res) => res.json())
}

export const pingStatistics = (password) => {
  return fetch(
    `https://kalendarium.tasr.sk/user-action-logger/log.php?key=${password}&ping=true`
  ).then((res) => res.json())
}
