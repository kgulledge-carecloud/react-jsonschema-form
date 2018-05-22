import React, { Component } from 'react';
import { Grid, Paper, withStyles } from '@carecloud/material-cuil';
import get from 'lodash/get';

import TitleField from '../fields/TitleField';

const style = ({ theme }) => ({
  root: {},
  formContainer: {
    borderRadius: 6,
    padding: '30px 24px',
    border: '1px solid #CFD8DC',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    minHeight: 75,
  },
  fieldColumns: {
    '& .form-group': {
      margin: '10px 0px',
    },
  },
  objectContainer: {
    marginBottom: 14,
  },
  arrayContainer: {
    marginBottom: 24,
  },
});

class AlfrescoForm extends Component {
  renderContainerTitle = ({ id, title }) => {
    if (!title) {
      return null;
    }

    return <TitleField id={`${id}__title`} title={title} />;
  };

  getFieldCols = (container, row, component) => {
    // Grid default rules.
    //
    // - xs: defaults to 12.
    // - sm: minimum possible value is 2, meaning there can't be more than 6 fields per row.
    // - md: use `true` to fit all fields in the best possible way for this row.
    // - sm/md: if a row has less fields than columns, then hard set the width for those fields, so they don't fit
    // the entire width.
    const gridWidth = 12 / container.numberOfColumns;
    const sm = container.numberOfColumns > 6 && row.length === container.numberOfColumns ? 2 : gridWidth;
    const md = row.length < container.numberOfColumns ? gridWidth : true;
    const defaultCols = { xs: 12, sm, md };

    let cols = get(component, 'content.props.uiSchema[\'ui:cols\']', defaultCols) || defaultCols;

    if (typeof cols === 'string' || typeof cols === 'number') {
      cols = {
        md: cols,
      };
    }

    // Override defaults with user defined cols
    return {
      ...defaultCols,
      ...cols,
    };
  };

  renderContainers = () => {
    const { classes } = this.props;
    const { containers } = this.props.uiSchema['ui:alfresco'];

    return containers.map((container, containerIndex) => {
      const containerProperty = this.props.schema.properties[container.id];

      // Arrays should be passed through
      if (containerProperty && containerProperty.type === 'array') {
        const component = this.props.properties.filter(property => property.name === container.id)[0];

        return (
          <Grid item key={containerIndex} xs={12} className={classes.arrayContainer}>
            {component.content}
          </Grid>
        );
      }

      const fields = container.fields;

      // Ignore empty containers
      if (!fields || !fields.length) {
        return null;
      }

      return (
        <Grid item key={containerIndex} xs={12} className={classes.objectContainer}>
          {this.renderContainerTitle(container)}

          {fields.map((rows, fieldRowIndex) => {
            return (
              <Grid container key={fieldRowIndex}>
                {rows.map((row, rowIndex) => {
                  return (
                    <Grid container spacing={16} key={rowIndex} className={classes.fieldColumns}>
                      {row.map((field, fieldIndex) => {
                        const component = this.props.properties.filter(property => property.name === field)[0];
                        const cols = this.getFieldCols(container, row, component);

                        return (
                          <Grid item key={fieldIndex} {...cols}>
                            {component.content}
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      );
    });
  };

  render = () => {
    const props = this.props;
    const { classes, TitleField, DescriptionField } = props;

    if (props.uiSchema['ui:array']) {
      return this.renderContainers();
    }

    return (
      <Paper className={classes.formContainer}>
        <Grid container spacing={24}>
          {(props.uiSchema['ui:title'] || props.title) && (
            <TitleField
              id={`${props.idSchema.$id}__title`}
              title={props.title || props.uiSchema['ui:title']}
              required={props.required}
              formContext={props.formContext}
            />
          )}
          {props.description && (
            <DescriptionField
              id={`${props.idSchema.$id}__description`}
              description={props.description}
              formContext={props.formContext}
            />
          )}
          {this.renderContainers()}
        </Grid>
      </Paper>
    );
  };
}

export default withStyles(style)(AlfrescoForm);
