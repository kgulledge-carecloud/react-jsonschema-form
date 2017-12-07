import React from "react";
import PropTypes from "prop-types";
import {
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@carecloud/material-cuil";

function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

function CheckboxesWidget(props) {
  const { id, disabled, options, value, readonly, onChange } = props;
  const { enumOptions, enumDisabled = [], inline } = options;
  const groupDisabled = disabled || readonly;

  return (
    <FormGroup id={id} name={id} className="checkboxes" row={inline}>
      {enumOptions.map((option, index) => {
        const isDisabled =
          groupDisabled || enumDisabled.indexOf(option.value) !== -1;
        const checked = value.indexOf(option.value) !== -1;

        return (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                id={`${id}_${index}`}
                checked={checked}
                onChange={event => {
                  const all = enumOptions.map(({ value }) => value);

                  if (event.target.checked) {
                    onChange(selectValue(option.value, value, all));
                  } else {
                    onChange(deselectValue(option.value, value));
                  }
                }}
                value={option.value}
                disabled={isDisabled}
              />
            }
            label={option.label}
          />
        );
      })}
    </FormGroup>
  );
}

CheckboxesWidget.defaultProps = {
  autofocus: false,
  options: {
    inline: false,
  },
};

if (process.env.NODE_ENV !== "production") {
  CheckboxesWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxesWidget;
