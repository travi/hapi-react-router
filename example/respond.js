export default function respond(reply, {renderedContent}) {
    reply.view('layout', {
        renderedContent,
        title: '<title>Example Title</title>'
    });
}
