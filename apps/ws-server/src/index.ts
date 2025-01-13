require('dotenv').config();
import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({ port: 8080 });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// To become admin go to admin route on FE and do /name=[ADMIN_Password] :: Admin-password is in the env
wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if(!url) return;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const name = queryParams.get("name") || "Anonymous"; ;
    UserManager.getInstance().addUser(ws, name, name === ADMIN_PASSWORD);
    
    // ws.on('error', console.error);
    // ws.send('something');
})