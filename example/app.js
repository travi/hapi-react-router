import Glue from 'glue';
import manifest from './manifest';

export default Glue.compose(manifest, {relativeTo: __dirname})
    .then((server) => server.start().then(() => {
        server.log(['startup'], `Server started at http://${server.info.address}:${server.info.port}`);
        return server;
    })).catch((err) => {
        console.error(err);     // eslint-disable-line no-console
        console.trace();        // eslint-disable-line no-console
    });
