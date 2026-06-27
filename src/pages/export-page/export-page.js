import React, { useEffect, useRef, useState } from 'react'
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
  TableRow,
  Select,
  MenuItem
} from '@mui/material'
import { translate as _ } from '../../services/translations'
import { TButton } from '../../components/button'
import { EventToExport } from '../settings-page/event-to-export'
import './export-page.scss'
import {
  copyEventsToClipboard,
  createDefaultHeaders,
  getCookieHeaders,
  getDefaultEventsTagsTranslations,
  getJsonExportData,
  technicalExport
} from './utils'
import { useReactToPrint } from 'react-to-print'
import { filterEvents } from '../../components/event-container/utils'
import { logUserAction } from '../../services/redux-reducers/user-settings/user-settings-reducer'
import { useDispatch } from 'react-redux'
import { getCookieValue } from '../login-page/utils'

export const ExportPage = ({ events, filters, onBack, withDate }) => {
  const headers = getCookieHeaders()
  const [withEditors, setWithEditors] = useState(false)
  const [withDescription, setWithDescription] = useState(false)
  const [withHeader, setWithHeader] = useState(false)
  const dispatch = useDispatch()
  const componentRef = useRef()
  const [header, setHeader] = useState(headers?.[0]?.id || null)
  const [printing, setPrinting] = useState(false)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setPrinting(false)
  })

  useEffect(() => {
    dispatch(logUserAction({ a: 'export_page_opened' }))
  }, [])

  useEffect(() => {
    if (!getCookieValue('headers')) {
      createDefaultHeaders()
    }
  }, [])

  const headersData = headers?.find((h) => h.id === header)

  const filteredEvents = filterEvents(filters, events)

  const jsonMessage = _(['export', 'jsonCopied'])

  const eventsTagsTranslations = getDefaultEventsTagsTranslations()

  const headerStyles = { padding: '10px' }

  const handleOnEditorSwitch = () => {
    dispatch(logUserAction({ a: 'editors_export_switch_clicked', v: !withEditors }))
    setWithEditors(!withEditors)
  }

  const handleOnHeaderSwitch = () => {
    dispatch(logUserAction({ a: 'header_export_switch_clicked', v: !withHeader }))
    setWithHeader(!withHeader)
  }

  const handleOnDescriptionSwitch = () => {
    dispatch(logUserAction({ a: 'description_export_switch_clicked', v: !withDescription }))
    setWithDescription(!withDescription)
  }

  const handleOnBackClick = () => {
    dispatch(logUserAction({ a: 'export_page_cancel_clicked' }))
    onBack()
  }

  const handleOnPrintClick = () => {
    dispatch(logUserAction({ a: 'export_print_clicked' }))
    setPrinting(true)
    setTimeout(() => handlePrint(), 100)
  }

  const handleOnJsonClick = () => {
    dispatch(logUserAction({ a: 'export_json_clicked' }))
    getJsonExportData(
      filteredEvents,
      withHeader ? { top: headersData.top, bottom: headersData.bottom } : undefined
    )
    alert(jsonMessage)
  }

  const handleOnTechnicalClick = () => {
    dispatch(logUserAction({ a: 'export_technical_clicked' }))
    technicalExport(
      filteredEvents,
      withDescription,
      withDate,
      withEditors,
      withHeader ? headersData : undefined
    )
  }

  const handleOnCopyClick = () => {
    dispatch(logUserAction({ a: 'export_copy_to_clipboard_clicked' }))
    copyEventsToClipboard({
      events: filteredEvents,
      withDescription,
      withEditors,
      withDate,
      tagsTranslations: eventsTagsTranslations
    })
  }

  const renderWithLineBreaks = (text) =>
    text?.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))

  const renderHeaderSelect = () => {
    const options = []

    return (
      <div>
        <Select value={header} onChange={(e) => setHeader(e.target.value)} disabled={!withHeader}>
          {(headers || options).map((h, idx) => (
            <MenuItem value={h.id} key={idx}>
              {h.label}
            </MenuItem>
          ))}
        </Select>
      </div>
    )
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
          <div className="headers-selector-wrapper">
            <FormControlLabel
              control={
                <Switch
                  onChange={() => handleOnHeaderSwitch()}
                  checked={withHeader}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={`${_(['export', 'withHeaders'])}`}
            />
            {renderHeaderSelect()}
          </div>
        </div>
        <div className="export-table">
          <TableContainer component={Paper} ref={componentRef}>
            {printing && headers && withHeader && (
              <div className="export-headers" style={headerStyles}>
                {renderWithLineBreaks(headersData?.top)}
              </div>
            )}

            <Table sx={{ minWidth: 650 }} aria-label="simple table" id="export-table-to-print">
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

            {printing && headers && withHeader && (
              <div className="export-headers" style={headerStyles}>
                {renderWithLineBreaks(headersData?.bottom)}
              </div>
            )}
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
