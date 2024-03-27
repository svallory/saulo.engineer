export function handleStreamResponse(sourceUrl: string, cb: (text: string) => void) {
  const source = new EventSource("/"); // Workers AI streaming endpoint
  source.onmessage = (event) => {
    if (event.data == "[DONE]") {
      source.close();
      return;
    }

    const data = JSON.parse(event.data);
    cb(data.response);
  }
}