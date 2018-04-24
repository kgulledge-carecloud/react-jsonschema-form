import React from 'react';
import PropTypes from 'prop-types';

import { FormLabel } from '@carecloud/material-cuil';

const REQUIRED_FIELD_SYMBOL = '*';

function TitleField(props) {
  const { id, title, required } = props;
  const legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return (
    <FormLabel id={id} component="legend" className="form-legend">
      {legend}
    </FormLabel>
  );
}

if (process.env.NODE_ENV !== 'production') {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
