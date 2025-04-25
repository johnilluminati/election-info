import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { GeoJsonObject, Feature } from 'geojson';
import L from 'leaflet';

// You can expand this interface based on your actual properties
interface VotingDistrictProperties {
  VTDID?: string;
  VTDNAME?: string;
}

export default function VotingDistrictMap() {
  const [districts, setDistricts] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    fetch('/data/voting_districts.geojson')
      .then((res) => res.json())
      .then((data: GeoJsonObject) => setDistricts(data))
      .catch((error) => {
        console.error('Error loading voting districts:', error);
      });
  }, []);

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

  return (
    <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districts && <GeoJSON data={districts} onEachFeature={onEachDistrict} />}
    </MapContainer>
  );
}