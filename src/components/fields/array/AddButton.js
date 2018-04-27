import React from 'react';

import { Button, withStyles } from '@carecloud/material-cuil';

const style = theme => ({
  root: {
    width: 130,
    minHeight: 26,
    height: 26,
    padding: 0,

    // Text
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: '14px',
    textAlign: 'center',
  },
});

const AddButton = ({ numberOfItems, classes, onClick, disabled }) => {
  const style = {
    display: 'flex',
    justifyContent: 'flex-start',
    // TODO: This might be used later, need to confirm styling
    // top: '-28px',
    // left: numberOfItems > 1 ? '130px' : '48px',
    // position: numberOfItems === 0 ? 'static' : 'relative',
  };

  return (
    <div className="row" style={style}>
      <Button
        className={classes.root}
        variant="inverted"
        color="primary"
        tabIndex="0"
        onClick={onClick}
        disabled={disabled}>
        Add More
      </Button>
    </div>
  );
};

export default withStyles(style)(AddButton);
