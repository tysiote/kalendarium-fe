import PropTypes from 'prop-types'
export const inputShape = PropTypes.shape({
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string
})
