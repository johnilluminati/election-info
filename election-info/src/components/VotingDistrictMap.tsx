import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import { GeoJsonObject, Feature } from 'geojson';
import L from 'leaflet';

// You can expand this interface based on your actual properties
interface VotingDistrictProperties {
  VTDID?: string;
  VTDNAME?: string;
}

// Component to handle map viewport changes
function MapViewportHandler({ onViewportChange }: { onViewportChange: (bounds: L.LatLngBounds, zoom: number) => void }) {
  const map = useMap();
  const lastBounds = useRef<L.LatLngBounds | null>(null);
  const lastZoom = useRef(map.getZoom());

  useEffect(() => {
    const handleMoveEnd = () => {
      const newBounds = map.getBounds();
      const newZoom = map.getZoom();
      
      // Only trigger if bounds or zoom have changed significantly
      if (!lastBounds.current || 
          !lastBounds.current.equals(newBounds, 0.1) || 
          Math.abs(newZoom - lastZoom.current) >= 1) {
        lastBounds.current = newBounds;
        lastZoom.current = newZoom;
        onViewportChange(newBounds, newZoom);
      }
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onViewportChange]);

  return null;
}

export default function VotingDistrictMap() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const loadGeoJsonFile = async () => {
    if (isLoadingRef.current || geoJsonData) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await fetch('/data/congressional_voting_districts.geojson');
      const data = await response.json();
      setGeoJsonData(data);
    } catch (error) {
      console.error('Error loading GeoJSON file:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  const handleViewportChange = async (bounds: L.LatLngBounds, zoom: number) => {
    // Only load GeoJSON when zoomed in enough
    if (zoom >= 6) {
      loadGeoJsonFile();
    } else {
      setGeoJsonData(null);
    }
  };

  const onEachDistrict = (feature: Feature, layer: L.Layer) => {
    if (!feature.properties) return;

    const props = feature.properties as VotingDistrictProperties;

    layer.on({
      click: () => {
        const districtId = props.VTDID || 'Unknown';
        alert(`District selected: ${districtId}`);
      },
    });

    const districtName = props.VTDNAME || 'Unnamed';
    if ((layer as L.Layer & { bindTooltip?: (label: string) => void }).bindTooltip) {
      (layer as L.Layer & { bindTooltip: (label: string) => void }).bindTooltip(`District: ${districtName}`);
    }
  };

  const geoJsonStyle = {
    fillColor: '#3388ff',
    fillOpacity: 0.2,
    color: '#3388ff',
    weight: 1,
    opacity: 0.5
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          Loading districts...
        </div>
      )}
      <MapContainer 
        center={[37.8, -96]} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxZoom={10}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        <MapViewportHandler onViewportChange={handleViewportChange} />
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData} 
            onEachFeature={onEachDistrict}
            style={geoJsonStyle}
          />
        )}
      </MapContainer>
    </div>
  );
}