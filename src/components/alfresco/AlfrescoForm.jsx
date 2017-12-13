import React, { Component } from 'react';
import { Grid, Paper, withStyles } from '@carecloud/material-cuil';

const style = ({ theme }) => ({
  root: {},
  formContainer: {
    borderRadius: 6,
    padding: 20,
    border: '1px solid #CFD8DC',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    minHeight: 300
  },
  fieldColumns: {
    '& .form-group': {
      margin: '10px 0px',
    }
  },
});

class AlfrescoForm extends Component {

  /**
   * Transform column to rows.
   * @param container
   */
  columnsToRows = container => {
    return container.map(columns => {
      const rows = [];

      columns.forEach((fields, colIndex) => {
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

  renderContainers = () => {
    const { classes } = this.props;
    const { containers } = this.props.uiSchema['ui:alfresco'];

    return Object.keys(containers).map((containerKey, containerIndex) => {
      const containerProperty = this.props.schema.properties[containerKey];

      // Arrays should be passed through
      if (containerProperty && containerProperty.type === 'array') {
        const component = this.props.properties.filter(property => property.name === containerKey)[0];

        return (
          <Grid key={containerIndex} item xs={12}>
            {component.content}
          </Grid>
        );
      }

      const container = this.columnsToRows(containers[containerKey]);

      // Ignore empty containers
      if (!container || !container.length) {
        return null;
      }

      return (
        <Grid key={containerIndex} item xs={12}>
          {container.map((rows, fieldRowIndex) => {
            return (
              <Grid key={fieldRowIndex} container spacing={34}>
                {rows.map((row, rowIndex) => {
                  return (
                    <Grid container key={rowIndex} className={classes.fieldColumns}>
                      {
                        row.map((field, fieldIndex) => {
                          const component = this.props.properties.filter(property => property.name === field)[0];

                          return (
                            <Grid item key={fieldIndex} xs={12} sm>
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
