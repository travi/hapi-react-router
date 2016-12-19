export default function respond(reply, {renderedContent, status}) {
  reply.view('layout', {
    renderedContent,
    title: '<title>Example Title</title>'
  }).code(status);
}
