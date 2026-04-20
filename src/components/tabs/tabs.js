import './tabs.scss'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export const Tabs = ({ labels, activeTab, onChange, disabled }) => {
  const handleOnTabClick = (label) => {
    if (label !== activeTab) {
      onChange?.(label)
    }
  }

  return (
    <div className="content-tabs">
      <div className="content-tabs-labels">
        {labels.map((label, idx) => {
          const isDisabled = disabled?.includes(label)

          return (
            <div
              key={`tabs-label-${label}-${idx}`}
              onClick={() => (isDisabled ? undefined : handleOnTabClick(label))}
              className={classNames('content-tabs-label', {
                active: label === activeTab,
                disabled: isDisabled
              })}>
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.arrayOf(PropTypes.string)
}
