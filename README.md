# ChatGPT Typing Effect

This project showcases how to do the ChatGPT "typing" effect as seen on [https://chat.openai.com](https://chat.openai.com).

## Server Sent Events

To achieve the typing effect, the app uses the builtin `EventSource` to maintain an open connection with the API, which is running on NextJS Edge Runtime. The `stream` option is set to true in the OpenAI API request, so everytime their API generates the next token/word, an event is sent to the user containg that word/token, which is then appended to the result. The cursor is just some `::after` css in `globals.css`

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- Bootstraped with `create-t3-app`

## Preview

https://chatgpteffect.williamalanwelsh.com/
