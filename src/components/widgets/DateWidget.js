import React from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from '@carecloud/material-cuil';

const DateWidget = props => {
  const { placeholder, options, ...otherProps } = props;
  const { dateDisplayFormat, timeIntervals } = options;

  return (
    <DatePicker
      {...otherProps}
      placeholderText={placeholder}
      dateDisplayFormat={dateDisplayFormat}
      timeIntervals={timeIntervals}
    />
  );
};

DateWidget.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DateWidget;
