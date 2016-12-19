import {OK, NOT_FOUND} from 'http-status-codes';
import {match, createMemoryHistory} from 'react-router';

function determineStatusFrom(components) {
  if (components.map(component => component.displayName).includes('NotFound')) return NOT_FOUND;

  return OK;
}

export default function matchRoute(url, routes) {
  return new Promise((resolve, reject) => {
    const history = createMemoryHistory();

    match({routes, location: history.createLocation(url)}, (err, redirectLocation, renderProps) => {
      if (err) {
        reject(err);
      }

      resolve({redirectLocation, renderProps, status: determineStatusFrom(renderProps.components)});
    });
  });
}
