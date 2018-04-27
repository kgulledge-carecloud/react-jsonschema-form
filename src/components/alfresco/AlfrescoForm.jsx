import React, { Component } from 'react';
import { Grid, Paper, withStyles } from '@carecloud/material-cuil';

import TitleField from '../fields/TitleField';

const style = ({ theme }) => ({
  root: {},
  formContainer: {
    borderRadius: 6,
    padding: '30px 24px',
    border: '1px solid #CFD8DC',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    minHeight: 75
  },
  fieldColumns: {
    '& .form-group': {
      margin: '10px 0px',
    }
  },
  objectContainer: {
    marginBottom: 14,
  },
  arrayContainer: {
    marginBottom: 24,
  },
});

class AlfrescoForm extends Component {

  /**
   * Transform column to rows.
   * @param columns: array of arrays representing columns
   */
  columnsToRows = columns => {
    if (!columns) {
      return [];
    }

    return columns.map(column => {
      const rows = [];

      column.forEach((fields, colIndex) => {
        if (!Array.isArray(fields)) {
          return false;
        }

        fields.forEach((field, rowIndex) => {
          let row = rows[rowIndex];

          if (!row) {
            row = [];
            rows.push(row);
          }

          row.splice(colIndex, 0, field);
        });
      });

      return rows;
    });
  };

  renderContainerTitle = ({ id, title }) => {
    if (!title) {
      return null;
    }

    return <TitleField id={`${id}__title`} title={title} />;
  };

  renderContainers = () => {
    const { classes } = this.props;
    const { containers } = this.props.uiSchema['ui:alfresco'];

    return Object.keys(containers).map((containerKey, containerIndex) => {
      const containerProperty = this.props.schema.properties[containerKey];

      // Arrays should be passed through
      if (containerProperty && containerProperty.type === 'array') {
        const component = this.props.properties.filter(property => property.name === containerKey)[0];

        return (
          <Grid item key={containerIndex} xs={12} className={classes.arrayContainer}>
            {component.content}
          </Grid>
        );
      }

      const container = containers[containerKey];
      const fields = this.columnsToRows(container.fields);

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
                      {
                        row.map((field, fieldIndex) => {
                          const component = this.props.properties.filter(property => property.name === field)[0];
                          // Whenever there are less fields than columns in a row, set the width for those fields
                          const cols = row.length < container.numberOfColumns ? 12 / container.numberOfColumns : true;

                          return (

                            <Grid item key={fieldIndex} xs={12} sm={cols || true}>
                              {component.content}
                            </Grid>
                          );
                        })
                      }
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
