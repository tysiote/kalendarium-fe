import { createSlice } from '@reduxjs/toolkit'

export const localeReducer = createSlice({
  name: 'locale',
  initialState: {
    // locale: 'en-150'
    locale: 'sk-SK'
  },
  reducers: {
    changeLocale: (state, action) => {
      state.locale = action.payload
    }
  }
})

export const { changeLocale } = localeReducer.actions
export default localeReducer.reducer
