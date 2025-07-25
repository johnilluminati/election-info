import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';

interface CongressionalMapProps {
  onDistrictSelect?: (districtId: string) => void;
  onStateSelect?: (stateName: string) => void;
}

interface DistrictProperties {
  geoid: string;
  state: string;
  namelsad: string;
  district: string;
  [key: string]: string | number;
}

interface StateProperties {
  state: string;
  namelsad: string;
  [key: string]: string | number;
}

interface TooltipState {
  show: boolean;
  text: string;
  x: number;
  y: number;
}

// Function to combine districts into states
const createStateFeatures = (districtData: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, DistrictProperties>) => {
  // List of distinct colors for states
  const stateColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFD93D', // Yellow
    '#95E1D3', // Mint
    '#FF8B94', // Pink
    '#6C5CE7', // Purple
    '#A8E6CF', // Light Green
    '#FFB6B9', // Light Pink
    '#B8F2E6', // Aqua
    '#AED9E0', // Blue
    '#FFA69E', // Coral
    '#B5EAD7', // Sage
    '#C7CEEA', // Lavender
    '#E2F0CB', // Lime
    '#FFDAC1'  // Peach
  ];

  // Convert MultiPolygons to Polygons by taking their first polygon
  const normalizedFeatures = districtData.features.map(feature => {
    if (feature.geometry.type === 'MultiPolygon') {
      return turf.polygon(feature.geometry.coordinates[0], feature.properties);
    }
    return feature as GeoJSON.Feature<GeoJSON.Polygon, DistrictProperties>;
  });

  // Create a new feature collection with normalized features
  const normalizedCollection = turf.featureCollection(normalizedFeatures) as GeoJSON.FeatureCollection<GeoJSON.Polygon, DistrictProperties>;

  // Use turf.dissolve to combine features with the same state property
  const dissolved = turf.dissolve(normalizedCollection, {
    propertyName: 'state'
  });

  // Transform the dissolved features to match our desired format
  const stateFeatures = dissolved.features.map(feature => ({
    type: 'Feature',
    properties: {
      state: feature.properties?.state,
      namelsad: feature.properties?.state,
      color: stateColors[Math.floor(Math.random() * stateColors.length)]
    },
    geometry: feature.geometry
  }));

  return {
    type: 'FeatureCollection',
    features: stateFeatures
  } as GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, StateProperties>;
};

const CongressionalMap: React.FC<CongressionalMapProps> = ({ onDistrictSelect, onStateSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [districtData, setDistrictData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, DistrictProperties> | null>(null);
  const [stateData, setStateData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, StateProperties> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, text: '', x: 0, y: 0 });
  const selectedDistrictIdRef = useRef<number | null>(null);
  const selectedStateIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Fetch the GeoJSON data
    fetch('/data/converted_congressional_voting_districts.geojson')
      .then(response => response.json())
      .then(data => {
        setDistrictData(data);
        const stateDataWithColors = createStateFeatures(data);
        setStateData(stateDataWithColors);
        
        // Create a map of state names to their colors
        const stateColorMap = new Map<string, string>();
        stateDataWithColors.features.forEach(feature => {
          if (feature.properties?.state && feature.properties?.color) {
            stateColorMap.set(feature.properties.state, feature.properties.color as string);
          }
        });
        
        // Add state colors to districts
        const districtsWithStateColors = {
          ...data,
          features: data.features.map((feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, DistrictProperties>) => ({
            ...feature,
            properties: {
              ...feature.properties,
              stateColor: stateColorMap.get(feature.properties.state) || '#FF6B6B'
            }
          }))
        };
        
        setDistrictData(districtsWithStateColors);
      })
      .catch(error => console.error('Error loading district data:', error));
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !districtData || !stateData) return;

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
            generateId: true
          },
          'states': {
            type: 'geojson',
            data: stateData,
            generateId: true
          },

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
            id: 'state-fills',
            type: 'fill',
            source: 'states',
            paint: {
              'fill-color': ['get', 'color'],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.6,
                ['case',
                  ['boolean', ['feature-state', 'hover'], false],
                  0.3,
                  0.1
                ]
              ]
            }
          },
          {
            id: 'district-fills',
            type: 'fill',
            source: 'congressional-districts',
            minzoom: 4,
            paint: {
              'fill-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                ['get', 'stateColor'],
                ['case',
                  ['boolean', ['feature-state', 'hover'], false],
                  ['get', 'stateColor'],
                  'transparent'
                ]
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.9,
                ['case',
                  ['boolean', ['feature-state', 'hover'], false],
                  0.8,
                  0.3
                ]
              ]
            }
          },
          {
            id: 'district-borders',
            type: 'line',
            source: 'congressional-districts',
            minzoom: 4,
            paint: {
              'line-color': '#627BC1',
              'line-width': 0.5
            }
          },
          {
            id: 'state-borders',
            type: 'line',
            source: 'states',
            paint: {
              'line-color': '#627BC1',
              'line-width': 1.5
            }
          },

        ]
      },
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl());

    // Add zoom level logging
    // map.current.on('zoom', () => {
    //   const currentZoom = map.current?.getZoom();
    //   console.log('Current zoom level:', currentZoom);
    // });

    let hoveredStateId: number | null = null;
    let hoveredDistrictId: number | null = null;

    // Add hover effect for districts
    map.current.on('mousemove', 'district-fills', (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredDistrictId !== null) {
          map.current?.setFeatureState(
            { source: 'congressional-districts', id: hoveredDistrictId },
            { hover: false }
          );
        }
        hoveredDistrictId = e.features[0].id as number;
        map.current?.setFeatureState(
          { source: 'congressional-districts', id: hoveredDistrictId },
          { hover: true }
        );

        // Show tooltip for district
        const feature = e.features[0];
        const currentZoom = map.current?.getZoom() || 0;
        const stateName = feature.properties.state;
        const districtNumber = feature.properties.district;
        const districtName = feature.properties.namelsad || `District ${districtNumber}`;
        
        // Show state + district when zoomed in enough to see district lines (zoom >= 4)
        const tooltipText = currentZoom >= 4 
          ? `${stateName} - ${districtName}`
          : districtName;
        
        setTooltip({
          show: true,
          text: tooltipText,
          x: e.point.x,
          y: e.point.y
        });
      }
    });

    // Remove hover effect when mouse leaves districts
    map.current.on('mouseleave', 'district-fills', () => {
      if (hoveredDistrictId !== null) {
        map.current?.setFeatureState(
          { source: 'congressional-districts', id: hoveredDistrictId },
          { hover: false }
        );
      }
      hoveredDistrictId = null;
      setTooltip({ show: false, text: '', x: 0, y: 0 });
    });

    // Add hover effect for states
    map.current.on('mousemove', 'state-fills', (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.current?.setFeatureState(
            { source: 'states', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = e.features[0].id as number;
        map.current?.setFeatureState(
          { source: 'states', id: hoveredStateId },
          { hover: true }
        );

        // Show tooltip for state
        const feature = e.features[0];
        const currentZoom = map.current?.getZoom() || 0;
        
        // Don't show state tooltip when district lines are visible (zoom >= 4)
        if (currentZoom >= 4) {
          return;
        }
        
        const stateName = feature.properties.namelsad || feature.properties.state;
        setTooltip({
          show: true,
          text: stateName,
          x: e.point.x,
          y: e.point.y
        });
      }
    });

    // Remove hover effect when mouse leaves states
    map.current.on('mouseleave', 'state-fills', () => {
      if (hoveredStateId !== null) {
        map.current?.setFeatureState(
          { source: 'states', id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;
      setTooltip({ show: false, text: '', x: 0, y: 0 });
    });

    // Add click handler for districts (only when zoomed in enough to see district lines)
    map.current.on('click', 'district-fills', async (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const districtId = feature.properties.district;
        const stateName = feature.properties.state;
        onDistrictSelect?.(districtId);
        
        // Store current selection IDs before clearing
        const currentSelectedDistrictId = selectedDistrictIdRef.current;
        const currentSelectedStateId = selectedStateIdRef.current;
        
        // Clear previous selections with proper async handling
        const clearSelections = async () => {
          console.log('Starting async clearing of selections...');
          console.log('Current selectedDistrictId:', currentSelectedDistrictId);
          console.log('Current selectedStateId:', currentSelectedStateId);
          
          // Clear district selection
          if (currentSelectedDistrictId !== null && currentSelectedDistrictId !== undefined) {
            console.log('Clearing district selection:', currentSelectedDistrictId);
            try {
              const source = map.current?.getSource('congressional-districts');
              if (source && 'serialize' in source) {
                // Wait for removeFeatureState to complete
                await map.current?.removeFeatureState(
                  { source: 'congressional-districts', id: currentSelectedDistrictId },
                  'selected'
                );
                console.log('Removed district feature state');
                
                // Wait for setFeatureState to complete
                await map.current?.setFeatureState(
                  { source: 'congressional-districts', id: currentSelectedDistrictId },
                  { selected: false, hover: false }
                );
                console.log('Set district feature state to false');
              } else {
                console.log('Source not available for district clearing');
              }
            } catch (error) {
              console.error('Failed to clear district selection:', error);
            }
          } else {
            console.log('No district selection to clear (currentSelectedDistrictId is null/undefined)');
          }
          
          // Clear state selection
          if (currentSelectedStateId !== null && currentSelectedStateId !== undefined) {
            console.log('Clearing state selection:', currentSelectedStateId);
            try {
              const source = map.current?.getSource('states');
              if (source && 'serialize' in source) {
                // Wait for removeFeatureState to complete
                await map.current?.removeFeatureState(
                  { source: 'states', id: currentSelectedStateId },
                  'selected'
                );
                console.log('Removed state feature state');
                
                // Wait for setFeatureState to complete
                await map.current?.setFeatureState(
                  { source: 'states', id: currentSelectedStateId },
                  { selected: false, hover: false }
                );
                console.log('Set state feature state to false');
              } else {
                console.log('Source not available for state clearing');
              }
            } catch (error) {
              console.error('Failed to clear state selection:', error);
            }
          } else {
            console.log('No state selection to clear (currentSelectedStateId is null/undefined)');
          }
          
          // Force repaint after all async operations complete
          if (map.current) {
            map.current.triggerRepaint();
            console.log('Triggered repaint after clearing selections');
          }
        };
        
        // Execute clearing and wait for it to complete before setting new selections
        await clearSelections();
        
        // Find and select the parent state
        const parentState = stateData.features.find(state => 
          state.properties.state === stateName
        );
        
        if (parentState && parentState.id !== null && parentState.id !== undefined) {
          const newStateId = parentState.id as number;
          console.log('Setting new state selection:', newStateId);
          selectedStateIdRef.current = newStateId;
          try {
            await map.current?.setFeatureState(
              { source: 'states', id: newStateId },
              { selected: true }
            );
            console.log('Successfully set state selection');
          } catch (error) {
            console.error('Failed to set state selection:', error);
          }
        } else {
          console.log('Parent state not found or has invalid ID:', parentState?.id);
        }
        
        // Set new district selection
        const newDistrictId = feature.id as number;
        if (newDistrictId !== null && newDistrictId !== undefined) {
          console.log('Setting new district selection:', newDistrictId);
          selectedDistrictIdRef.current = newDistrictId;
          try {
            await map.current?.setFeatureState(
              { source: 'congressional-districts', id: newDistrictId },
              { selected: true }
            );
            console.log('Successfully set district selection');
          } catch (error) {
            console.error('Failed to set district selection:', error);
          }
        } else {
          console.log('District feature has invalid ID:', feature.id);
        }
        
        // Zoom to district
        const bbox = turf.bbox(feature);
        map.current?.fitBounds(bbox as [number, number, number, number], {
          padding: 50,
          duration: 1000,
          maxZoom: 12
        });
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

    // Add click handler for states (only when zoomed out enough that district lines are not visible)
    map.current.on('click', 'state-fills', async (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const stateName = feature.properties.state;
        if (onStateSelect) {
          onStateSelect(stateName);
        }
        // Only handle state selection when zoomed out (district lines not visible)
        const currentZoom = map.current?.getZoom() || 0;
        if (currentZoom >= 4) {
          return; // Don't handle state clicks when district lines are visible
        }
        
        // Store current selection IDs before clearing
        const currentSelectedDistrictId = selectedDistrictIdRef.current;
        const currentSelectedStateId = selectedStateIdRef.current;
        
        // Clear previous selections with proper async handling
        const clearSelections = async () => {
          console.log('Starting async clearing of selections...');
          console.log('Current selectedDistrictId:', currentSelectedDistrictId);
          console.log('Current selectedStateId:', currentSelectedStateId);
          
          // Clear state selection
          if (currentSelectedStateId !== null && currentSelectedStateId !== undefined) {
            console.log('Clearing state selection:', currentSelectedStateId);
            try {
              const source = map.current?.getSource('states');
              if (source && 'serialize' in source) {
                // Wait for removeFeatureState to complete
                await map.current?.removeFeatureState(
                  { source: 'states', id: currentSelectedStateId },
                  'selected'
                );
                console.log('Removed state feature state');
                
                // Wait for setFeatureState to complete
                await map.current?.setFeatureState(
                  { source: 'states', id: currentSelectedStateId },
                  { selected: false, hover: false }
                );
                console.log('Set state feature state to false');
              } else {
                console.log('Source not available for state clearing');
              }
            } catch (error) {
              console.error('Failed to clear state selection:', error);
            }
          } else {
            console.log('No state selection to clear (currentSelectedStateId is null/undefined)');
          }
          
          // Clear district selection
          if (currentSelectedDistrictId !== null && currentSelectedDistrictId !== undefined) {
            console.log('Clearing district selection:', currentSelectedDistrictId);
            try {
              const source = map.current?.getSource('congressional-districts');
              if (source && 'serialize' in source) {
                // Wait for removeFeatureState to complete
                await map.current?.removeFeatureState(
                  { source: 'congressional-districts', id: currentSelectedDistrictId },
                  'selected'
                );
                console.log('Removed district feature state');
                
                // Wait for setFeatureState to complete
                await map.current?.setFeatureState(
                  { source: 'congressional-districts', id: currentSelectedDistrictId },
                  { selected: false, hover: false }
                );
                console.log('Set district feature state to false');
              } else {
                console.log('Source not available for district clearing');
              }
            } catch (error) {
              console.error('Failed to clear district selection:', error);
            }
            selectedDistrictIdRef.current = null;
          } else {
            console.log('No district selection to clear (currentSelectedDistrictId is null/undefined)');
          }
          
          // Force repaint after all async operations complete
          if (map.current) {
            map.current.triggerRepaint();
            console.log('Triggered repaint after clearing selections');
          }
        };
        
        // Execute clearing and wait for it to complete before setting new selections
        await clearSelections();
        
        // Set new state selection
        const newStateId = feature.id as number;
        if (newStateId !== null && newStateId !== undefined) {
          console.log('Setting new state selection:', newStateId);
          selectedStateIdRef.current = newStateId;
          try {
            await map.current?.setFeatureState(
              { source: 'states', id: newStateId },
              { selected: true }
            );
            console.log('Successfully set state selection');
          } catch (error) {
            console.error('Failed to set state selection:', error);
          }
        } else {
          console.log('State feature has invalid ID:', feature.id);
        }
        
        // Zoom in and center on state
        const bbox = turf.bbox(feature);
        map.current?.fitBounds(bbox as [number, number, number, number], {
          padding: 50,
          duration: 1000,
          maxZoom: 6 // Allow zooming in much closer to see the state better
        });
      }
    });

    // Change cursor on hover for states
    map.current.on('mouseenter', 'state-fills', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'state-fills', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [districtData, stateData]);

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full" 
        style={{ minHeight: '600px' }} 
      />
      {tooltip.show && (
        <div
          className="absolute pointer-events-none bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm z-10"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translate(0, -100%)'
          }}
        >
          {tooltip.text}
        </div>
      )}

    </div>
  );
};

export default CongressionalMap; 