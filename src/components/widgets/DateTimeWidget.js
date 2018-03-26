import React from 'react';
import PropTypes from 'prop-types';

import DateWidget from './DateWidget';

const DateTimeWidget = props => <DateWidget {...props} enableTime />;

DateTimeWidget.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DateTimeWidget;
