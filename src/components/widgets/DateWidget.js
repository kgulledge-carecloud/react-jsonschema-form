import React from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from '@carecloud/material-cuil';

const DateWidget = props => {
  return <DatePicker {...props} />;
};

DateWidget.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DateWidget;
