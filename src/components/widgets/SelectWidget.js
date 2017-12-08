import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@carecloud/material-cuil";

import { asNumber } from "../../utils";

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, value) {
  if (value === "") {
    return undefined;
  } else if (
    type === "array" &&
    items &&
    ["number", "integer"].includes(items.type)
  ) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  return value;
}

function getValue(event, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else {
    return event.target.value;
  }
}

function SelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    label,
    required,
    disabled,
    readonly,
    multiple,
    onChange,
    onBlur,
    onFocus,
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : "";

  return (
    <FormControl disabled={disabled || readonly} required={required}>
      <InputLabel htmlFor={id}>{label}</InputLabel>

      <Select
        id={id}
        value={typeof value === "undefined" ? emptyValue : value}
        label={label}
        multiple={multiple}
        disabled={disabled || readonly}
        required={required}
        onBlur={
          onBlur &&
          (event => {
            const newValue = getValue(event, multiple);
            onBlur(id, processValue(schema, newValue));
          })
        }
        onFocus={
          onFocus &&
          (event => {
            const newValue = getValue(event, multiple);
            onFocus(id, processValue(schema, newValue));
          })
        }
        onChange={event => {
          const newValue = getValue(event, multiple);
          onChange(processValue(schema, newValue));
        }}>
        {enumOptions.map(({ value, label }, index) => {
          const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1;

          return (
            <MenuItem
              key={index}
              value={value}
              className={disabled ? "disabled" : ""}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default SelectWidget;
