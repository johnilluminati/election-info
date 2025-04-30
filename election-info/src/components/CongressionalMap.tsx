import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface CongressionalMapProps {
  onDistrictSelect?: (districtId: string) => void;
}

interface DistrictProperties {
  GEOID: string;
  STATE: string;
  NAMELSAD: string;
  [key: string]: string | number;
}

const CongressionalMap: React.FC<CongressionalMapProps> = ({ onDistrictSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [districtData, setDistrictData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon, DistrictProperties> | null>(null);

  useEffect(() => {
    // Fetch the GeoJSON data
    fetch('/data/converted_congressional_voting_districts.geojson')
      .then(response => response.json())
      .then(data => setDistrictData(data))
      .catch(error => console.error('Error loading district data:', error));
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !districtData) return;

    // Create the map instance
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          },
          'congressional-districts': {
            type: 'geojson',
            data: districtData,
            generateId: true // This will assign unique ids to features
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'district-fills',
            type: 'fill',
            source: 'congressional-districts',
            paint: {
              'fill-color': '#627BC1',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.7,
                0.5
              ]
            }
          },
          {
            id: 'district-borders',
            type: 'line',
            source: 'congressional-districts',
            paint: {
              'line-color': '#627BC1',
              'line-width': 2
            }
          }
        ]
      },
      center: [-98.5795, 39.8283], // Center of the United States
      zoom: 3
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl());

    let hoveredStateId: number | null = null;

    // Add hover effect
    map.current.on('mousemove', 'district-fills', (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.current?.setFeatureState(
            { source: 'congressional-districts', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = e.features[0].id as number;
        map.current?.setFeatureState(
          { source: 'congressional-districts', id: hoveredStateId },
          { hover: true }
        );
      }
    });

    // Remove hover effect when mouse leaves
    map.current.on('mouseleave', 'district-fills', () => {
      if (hoveredStateId !== null) {
        map.current?.setFeatureState(
          { source: 'congressional-districts', id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;
    });

    // Add click handler
    map.current.on('click', 'district-fills', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const districtId = feature.properties.GEOID;
        onDistrictSelect?.(districtId);
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'district-fills', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'district-fills', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [districtData, onDistrictSelect]);

  return (
    <div className="w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full" 
        style={{ minHeight: '600px' }} 
      />
    </div>
  );
};

export default CongressionalMap; 