
import { useEffect, useRef } from 'react';

export default function ChatMap({ locations = [] }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dinamic import of Leaflet
    import('leaflet').then((L) => {
      // CSS of leaflet
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix for default markers icons in Leaflet + React
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Initialize map only once
      if (!leafletMap.current) {
        leafletMap.current = L.map(mapRef.current, {
          center: [6.244, -75.574],
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap © CARTO',
          maxZoom: 18,
        }).addTo(leafletMap.current);
      }

      // Remove previous markers
      if (markersLayer.current) {
        markersLayer.current.remove();
      }

      // Add markers
      if (locations.length > 0) {
        const markers = locations.map(loc => {
          if (!loc.lat || !loc.lng) return null;
          return L.marker([loc.lat, loc.lng])
            .bindPopup(`<strong>${loc.name}</strong><br/>Negocios: ${loc.count}`);
        }).filter(m => m !== null);

        markersLayer.current = L.layerGroup(markers).addTo(leafletMap.current);

        // Fit bounds if there are markers
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          leafletMap.current.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
      }
    });

    return () => {
      // Clean up if necessary
    };
  }, [locations]);

  return (
    <div style={{
      marginTop: '0.75rem',
      height: '220px',
      width: '100%',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      border: '1px solid #334155',
    }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
