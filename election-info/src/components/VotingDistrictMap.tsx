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
  const [geoJsonLayers, setGeoJsonLayers] = useState<GeoJsonObject[]>([]);

  useEffect(() => {
    // List of GeoJSON files to load
    const geoJsonFiles = [
      '/data/alabama_voting_districts.geojson',
      '/data/alaska_voting_districts.geojson',
      '/data/american_samoa_voting_districts.geojson',
      '/data/arizona_voting_districts.geojson',
      '/data/arkansas_voting_districts.geojson',
      '/data/california_voting_districts.geojson',
      '/data/colorado_voting_districts.geojson',
      '/data/commonwealth_of_northern_mariana_islands_voting_districts.geojson',
      '/data/connecticut_voting_districts.geojson',
      '/data/delaware_voting_districts.geojson',
      '/data/district_of_columbia_voting_districts.geojson',
      '/data/florida_voting_districts.geojson',
      '/data/georgia_voting_districts.geojson',
      '/data/guam_voting_districts.geojson',
      '/data/hawaii_voting_districts.geojson',
      '/data/idaho_voting_districts.geojson',
      '/data/illinois_voting_districts.geojson',
      '/data/indiana_voting_districts.geojson',
      '/data/iowa_voting_districts.geojson',
      '/data/kansas_voting_districts.geojson',
      '/data/kentucky_voting_districts.geojson',
      '/data/louisiana_voting_districts.geojson',
      '/data/maine_voting_districts.geojson',
      '/data/maryland_voting_districts.geojson',
      '/data/massachusetts_voting_districts.geojson',
      '/data/michigan_voting_districts.geojson',
      '/data/minnesota_voting_districts.geojson',
      '/data/mississippi_voting_districts.geojson',
      '/data/missouri_voting_districts.geojson',
      '/data/montana_voting_districts.geojson',
      '/data/nebraska_voting_districts.geojson',
      '/data/nevada_voting_districts.geojson',
      '/data/new_hampshire_voting_districts.geojson',
      '/data/new_jersey_voting_districts.geojson',
      '/data/new_mexico_voting_districts.geojson',
      '/data/new_york_voting_districts.geojson',
      '/data/north_carolina_voting_districts.geojson',
      '/data/north_dakota_voting_districts.geojson',
      '/data/ohio_voting_districts.geojson',
      '/data/oklahoma_voting_districts.geojson',
      '/data/oregon_voting_districts.geojson',
      '/data/pennsylvania_voting_districts.geojson',
      '/data/puerto_rico_voting_districts.geojson',
      '/data/rhode_island_voting_districts.geojson',
      '/data/south_carolina_voting_districts.geojson',
      '/data/south_dakota_voting_districts.geojson',
      '/data/tennessee_voting_districts.geojson',
      '/data/texas_voting_districts.geojson',
      '/data/utah_voting_districts.geojson',
      '/data/vermont_voting_districts.geojson',
      '/data/virgin_islands_voting_districts.geojson',
      '/data/virginia_voting_districts.geojson',
      '/data/washington_voting_districts.geojson',
      '/data/west_virginia_voting_districts.geojson',
      '/data/wisconsin_voting_districts.geojson',
      '/data/wyoming_voting_districts.geojson'
    ];

    // Fetch all GeoJSON files
    Promise.all(
      geoJsonFiles.map(file =>
        fetch(file)
          .then(res => res.json())
          .catch(error => {
            console.error(`Error loading ${file}:`, error);
            return null;
          })
      )
    )
      .then(results => {
        // Filter out any failed loads and set the state
        setGeoJsonLayers(results.filter((result): result is GeoJsonObject => result !== null));
      })
      .catch(error => {
        console.error('Error loading GeoJSON files:', error);
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
      {geoJsonLayers.map((layer, index) => (
        <GeoJSON key={index} data={layer} onEachFeature={onEachDistrict} />
      ))}
    </MapContainer>
  );
}