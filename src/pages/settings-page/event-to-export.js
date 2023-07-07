import React from 'react'
import PropTypes from 'prop-types'
import { TableCell, TableRow } from '@mui/material'
import { formatExportDate, formatExportTags } from '../export-page/utils'

export const EventToExport = ({ data, withEditors, withDescription, withDate }) => {
  const { content, title, tags2, editors, start_time: startTime } = data

  return (
    <TableRow className="event-to-export">
      {withDate && (
        <TableCell align="left">{formatExportDate(new Date(startTime), false, true)}</TableCell>
      )}
      <TableCell align="left">{formatExportDate(new Date(startTime), false)}</TableCell>
      <TableCell align="left">{title}</TableCell>
      {withDescription && <TableCell align="left">{content}</TableCell>}
      <TableCell align="left">{formatExportTags(tags2)}</TableCell>
      {withEditors && <TableCell align="left">{editors}</TableCell>}
    </TableRow>
  )
}

EventToExport.propTypes = {
  data: PropTypes.object.isRequired,
  withEditors: PropTypes.bool.isRequired,
  withDescription: PropTypes.bool.isRequired,
  withDate: PropTypes.bool.isRequired
}
