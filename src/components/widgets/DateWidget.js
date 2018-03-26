import React from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from '@carecloud/material-cuil';

const DateWidget = props => {
  const { dateDisplayFormat } = props.options;

  return <DatePicker {...props} dateDisplayFormat={dateDisplayFormat} />;
};

DateWidget.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DateWidget;
