import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";

export interface CustomWebSocket extends WebSocket {
    isAlive: boolean,
    userId?: string,
    workspaceId?: string,
};

const workspaceRooms = new Map<string, Set<CustomWebSocket>>();

export const broadcastToWorkspace = (
    workspaceId: string,
    event: { type: string; payload: any },
    excludeSocket?: CustomWebSocket,
) => {
    const room = workspaceRooms.get(workspaceId);

    if(!room) return;

    const message = JSON.stringify(event);
    for(const client of room) {
        if(client !== excludeSocket && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
};

const removeClientFromRooms = (ws: CustomWebSocket) => {
    if(ws.workspaceId && workspaceRooms.has(ws.workspaceId)) {
        const room = workspaceRooms.get(ws.workspaceId);
        room?.delete(ws);

        if(room?.size === 0) {
            workspaceRooms.delete(ws.workspaceId);
        }
    }
};

export const initWebSocketServer = (server: HttpServer) => {
    const wss = new WebSocketServer({ server });
    wss.on("connection", (ws: CustomWebSocket) => {
        ws.isAlive = true;

        ws.on("pong", () => { ws.isAlive = true; });
        ws.on("message", (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                
                if (parsed.type === "JOIN_WORKSPACE" && parsed.workspaceId) {
                    removeClientFromRooms(ws);
                    ws.workspaceId = parsed.workspaceId;

                    if (!workspaceRooms.has(parsed.workspaceId)) {
                        workspaceRooms.set(parsed.workspaceId, new Set());
                    }
                    workspaceRooms.get(parsed.workspaceId)?.add(ws);
                }
            } catch (err) {
                console.error("Invalid WebSocket message received:", err);
            }
        });
        ws.on("close", () => removeClientFromRooms(ws));
        ws.on("error", () => removeClientFromRooms(ws));
    });

    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            const ws = client as CustomWebSocket;
            if(!ws.isAlive) return ws.terminate();
    
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on("close", () => clearInterval(interval));
    return wss;
};