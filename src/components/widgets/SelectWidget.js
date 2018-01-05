import React from "react";
import PropTypes from "prop-types";
import { Select } from "@carecloud/material-cuil";

import { asNumber } from "../../utils";

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type }, value) {
  if (value === "") {
    return undefined;
  } else if (type === "boolean") {
    if (typeof value === "boolean") {
      return value;
    }

    return value ? value === "true" : value;
  } else if (type === "number") {
    return asNumber(value);
  }

  return value;
}

/**
 * Generate an array of options objects from enumOptions and enumDisabled.
 *
 * Each option will have a label, a value and the disabled property if it appears in enumDisabled.
 */
const getOptions = (enumOptions, enumDisabled) => {
  return enumOptions.map(({ label, value }) => {
    const option = {
      label,
      value,
    };

    if (enumDisabled && enumDisabled.indexOf(value) !== -1) {
      option.disabled = true;
    }

    return option;
  });
};

function SelectWidget(props) {
  const {
    id,
    schema,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple: multi,
    onChange,
    onBlur,
    onFocus,
    label,
    placeholder,
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multi ? [] : "";

  const selectProps = {
    id,
    multi,
    required,
    // If no placeholder is provided, use the label to be consistent with other
    // MUI components
    placeholder: placeholder || label,
    name: id,
    disabled: disabled || readonly,
    value: typeof value === "undefined" ? emptyValue : value,
    options: getOptions(enumOptions, enumDisabled),
  };

  return (
    <Select
      {...selectProps}
      simpleValue
      onBlur={
        onBlur &&
        (value => {
          onBlur(id, processValue(schema, value));
        })
      }
      onFocus={
        onFocus &&
        (value => {
          onFocus(id, processValue(schema, value));
        })
      }
      onChange={value => {
        onChange(processValue(schema, value));
      }}
    />
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
