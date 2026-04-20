import { createSlice } from '@reduxjs/toolkit'

export const applicationReducer = createSlice({
  name: 'applicationReducer',
  initialState: {
    version: '3.2.1',
    editingMode: false,
    exportingMode: false,
    showEditors: false,
    openedEvents: [],
    exportedEvents: [],
    events: [],
    filteredEvents: [],
    eventModalId: null,
    eventDeletePower: null,
    statisticsLoaded: false,
    statisticsPassword: ''
  },
  reducers: {
    updateEditingMode: (state, action) => {
      state.editingMode = action.payload
    },
    updateExportingMode: (state, action) => {
      state.exportingMode = action.payload
    },
    updateShowEditors: (state, action) => {
      state.showEditors = action.payload
    },
    updateExportedEvents: (state, action) => {
      state.exportedEvents = action.payload
    },
    updateOpenedEvents: (state, action) => {
      state.openedEvents = action.payload
    },
    updateEvents: (state, action) => {
      state.events = action.payload
    },
    updateFilteredEvents: (state, action) => {
      state.filteredEvents = action.payload
    },
    updateEventModalId: (state, action) => {
      const { id, deletePower } = action.payload ?? {}
      state.eventModalId = id
      state.eventDeletePower = deletePower
    },
    updateStatisticsLoaded: (state, action) => {
      state.statisticsLoaded = action.payload
    },
    updateStatisticsPassword: (state, action) => {
      state.statisticsPassword = action.payload
    }
  }
})

export const {
  updateEditingMode,
  updateExportingMode,
  updateShowEditors,
  updateExportedEvents,
  updateOpenedEvents,
  updateEvents,
  updateEventModalId,
  updateStatisticsLoaded,
  updateStatisticsPassword
} = applicationReducer.actions
export default applicationReducer.reducer
