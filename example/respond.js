export default function respond(h, {renderedContent, status}) {
  return h.view('layout', {
    renderedContent,
    title: '<title>Example Title</title>'
  }).code(status);
}
