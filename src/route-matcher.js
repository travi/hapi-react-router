import {match, createMemoryHistory} from 'react-router';

export default function matchRoute(url, routes) {
    return new Promise((resolve, reject) => {
        const history = createMemoryHistory();

        match({routes, location: history.createLocation(url)}, (err, redirectLocation, renderProps) => {
            if (err) {
                reject(err);
            }

            resolve({redirectLocation, renderProps});
        });
    });
}
