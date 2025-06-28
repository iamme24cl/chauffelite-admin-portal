// src/components/AntPath.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-ant-path";

type Props = {
  positions: [number, number][];
};

export default function AntPath({ positions }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) return;

    const antPath = (L as any).polyline.antPath(positions, {
      delay: 400,
      dashArray: [10, 20],
      weight: 5,
      color: "#1D4ED8",
      pulseColor: "#60A5FA",
    });

    antPath.addTo(map);

    return () => {
      map.removeLayer(antPath);
    };
  }, [map, positions]);

  return null;
}
