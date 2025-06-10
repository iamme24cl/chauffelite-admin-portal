import { useEffect, useState, useRef } from "react";
import { RideSession } from "../types";
import { WS_BASE_URL } from "../constants";

export function useRideSessionSocket(rideId: string, token: string): RideSession | null {
  const [session, setSession] = useState<RideSession | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = `${WS_BASE_URL}/rides/${rideId}?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 WebSocket connected:", rideId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSession(data as RideSession);
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket disconnected:", rideId);
    };

    return () => {
      ws.close();
    };
  }, [rideId, token]);

  return session;
}