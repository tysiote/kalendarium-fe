import { createSlice } from '@reduxjs/toolkit'
import { sendUserAction } from '../../logging/logging'

export const userSettingsReducer = createSlice({
  name: 'userSettings',
  initialState: {
    level: 1,
    username: ''
  },
  reducers: {
    changeLevel: (state, action) => {
      state.level = action.payload
    },
    changeUsername: (state, action) => {
      state.username = action.payload
    },
    logUserAction: (state, action) => {
      const { a, v } = action.payload
      const user = state.username

      sendUserAction(a, v, user)
    }
  }
})

export const { changeLevel, changeUsername, logUserAction } = userSettingsReducer.actions
export default userSettingsReducer.reducer
