import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons not loading correctly in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to auto-fit map bounds
const MapBounds = ({ locations }: { locations: { lat: number; lng: number }[] }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, map]);

  return null;
};

// Create custom HTML icons using Tailwind classes
const createCustomIcon = (label: string, color: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker", // base class to avoid leaflet's default div icon styles breaking layout
    html: `<div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 9999px; background-color: ${color}; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transform: translate(-50%, -50%);">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface Location {
  lat: number;
  lng: number;
  originalAddress: string;
  isPriority?: boolean;
  isStart?: boolean;
}

interface RouteMapProps {
  locations: Location[];
  isOptimized: boolean;
}

export function RouteMap({ locations, isOptimized }: RouteMapProps) {
  // Default center of US
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const zoom = locations.length > 0 ? 12 : 4;

  const validLocations = locations.filter(loc => typeof loc.lat === 'number' && typeof loc.lng === 'number');

  if (validLocations.length === 0) {
    return (
      <MapContainer center={defaultCenter} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-xl z-0" style={{ minHeight: '370px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      </MapContainer>
    );
  }

  const polylinePositions = validLocations.map(loc => [loc.lat, loc.lng] as [number, number]);

  return (
    <MapContainer center={[validLocations[0].lat, validLocations[0].lng]} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-xl z-0" style={{ minHeight: '370px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {validLocations.map((loc, index) => {
        let label = '';
        let color = '';
        
        // Use explicit isStart flag if available, else assume index 0 is start
        const isStartNode = loc.isStart !== undefined ? loc.isStart : index === 0;

        if (isStartNode) {
          label = 'S';
          color = '#10b981'; // Green
        } else if (loc.isPriority) {
          // Count prior priority nodes to get the right number
          const pIndex = validLocations.slice(0, index).filter(l => l.isPriority && !l.isStart).length + 1;
          label = `P${pIndex}`;
          color = '#ef4444'; // Red
        } else {
          // Count prior normal nodes
          const nIndex = validLocations.slice(0, index).filter(l => !l.isPriority && !l.isStart && l !== validLocations[0]).length + 1;
          label = `${nIndex}`;
          color = '#3b82f6'; // Blue
        }

        return (
          <Marker 
            key={`${loc.lat}-${loc.lng}-${index}`} 
            position={[loc.lat, loc.lng]} 
            icon={createCustomIcon(label, color)}
          />
        );
      })}

      {isOptimized && validLocations.length > 1 && (
        <Polyline positions={polylinePositions} color="#3b82f6" weight={4} opacity={0.8} dashArray="10, 10" />
      )}

      <MapBounds locations={validLocations} />
    </MapContainer>
  );
}
