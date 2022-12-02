import { configureStore } from '@reduxjs/toolkit'
import eventTrackerReducer from './redux-reducers/event-tracker/event-tracker-reducer'

export const store = configureStore({
  reducer: {
    eventTracker: eventTrackerReducer
  }
})
