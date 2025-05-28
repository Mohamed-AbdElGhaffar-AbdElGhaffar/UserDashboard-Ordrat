'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, Circle } from '@react-google-maps/api';
import { PiMapPin } from 'react-icons/pi';
import { Button } from 'rizzui';

interface LocationPickerProps {
  apiKey: string;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  radius: number | '';
  setRadius: (value: number | '') => void;
  initLat?: number;
  initLng?: number;
  lang: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

export default function LocationPicker({
  apiKey,
  onLocationSelect,
  radius,
  setRadius,
  initLat = 30.0444,
  initLng = 31.2357,
  lang
}: LocationPickerProps) {
  const text = {
    searchPlaceholder: lang === 'ar' ? 'ابحث عن الموقع' : 'Search location',
    enterRadius: lang === 'ar' ? 'أدخل نطاق التغطية بالأمتار' : 'Enter Coverage Zone in meters',
    locationButton: lang === 'ar' ? 'موقعي' : 'My Location',
    errorLoadingMap: lang === 'ar' ? 'حدث خطأ أثناء تحميل الخريطة' : 'Error loading map',
    loadingMap: lang === 'ar' ? 'جاري تحميل الخريطة...' : 'Loading map...',
    invalidLocation: lang === 'ar' ? 'موقع غير صالح' : 'Invalid Location',
    allowLocationAccess: lang === 'ar' ? 'يرجى السماح بالوصول إلى الموقع' : 'Please allow location access',
    locationUnavailable: lang === 'ar' ? 'معلومات الموقع غير متوفرة' : 'Location information is unavailable',
    timeout: lang === 'ar' ? 'انتهت مهلة طلب الموقع' : 'Location request timed out',
    unknownError: lang === 'ar' ? 'حدث خطأ غير معروف' : 'An unknown error occurred',
  };

  const defaultCenter = { lat: initLat, lng: initLng };
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  // const [radius, setRadius] = useState<number | ''>('');
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
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
              fetchLocationDetails(location.lat, location.lng);
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
        onLocationSelect(lat, lng, results[0].formatted_address);
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
        fetchLocationDetails(newLocation.lat, newLocation.lng);
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

          setSelectedLocation(location);
          fetchLocationDetails(latitude, longitude);

          if (mapRef.current) {
            mapRef.current.setCenter(location);
            mapRef.current.setZoom(15);
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              alert(text.allowLocationAccess);
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              alert(text.locationUnavailable);
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              alert(text.timeout);
              break;
            default:
              console.error('An unknown error occurred.');
              alert(text.unknownError);
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert(text.unknownError);
    }
  };

  if (loadError) return <div>{text.errorLoadingMap}</div>;
  if (!isLoaded) return <div>{text.loadingMap}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder={text.searchPlaceholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 border rounded mb-2"
      />
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
        {/* {radius && ( */}
          <Circle
            center={selectedLocation}
            radius={Number(radius)}
            options={{
              fillColor: '#f43f5e',
              fillOpacity: 0.15,
              strokeColor: '#f43f5e',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        {/* )} */}
      </GoogleMap>
      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          title={text.locationButton}
          onClick={handleGetCurrentLocation}
          className="mb-2 p-2 text-[24px] rounded"
        >
          <PiMapPin />
        </Button>
        <input
          type="number"
          placeholder={text.enterRadius}
          value={radius}
          onChange={(e) => setRadius(e.target.value ? parseInt(e.target.value, 10) : '')}
          className="w-[200px] p-2 border rounded mb-2"
        />
      </div>
    </div>
  );
}
