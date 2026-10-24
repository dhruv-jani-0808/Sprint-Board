import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useWebSocket(workspaceId?: string, sprintId?: string) {
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if(!workspaceId) return;

        const ws = new WebSocket("ws://localhost:5000");
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
            ws.send(JSON.stringify({ type: "JOIN_WORKSPACE", workspaceId }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Real-time event received:", data.type);

                switch (data.type) {
                    case "ISSUE_CREATED":
                    case "ISSUE_MOVED":
                    case "ISSUE_UPDATED":
                    case "ISSUE_DELETED":
                        if(sprintId) {
                            queryClient.invalidateQueries({ queryKey: ["board", sprintId] });
                        }
                        queryClient.invalidateQueries({ queryKey: ["issues", workspaceId] });
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.error("Failed to parse WebSocket message:", err);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    }, [workspaceId, sprintId, queryClient]);

    return wsRef;
}