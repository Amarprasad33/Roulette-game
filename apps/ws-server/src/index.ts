require('dotenv').config();
import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({ port: 8080 });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if(!url) return;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const name = queryParams.get("name") || "Anonymous"; ;
    UserManager.getInstance().addUser(ws, name, name === ADMIN_PASSWORD);

    // ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log("receiver: %s", data);
    })

    // ws.send('something');
})