import React from 'react';
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
  children: React.PropTypes.node,
  request: React.PropTypes.shape({
    headers: React.PropTypes.shape({'user-agent': React.PropTypes.string})
  })
};
