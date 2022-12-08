import { configureStore } from '@reduxjs/toolkit'
import eventTrackerReducer from './redux-reducers/event-tracker/event-tracker-reducer'
import localeReducer from './redux-reducers/locale/locale-reducer'

export const store = configureStore({
  reducer: {
    eventTracker: eventTrackerReducer,
    locale: localeReducer
  }
})
