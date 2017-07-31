export function World() {
  this.makeRequest = ({url}) => this.server.inject({
    method: 'GET',
    headers: {accept: 'text/html'},
    url
  }).then(response => {
    this.serverResponse = response;
  });
}
