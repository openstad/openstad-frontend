import { Tooltip, withStyles } from '@material-ui/core';

export default withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'white',
    boxShadow: theme.shadows[1],
    border: 'black',
    fontSize: 11,
    padding: '20px 20px',
  },
}))(Tooltip);
