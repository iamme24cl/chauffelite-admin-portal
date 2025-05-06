import { useEffect, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { RideSession } from '../types';

export function useRideSession(rideId: string) {
    const [session, setSession] = useState<RideSession | null>(null);

    useEffect(() => {
      const unsub = onSnapshot(doc(db, "ride_sessions", rideId), (docSnap) => {
        if (docSnap.exists()) {
          setSession(docSnap.data() as RideSession)
        }
      });

      return () => unsub();
    }, [rideId]);

    return session;
}
