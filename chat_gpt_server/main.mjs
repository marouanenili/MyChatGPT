import express from 'express';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import {createServer} from "http";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const configuration = new Configuration({
    organization: "org-JM5rARZ11XepwVy8dScTb1ts",
    apiKey: "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",
});

const API_KEY = "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";
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

const app = express();
const port = 4000;
const server = http.createServer(app);

async function sendMessageToChatGPT(message) {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/jobs', {
            prompt: message,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json'
            }
        });
        const response_final = response.data.choices[0].text;
        console.log(response_final);
        return response_final;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function SendMessageToChatGPT3(message) {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 2048,
        temperature: 0.1,
    });
    const choices = response.data.choices;
    console.log("choices : ")
    console.log(choices.length);
    console.log(response.data)
    return choices[0].text
}
const ioServer = new Server(server, {
    cors: {
        origin: "*",
    }
});
ioServer.on('connection', async (socket) => {
    console.log("user connected");
    socket.emit('connection','Hi');
    socket.on('sendMessage', async function (data) {
        console.log("message received")
        console.log(data)

        const response = await SendMessageToChatGPT3(data);
        socket.emit('message', response);


        });
})


server.listen(port, () => {
    console.log(`Server listening on: ${port}`);
});