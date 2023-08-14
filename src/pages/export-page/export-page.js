import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { translate as _ } from '../../services/translations'
import { TButton } from '../../components/button'
import { EventToExport } from '../settings-page/event-to-export'
import './export-page.scss'
import {
  copyEventsToClipboard,
  getDefaultEventsTagsTranslations,
  getJsonExportData,
  technicalExport
} from './utils'
import { useReactToPrint } from 'react-to-print'
import { filterEvents } from '../../components/event-container/utils'

export const ExportPage = ({ events, filters, onBack, withDate }) => {
  const [withEditors, setWithEditors] = useState(false)
  const [withDescription, setWithDescription] = useState(false)
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  const filteredEvents = filterEvents(filters, events)

  const jsonMessage = _(['export', 'jsonCopied'])

  const eventsTagsTranslations = getDefaultEventsTagsTranslations()

  const handleOnEditorSwitch = () => {
    setWithEditors(!withEditors)
  }

  const handleOnDescriptionSwitch = () => {
    setWithDescription(!withDescription)
  }

  const handleOnBackClick = () => {
    onBack()
  }

  const handleOnPrintClick = () => {
    handlePrint()
  }

  const handleOnJsonClick = () => {
    getJsonExportData(filteredEvents)
    alert(jsonMessage)
  }

  const handleOnTechnicalClick = () => {
    technicalExport(filteredEvents, withDescription, withDate)
  }

  const handleOnCopyClick = () => {
    copyEventsToClipboard({
      events: filteredEvents,
      withDescription,
      withEditors,
      withDate,
      tagsTranslations: eventsTagsTranslations
    })
  }

  return (
    <div className="export-page">
      <div className="export-page-container">
        <div className="export-actions">
          <div className="export-buttons-wrapper">
            <TButton
              onClick={handleOnCopyClick}
              id="export-button-copy"
              className="export-action-button">
              {_(['export', 'copyEvents'])}
            </TButton>
            <TButton
              onClick={handleOnTechnicalClick}
              id="export-button-technical"
              className="export-action-button">
              {_(['export', 'technicalExport'])}
            </TButton>
            <TButton
              onClick={handleOnJsonClick}
              id="export-button-json"
              className="export-action-button">
              {_(['export', 'jsonExport'])}
            </TButton>
            <TButton
              onClick={handleOnPrintClick}
              id="export-button-print"
              className="export-action-button">
              {_(['export', 'printExport'])}
            </TButton>
          </div>
        </div>
        <div className="events-controls">
          <FormControlLabel
            control={
              <Switch
                onChange={() => handleOnEditorSwitch()}
                checked={withEditors}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={`${_(['export', 'withEditors'])}`}
          />
          <FormControlLabel
            control={
              <Switch
                onChange={() => handleOnDescriptionSwitch()}
                checked={withDescription}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={`${_(['export', 'withDescription'])}`}
          />
        </div>
        <div className="export-table">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              id="export-table-to-print"
              ref={componentRef}>
              <TableHead>
                <TableRow>
                  {withDate && <TableCell>{_(['export', 'day'])}</TableCell>}
                  <TableCell>{_(['export', 'time'])}</TableCell>
                  <TableCell>{_(['export', 'event'])}</TableCell>
                  {withDescription && <TableCell>{_(['export', 'description'])}</TableCell>}
                  <TableCell>{_(['export', 'method'])}</TableCell>
                  {withEditors && <TableCell>{_(['export', 'editors'])}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((evt) => (
                  <EventToExport
                    withEditors={withEditors}
                    data={evt}
                    withDescription={withDescription}
                    withDate={withDate}
                    key={`event-to-export-${evt.id}`}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="export-page-buttons">
          <TButton onClick={handleOnBackClick} id="back-from-export-button" className="back-button">
            {_(['export', 'backFromExport'])}
          </TButton>
        </div>
      </div>
    </div>
  )
}

ExportPage.propTypes = {
  events: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  withDate: PropTypes.bool.isRequired,
  filters: PropTypes.object
}

ExportPage.defaultProps = {
  filters: {}
}
