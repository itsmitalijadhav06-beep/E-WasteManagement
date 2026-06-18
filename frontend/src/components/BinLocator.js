// src/components/BinLocator.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const blueIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });
const redIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });

const BinLocator = () => {
  const [position, setPosition] = useState([18.5204, 73.8567]); // Pune
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          fetchBins(latitude, longitude);
        },
        () => fetchBins(18.5204, 73.8567),
        { enableHighAccuracy: true }
      );
    } else {
      fetchBins(18.5204, 73.8567);
    }
  }, []);

  const fetchBins = async (lat, lng) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/bins/nearby?lat=${lat}&lng=${lng}&radius=30000`, // 30km = all 21
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBins(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load bins');
    } finally {
      setLoading(false);
    }
  };

  const updateBinFill = async (binId, newFill) => {
    try {
      await axios.post(
        `${API_URL}/bins/update/${binId}`,
        { fillLevel: parseInt(newFill) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Bin updated!');
      fetchBins(position[0], position[1]);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="loading">Loading map...</div>;

  return (
    <div className="map-page">
      <div className="map-header">
        <h2>E-Waste Bins Near You</h2>
        <p>{bins.length} bin(s) found</p>
      </div>
      <MapContainer
        key={bins.length} // Force re-render
        center={position}
        zoom={11} // ZOOM OUT TO SEE ALL 21
        className="map-container"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={blueIcon}>
          <Popup><b>You Are Here</b></Popup>
        </Marker>
        {bins.map(bin => (
          <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={redIcon}>
            <Popup>
              <div className="bin-popup">
                <h4>{bin.name}</h4>
                <p><strong>Address:</strong> {bin.address}</p>
                <p><strong>Fill:</strong> {bin.fillLevel}%</p>
                <div className="fill-bar">
                  <div style={{ width: `${bin.fillLevel}%` }} />
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/${position[0]},${position[1]}/${bin.lat},${bin.lng}`)}
                  className="directions-btn"
                >
                  GET DIRECTIONS
                </button>
                <div className="update-section">
                  <input type="number" min="0" max="100" defaultValue={bin.fillLevel} id={`fill-${bin.id}`} className="fill-input" />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`fill-${bin.id}`);
                      updateBinFill(bin.id, input.value);
                    }}
                    className="update-btn"
                  >
                    UPDATE
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BinLocator;