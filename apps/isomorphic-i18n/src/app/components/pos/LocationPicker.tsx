'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import {
  PiMapPin,
} from 'react-icons/pi';
import { XOctagon } from 'lucide-react';

interface LocationPickerProps {
  lang: string;
  apiKey: string;
  onLocationSelect: (lat: number | undefined, lng: number|undefined, address: string) => void;
  branchZones: { lat: number; lng: number; zoonRadius: number }[];
  initLat?: number;
  initLng?: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '250px',
};


export default function LocationPicker({ lang, apiKey, onLocationSelect, initLat = 30.0444, initLng = 31.2357, branchZones }: LocationPickerProps) {
  const defaultCenter = { lat: initLat, lng: initLng };
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (isLoaded && window.google) {
      setAutocompleteService(new google.maps.places.AutocompleteService());
      setPlacesService(new google.maps.places.PlacesService(document.createElement('div')));
    }
  }, [isLoaded]);
  useEffect(() => {
    if (initLat && initLng && window.google) {
      const isValidLocation = isInsideAnyZone(initLat, initLng);
      setError(!isValidLocation);
      if (isValidLocation) {
        fetchLocationDetails(initLat, initLng);
      }else{
        onLocationSelect(undefined, undefined, '');
      }
    }
  }, [lang]);

  const isInsideAnyZone = (lat: number, lng: number) => {
    return branchZones.some(zone => {
      const distance = google?.maps?.geometry?.spherical?.computeDistanceBetween(
        new google.maps.LatLng(lat, lng),
        new google.maps.LatLng(zone.lat, zone.lng)
      );
      return distance <= zone.zoonRadius;
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (autocompleteService && query) {
      autocompleteService.getPlacePredictions({ input: query }, (predictions) => {
        if (predictions && predictions.length > 0 && placesService) {
          const placeId = predictions[0].place_id;
          placesService.getDetails({ placeId }, (place) => {
            if (place && place.geometry && place.geometry.location) {
              const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              setSelectedLocation(location);
              const isValidLocation = isInsideAnyZone(location.lat, location.lng);
              setError(!isValidLocation);
              if (isValidLocation) {
                fetchLocationDetails(location.lat, location.lng);
              }else{
                onLocationSelect(undefined, undefined, '');
              }
            }
          });
        }
      });
    }
  };

  const fetchLocationDetails = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const isValidLocation = isInsideAnyZone(lat, lng);
        setError(!isValidLocation);
        if (isValidLocation) {
          onLocationSelect(lat, lng, results[0].formatted_address);
        }else{
          onLocationSelect(undefined, undefined, '');
        }
      } else {
        console.error('Geocode failed due to: ' + status);
      }
    });
  };

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setSelectedLocation(newLocation);
        const isValidLocation = isInsideAnyZone(newLocation.lat, newLocation.lng);
        setError(!isValidLocation);
        if (isValidLocation) {
          fetchLocationDetails(newLocation.lat, newLocation.lng);
        }else{
          onLocationSelect(undefined, undefined, '');
        }
      }
    },
    []
  );

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
  
          // Update selected location state
          setSelectedLocation(location);
          const isValidLocation = isInsideAnyZone(latitude, longitude);
          setError(!isValidLocation);

          if (isValidLocation) {
            fetchLocationDetails(latitude, longitude);
          }else{
            onLocationSelect(undefined, undefined, '');
          }
  
          // Re-center the map
          if (mapRef.current) {
            mapRef.current.setCenter(location);
            mapRef.current.setZoom(15);
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              alert("Please allow location access.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              alert("Location request timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
              alert("Failed to get your location.");
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }
  };  

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <div className='flex gap-2 items-center mb-2'>
        <input
          type="text"
          placeholder={lang === 'ar'? "ابحث عن الموقع": "Search location"}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 rounded-lg outline-0 border border-[rgb(227,227,227,1)] px-3 py-2 focus-within:border-dotted focus-within:border-primary  focus-within:outline-none disabled:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-0"
        />
        <button
          type='button'
          title='Location'
          onClick={handleGetCurrentLocation}
          className="my-2 p-2 border border-transparent hover:border-primary bg-primary text-white hover:text-primary hover:bg-transparent text-[24px] rounded"
        >
          <PiMapPin />
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={selectedLocation}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onClick={handleMapClick}
      >
        <Marker position={selectedLocation} draggable />

        {branchZones.map((zone, index) => (
          <Circle
            key={index}
            center={{ lat: zone.lat, lng: zone.lng }}
            radius={zone.zoonRadius}
            onClick={(event) => {
              if (event.latLng) {
                const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                setSelectedLocation(newLocation);
                fetchLocationDetails(newLocation.lat, newLocation.lng);
              }
            }}
            options={{
              fillColor: '#FF0000',
              fillOpacity: 0.2,
              strokeColor: '#FF0000',
              strokeOpacity: 0.4,
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>
      {error&&(
        <div 
          className={
            'basis-full text-xs mt-2 mb-2 self-start flex items-center gap-2 text-[#F24444] font-medium capitalize'
          }
        >
          <XOctagon size={16} className="mt-0" />

          {lang === 'ar'?"موقعك خارج منطقة التوصيل":"Your location is outside the delivery area"}
        </div>
      )}
    </div>
  );
}
