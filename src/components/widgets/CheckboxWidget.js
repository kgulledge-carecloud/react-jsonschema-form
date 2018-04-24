import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel, Checkbox } from '@carecloud/material-cuil';

import { getComponentProps } from '../../utils';
import DescriptionField from '../fields/DescriptionField.js';

export function FormCheckbox(props) {
  const { id, value, required, disabled, label, onChange, checked, ...otherProps } = props;

  return (
    <FormControlLabel
      control={<Checkbox id={id} {...otherProps} />}
      required={required}
      disabled={disabled}
      checked={checked}
      value={value}
      onChange={onChange}
      label={label}
    />
  );
}

function CheckboxWidget(props) {
  const { schema, id, value, required, disabled, readonly, label, onChange } = props;

  return (
    <div className={`checkbox ${disabled || readonly ? 'disabled' : ''}`}>
      {schema.description && <DescriptionField description={schema.description} />}

      <FormCheckbox
        id={id}
        required={required}
        disabled={disabled || readonly}
        {...getComponentProps(props)}
        checked={typeof value === 'undefined' ? false : value}
        value={value ? value.toString() : ''}
        onChange={event => onChange(event.target.checked)}
        label={label}
      />
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  FormCheckbox.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
  };

  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
  };
}

export default CheckboxWidget;
