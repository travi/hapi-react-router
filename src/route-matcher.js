import {StatusCodes} from 'http-status-codes';
import {match, createMemoryHistory} from 'react-router';

function determineStatusFrom(components) {
  if (components && components.map(component => component.displayName).includes('NotFound')) {
    return StatusCodes.NOT_FOUND;
  }

  return StatusCodes.OK;
}

export default function matchRoute(url, routes) {
  return new Promise((resolve, reject) => {
    const history = createMemoryHistory();

    match({routes, location: history.createLocation(url)}, (err, redirectLocation, renderProps) => {
      if (err) reject(err);

      resolve({redirectLocation, renderProps, status: determineStatusFrom(renderProps && renderProps.components)});
    });
  });
}
