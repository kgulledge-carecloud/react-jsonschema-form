import React from 'react';
import PropTypes from 'prop-types';

import { ColorPicker } from '@carecloud/material-cuil';

import { getComponentProps } from '../../utils';

const ColorWidget = props => {
  const {
    value,
    disabled,
    readonly,
    schema,
    autofocus,
    /**
     * @description By default, `react-jsonschema-form` is going to disable
     * the alpha value in the picker
     * @default `true`
     * @type {Boolean}
     */
    disableAlpha = true,
    ...otherProps
  } = props;

  return (
    <ColorPicker
      disabled={disabled || readonly}
      color={value}
      disableAlpha={disableAlpha}
      {...otherProps}
      {...getComponentProps(props)}
    />
  );
};

ColorWidget.propTypes = {
  /**
   * @description The default value can be set using this prop
   * @type {String}
   */
  value: PropTypes.string,
};

export default ColorWidget;
