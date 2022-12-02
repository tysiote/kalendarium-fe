import { TButton } from './components/button/t-button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { skSK } from './skSK'
import bgLocale from 'date-fns/locale/bg'
// import skLocale from 'moment/locale/sk'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TButton
          onClick={() => {
            console.log('clicked')
          }}
          id="test-button">
          Click me
        </TButton>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={bgLocale}
          localeText={skSK.components.MuiLocalizationProvider.defaultProps.localeText}>
          <StaticDatePicker
            renderInput={() => <button>calendar button</button>}
            date={new Date()}
            onChange={(newDate) => console.log(newDate)}
            open={true}
          />
        </LocalizationProvider>
      </header>
    </div>
  )
}

export default App
