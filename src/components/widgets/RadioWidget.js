import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel, RadioGroup, Radio } from '@carecloud/material-cuil';

import { getComponentProps } from '../../utils';

function RadioWidget(props) {
  const { id, options, value, required, disabled, readonly, onChange } = props;
  const { enumOptions, enumDisabled = [], inline } = options;
  const groupDisabled = disabled || readonly;

  return (
    <RadioGroup
      className="field-radio-group"
      name={id}
      required={required}
      value={value != null ? value.toString() : value}
      row={inline}
      onChange={(event, value) => {
        // BooleanField expects a boolean for the value property
        switch (value) {
          case 'true':
            value = true;
            break;
          case 'false':
            value = false;
            break;
          default:
            break;
        }

        onChange(value);
      }}>
      {enumOptions.map((option, index) => {
        const optionValue = option.value.toString();
        const isDisabled = groupDisabled || enumDisabled.indexOf(option.value) !== -1;

        return (
          <FormControlLabel
            key={index}
            disabled={isDisabled}
            control={<Radio {...getComponentProps(props)} />}
            value={optionValue}
            label={option.label}
          />
        );
      })}
    </RadioGroup>
  );
}

RadioWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  RadioWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };
}
export default RadioWidget;
