'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

type GoogleMapProps = {
  centerLatitude: number;
  centerLongitude: number;
  coverageRadius: number;
  isLoaded?: boolean;
};

const GoogleMap = ({ centerLatitude, centerLongitude, coverageRadius, isLoaded = true }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      if (window.google?.maps) {
        // If the API is already loaded, just initialize the map
        initializeMap();
        return;
      }
      
      // Create script element to load Google Maps API
      const googleMapsScript = document.createElement('script');
      const apiKey = 'AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA'; // Replace with your actual API key
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      googleMapsScript.onload = () => {
        initializeMap();
      };
      
      document.head.appendChild(googleMapsScript);
      
      return () => {
        // Clean up script tag if component unmounts during loading
        if (googleMapsScript.parentNode) {
          googleMapsScript.parentNode.removeChild(googleMapsScript);
        }
      };
    };
    
    // Initialize the map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Create map
      const center = { lat: centerLatitude, lng: centerLongitude };
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 15,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      // Add marker for the center position
      new google.maps.Marker({
        position: center,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#f43f5e',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8
        }
      });
      
      // Add circle for coverage radius
      new google.maps.Circle({
        strokeColor: '#f43f5e',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#f43f5e',
        fillOpacity: 0.15,
        map,
        center,
        radius: coverageRadius
      });
      
      setMapLoaded(true);
    };
    
    if (isLoaded) {
      loadGoogleMapsAPI();
    }
    
  }, [centerLatitude, centerLongitude, coverageRadius, isLoaded]);
  
  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-red-400/20 animate-pulse"></div>
        <MapPin size={32} className="text-red-500 animate-bounce" />
      </div>
    );
  }
  
  return (
    <>
      <div ref={mapRef} className="absolute inset-0"></div>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-0">
          <div className="w-64 h-64 rounded-full bg-red-400/20 animate-pulse"></div>
          <MapPin size={32} className="text-red-500 animate-bounce" />
        </div>
      )}
    </>
  );
};

export default GoogleMap;