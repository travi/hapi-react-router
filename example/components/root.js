import React from 'react';
import {node, shape, string} from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default function Root({children, request}) {
  return (
    <MuiThemeProvider muiTheme={getMuiTheme({userAgent: request.headers['user-agent']})}>
      {children}
    </MuiThemeProvider>
  );
}

Root.displayName = 'Root';

Root.propTypes = {
  children: node,
  request: shape({
    headers: shape({'user-agent': string})
  })
};
