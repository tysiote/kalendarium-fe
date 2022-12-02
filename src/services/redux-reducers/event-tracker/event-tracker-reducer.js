import { createSlice } from '@reduxjs/toolkit'

export const eventTrackerReducer = createSlice({
  name: 'eventTracker',
  initialState: {
    messages: [],
    archivedMessages: []
  },
  reducers: {
    pushMessage: (state, action) => {
      console.log('using action', state, action)
      state.messages = [...state.messages, action.payload]
    },
    archiveMessages: (state) => {
      state.archivedMessages = [...state.archivedMessages, ...state.messages]
      state.messages = []
    }
  }
})

export const { pushMessage } = eventTrackerReducer.actions
export default eventTrackerReducer.reducer
