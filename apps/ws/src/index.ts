import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const name = queryParams.get("name") || "N/A" ;
    UserManager.getInstance().addUser(ws, name);

    // ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log("receiver: %s", data);
    })

    // ws.send('something');
})