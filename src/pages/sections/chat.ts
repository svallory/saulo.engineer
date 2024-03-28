const chatEndpoint = 'http://localhost:8008/query'

export function handleStreamResponse(sourceUrl: string, cb: (text: string) => void) {
  const source = new EventSource(sourceUrl); // Workers AI streaming endpoint

  source.onmessage = (event) => {
    if (event.data == "[DONE]") {
      source.close();
      return;
    }

    const data = JSON.parse(event.data);
    console.log(data);
    cb(data.response);
  }
}

handleStreamResponse(`${chatEndpoint}`, (response: string) => {
  console.log('CHAMOU!')
  document.getElementById('chat-messages').appendChild(new Text(response))
})

// window['sendChatMessage'] = function sendChatMessage(msg: string) {

// }

