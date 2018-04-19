import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@carecloud/material-cuil';
import { get } from 'lodash';

// TODO: Maybe this is necessary in the future, further testing is needed
function processValue({ type }, value) {
  return value === '' || value === null ? undefined : value;
}

class SelectWidget extends React.Component {
  constructor(props) {
    super(props);

    const { async } = props.options;
    this.async = async;

    this.state = { options: null, isLoading: !!async };
  }

  componentDidMount = () => {
    if (this.async) {
      this.loadOptions();
    }
  };

  /**
   * Generate an array of options objects from enumOptions and enumDisabled.
   *
   * Each option will have a label, a value and the disabled property if it appears in enumDisabled.
   */
  getOptions = () => {
    const { enumOptions, enumDisabled } = this.props.options;

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

  /**
   * Normalize options coming from an endpoint.
   * @param data
   */
  formatOptions = data => {
    const { optionsPath, valueKey, labelKey } = this.async;
    const options = optionsPath ? get(data, optionsPath) : data;

    return Array.isArray(options)
      ? options.map(option => ({ value: option[valueKey], label: option[labelKey] }))
      : [];
  };

  loadOptions = () => {
    const { url, headers } = this.async;

    return fetch(url, { headers })
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoading: false,
          options: this.formatOptions(json),
        });
      })
      .catch(error => {
        console.error(error);

        this.setState({
          isLoading: false,
          options: [],
        });
      });
  };

  getValue = value => {
    // When the widget is configure to call an endpoint on page load, look through the options
    // in order to display a pre-selected value correctly
    if (this.async && value && value.value) {
      value = (this.state.options || []).find(option => option.value === value.value);
    }

    // Return an empty string if the value is undefined, otherwise, the Select component would
    // become uncontrolled
    return value === undefined ? '' : value;
  };

  render = () => {
    const {
      id,
      schema,
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
      autofocus,
    } = this.props;

    const selectProps = {
      id,
      multi,
      required,
      // If no placeholder is provided, use the label to be consistent with other
      // MUI components
      placeholder: placeholder || label,
      name: id,
      disabled: disabled || readonly,
      value: this.getValue(value),
    };

    if (this.async) {
      selectProps.options = this.state.options;
      selectProps.isLoading = this.state.isLoading;
    } else {
      selectProps.options = this.getOptions();
    }

    return (
      <Select
        {...selectProps}
        autoFocus={autofocus}
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
  };
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      async: PropTypes.object,
      enumOptions: PropTypes.array,
      enumDisabled: PropTypes.array,
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
