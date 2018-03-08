import React from 'react';
import PropTypes from 'prop-types';

function TextareaWidget(props) {
  const { BaseInput } = props.registry.widgets;
  const { options, ...inputProps } = props;

  return (
    <BaseInput
      {...inputProps}
      multiline
      rows={options.rows}
      rowsMax={options.rowsMax}
      options={options}
    />
  );
}

TextareaWidget.defaultProps = {
  autofocus: false,
  options: {},
};

if (process.env.NODE_ENV !== 'production') {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      rowsMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default TextareaWidget;
