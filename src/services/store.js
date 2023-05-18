import { configureStore } from '@reduxjs/toolkit'
import eventTrackerReducer from './redux-reducers/event-tracker/event-tracker-reducer'
import localeReducer from './redux-reducers/locale/locale-reducer'
import userSettingsReducer from './redux-reducers/user-settings/user-settings-reducer'
import applicationReducer from './redux-reducers/application/application-reducer'

export const store = configureStore({
  reducer: {
    eventTracker: eventTrackerReducer,
    locale: localeReducer,
    userSettings: userSettingsReducer,
    application: applicationReducer
  }
})
