import { createSlice } from '@reduxjs/toolkit'

export const applicationReducer = createSlice({
  name: 'applicationReducer',
  initialState: {
    version: '3.0.1',
    editingMode: false,
    exportingMode: false,
    showEditors: false,
    openedEvents: [],
    exportedEvents: [],
    events: [],
    filteredEvents: [],
    eventModalId: null,
    eventDeletePower: null
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
      console.log('updating event modal', action.payload)
      const { id, deletePower } = action.payload ?? {}
      state.eventModalId = id
      state.eventDeletePower = deletePower
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
  updateEventModalId
} = applicationReducer.actions
export default applicationReducer.reducer
