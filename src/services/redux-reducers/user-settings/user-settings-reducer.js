import { createSlice } from '@reduxjs/toolkit'

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
    }
  }
})

export const { changeLevel, changeUsername } = userSettingsReducer.actions
export default userSettingsReducer.reducer
