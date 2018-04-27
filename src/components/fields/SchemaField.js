import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormHelperText, InputLabel } from '@carecloud/material-cuil';

import {
  isMultiSelect,
  retrieveSchema,
  getDefaultRegistry,
  getUiOptions,
  isFilesArray,
  deepEquals,
} from '../../utils';
import UnsupportedField from './UnsupportedField';

const COMPONENT_TYPES = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
};

function getFieldComponent(schema, uiSchema, idSchema, fields) {
  const field = uiSchema['ui:field'];
  if (typeof field === 'function') {
    return field;
  }
  if (typeof field === 'string' && field in fields) {
    return fields[field];
  }
  const componentName = COMPONENT_TYPES[schema.type];
  return componentName in fields
    ? fields[componentName]
    : () => {
        return (
          <UnsupportedField
            schema={schema}
            idSchema={idSchema}
            reason={`Unknown field type ${schema.type}`}
          />
        );
      };
}

function Help(props) {
  const { help } = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return <FormHelperText className="help-block">{help}</FormHelperText>;
}

function ErrorList(props) {
  const { errors = [] } = props;
  if (errors.length === 0) {
    return <div />;
  }
  return (
    <FormHelperText className="error-detail bs-callout bs-callout-info" error={true}>
      {errors.map((error, index) => {
        return (
          <span className="text-danger" key={index}>
            {error}
          </span>
        );
      })}
    </FormHelperText>
  );
}

function DefaultTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    disabled,
    readonly,
    uiSchema,
    useDiv,
  } = props;

  if (hidden) {
    return children;
  }

  // Radio and checkboxes should use a FormLabel instead of an InputLabel
  const useFormLabel =
    displayLabel && ['checkboxes', 'radio'].indexOf(uiSchema['ui:widget']) !== -1;

  const LabelComp = useFormLabel ? FormLabel : InputLabel;
  const labelProps = {
    required,
    htmlFor: id,
    disabled: disabled || readonly,
  };

  const ContainerComp = useDiv ? 'div' : FormControl;
  const containerProps = useDiv
    ? {}
    : {
        required,
        error: !!errors,
        disabled: disabled || readonly,
        margin: 'normal',
        fullWidth: true,
      };

  return (
    <ContainerComp className={classNames} {...containerProps}>
      {displayLabel && <LabelComp {...labelProps}>{label}</LabelComp>}
      {displayLabel && description ? description : null}
      {children}
      {errors}
      {help}
    </ContainerComp>
  );
}

if (process.env.NODE_ENV !== 'production') {
  DefaultTemplate.propTypes = {
    id: PropTypes.string,
    classNames: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
    errors: PropTypes.element,
    rawErrors: PropTypes.arrayOf(PropTypes.string),
    help: PropTypes.element,
    rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    description: PropTypes.element,
    rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    hidden: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    displayLabel: PropTypes.bool,
    fields: PropTypes.object,
    formContext: PropTypes.object,
  };
}

DefaultTemplate.defaultProps = {
  hidden: false,
  disabled: false,
  readonly: false,
  required: false,
  displayLabel: true,
};

function SchemaFieldRender(props) {
  const {
    uiSchema,
    formData,
    errorSchema,
    idSchema,
    name,
    required,
    registry = getDefaultRegistry(),
  } = props;
  const { definitions, fields, formContext, FieldTemplate = DefaultTemplate } = registry;
  const schema = retrieveSchema(props.schema, definitions, formData);
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields);
  const { DescriptionField } = fields;
  const disabled = Boolean(props.disabled || uiSchema['ui:disabled']);
  const readonly = Boolean(props.readonly || uiSchema['ui:readonly']);
  const autofocus = Boolean(props.autofocus || uiSchema['ui:autofocus']);

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }

  const uiOptions = getUiOptions(uiSchema);
  let { label: displayLabel = true } = uiOptions;

  let useDiv = false;

  switch (schema.type) {
    case 'array':
      displayLabel =
        isMultiSelect(schema, definitions) || isFilesArray(schema, uiSchema, definitions);

      // If it's an array of objects, use a div element
      useDiv = !!schema.items && schema.items.type === 'object';

      break;
    case 'object':
      displayLabel = false;
      useDiv = true;

      break;
    case 'boolean':
      if (!uiSchema['ui:widget']) {
        displayLabel = false;
      }

      break;
    default:
      break;
  }

  if (uiSchema['ui:field'] || uiSchema['ui:widget'] === 'color') {
    displayLabel = false;
  }

  const { __errors, ...fieldErrorSchema } = errorSchema;

  // See #439: uiSchema: Don't pass consumed class names to child components
  const field = (
    <FieldComponent
      {...props}
      schema={schema}
      uiSchema={{ ...uiSchema, classNames: undefined }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
    />
  );

  const { type } = schema;
  const id = idSchema.$id;
  const label = uiSchema['ui:title'] || props.schema.title || schema.title || name;
  const description = uiSchema['ui:description'] || props.schema.description || schema.description;
  const errors = __errors;
  const help = uiSchema['ui:help'];
  const hidden = uiSchema['ui:widget'] === 'hidden';
  const classNames = [
    'form-group',
    'field',
    `field-${type}`,
    errors && errors.length > 0 ? 'field-error has-error has-danger' : '',
    uiSchema.classNames,
  ]
    .join(' ')
    .trim();

  const fieldProps = {
    description: description ? (
      <DescriptionField
        id={id + '__description'}
        description={description}
        formContext={formContext}
      />
    ) : null,
    rawDescription: description,
    help: help ? <Help help={help} /> : null,
    rawHelp: typeof help === 'string' ? help : undefined,
    errors: errors && errors.length ? <ErrorList errors={errors} /> : null,
    rawErrors: errors,
    id,
    label,
    hidden,
    required,
    disabled,
    readonly,
    displayLabel,
    classNames,
    formContext,
    fields,
    schema,
    uiSchema,
    useDiv,
  };

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>;
}

class SchemaField extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if schemas are equal idSchemas will be equal as well,
    // so it is not necessary to compare
    return !deepEquals(
      { ...this.props, idSchema: undefined },
      { ...nextProps, idSchema: undefined }
    );
  }

  render() {
    return SchemaFieldRender(this.props);
  }
}

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  SchemaField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    formData: PropTypes.any,
    errorSchema: PropTypes.object,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object]))
        .isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      ArrayFieldTemplate: PropTypes.func,
      ObjectFieldTemplate: PropTypes.func,
      FieldTemplate: PropTypes.func,
      formContext: PropTypes.object.isRequired,
    }),
    index: PropTypes.number,
  };
}

export default SchemaField;
