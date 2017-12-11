import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Paper, withStyles } from "@carecloud/material-cuil";

const style = ({ theme }) => ({
    root: {

    },
    formContainer: {
        borderRadius:6,
        padding: 20,
        border: "1px solid #CFD8DC",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
        minHeight: 600
    },
    fieldColumns: {
        flex: 1 ,
        "& .form-control" : {
            width: '100%',
        },
        "& .form-group" : {
            margin: "10px 0px",
            "& div": {
                width: '100%'
            }
        }
    },


});

class AlfrescoForm extends Component {

    render = () => {
        const props = this.props;
        const { classes, TitleField, DescriptionField } = props;
        const { containers } = props.uiSchema["ui:alfresco"];

        return (
          <Paper className={classes.formContainer}>
            <Grid container spacing={24} >
                {(props.uiSchema["ui:title"] || props.title) && (
                <TitleField
                    id={`${props.idSchema.$id}__title`}
                    title={props.title || props.uiSchema["ui:title"]}
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
                {Object.keys(containers).map((containerKey, containerIndex) => {
                const container = containers[containerKey];
                return (
                    <Grid key={containerIndex} item xs={12} >
                    {container.map((fieldRow, fieldRowIndex) => {
                        return (
                        <Grid 
                            key={fieldRowIndex}
                            container 
                            direction='row'
                            justify='space-between'
                            alignItems='flex-start'
                            spacing={24} >
                            {fieldRow.map((fieldColumn, fieldColumnIndex) => {
                            return (
                                <Grid key={fieldColumnIndex} item className={classes.fieldColumns}>
                                {fieldColumn.map(field => {
                                    const component = props.properties.filter(property => property.name === field)[0];
                                    return component.content;
                                })}
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
          </Paper>
        );
      };

}

export default withStyles(style)(AlfrescoForm);