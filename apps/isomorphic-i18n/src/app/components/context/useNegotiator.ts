'use client';

import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '@/config/base-url';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';
import Cookies from 'js-cookie';

interface DeliveryOffer {
  deliveryId: string;
  // orderId: string;
  proposedPrice: number;
  numberOfOrders: number;
  routeDurationToBranch: number;
  routeDistanceToBranch: string;
  photoUrl: string;
  name: string;
}

interface BroadcastStatus {
  expired?: { orderId: string; message: string };
  cancelled?: { orderId: string; message: string };
}

interface DeliveryUnresponsive {
  orderId: string;
  deliveryId: string;
  message: string;
}

export function useNegotiator(orderId?: string) {
  const [accessToken, setAccessToken] = useState(GetCookiesClient('accessToken'));
  const [offers, setOffers] = useState<DeliveryOffer[]>([]);
  const [broadcastStatus, setBroadcastStatus] = useState<BroadcastStatus>({});
  const [deliveryUnresponsive, setDeliveryUnresponsive] = useState<DeliveryUnresponsive | null>(null);
  const [isOrderBroadcasted, setIsOrderBroadcasted] = useState<boolean | null>(null);
  const [isCheckingBroadcast, setIsCheckingBroadcast] = useState(true);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  async function refreshAccessToken() {
    const refreshToken = GetCookiesClient('refreshToken');
    if (!refreshToken) {
      window.location.href = '/signin';
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/Auth/RefreshAccessToken`, {
        method: 'POST',
        headers: { 
          'refreshToken': refreshToken,
          'Content-Type': 'application/json' 
        },
      });

      if (!res.ok) throw new Error('Token refresh failed');

      const data = await res.json();
      document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=Lax`;
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);  
      Cookies.remove('shopId');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('roles');
      Cookies.remove('branches');
      Cookies.remove('mainBranch');
      Cookies.remove('name');
      Cookies.remove('email');
      Cookies.remove('sellerId');
      Cookies.remove('userType');
      localStorage.clear();
          
      window.location.href = '/signin';
      return null;
    }
  }

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/negotiationHub`, {
        accessTokenFactory: () => accessToken || '',
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.onclose((error) => console.warn('🔌 Disconnected:', error));
    connection.onreconnecting((error) => console.warn('🔁 Reconnecting:', error));
    connection.onreconnected((connId) => console.log('✅ Reconnected:', connId));

    connection.on('DeliveryResponded', (response) => {
      const deliveryId = response.deliveryId;
      // const orderId = response.orderId;
      const proposedPrice = response.proposedFee;
      const numberOfOrders = response.numberOfOrders;
      const name = response.name;
      const photoUrl = response.photoUrl;
      const routeDurationToBranch = response.routeDurationToBranch;
      const routeDistanceToBranch = response.routeDistanceToBranch;
      console.log('📨 DeliveryResponded received: ', response);
      if(response.orderId == orderId){
        setOffers((prev) => {
          const updated = prev.filter((o) => o.deliveryId !== deliveryId);
          return [...updated, { deliveryId, proposedPrice, name, photoUrl, numberOfOrders, routeDistanceToBranch, routeDurationToBranch }];
        });
        setTimeout(() => {
          setOffers((prev) => prev.filter((o) => o.deliveryId !== deliveryId));
        }, 10000);
      }
    });

    connection.on('DeliveryCanceledOffer', (response) => {
      // console.warn('🚫 DeliveryCanceledOffer (●●) --->', response);
      // setOffers((prev) => prev.filter((o) => o.deliveryId !== response.deliveryId));
      // Optional: notify or log message
      console.log("🚫 DeliveryCanceledOffer (●'◡'●) ---> ", response);
    });

    connection.on('OrderBroadcastExpired', (response) => {
      console.warn('⏰ OrderBroadcastExpired:', response);
      setBroadcastStatus((prev) => ({ ...prev, expired: response }));
    });

    connection.on('OrderBroadcastCancelled', (response) => {
      console.info('🚫 OrderBroadcastCancelled:', response);
      setBroadcastStatus((prev) => ({ ...prev, cancelled: response }));
    });

    connection.on('DeliveryUnresponsive', (response) => {
      console.warn('🛑 DeliveryUnresponsive:', response);
      setDeliveryUnresponsive(response);
    });

    connection
      .start()
      .then(() => {
        console.log('📡 Connected to NegotiationHub');
        if (orderId) checkIfBroadcasted(true);
      })
      .catch((err) => console.error('❌ Connection failed', err));

    return () => {
      connection.stop().then(() => console.log('🧹 SignalR stopped'));
    };
  }, [accessToken]);

  const tryInvoke = async (method: string, ...args: any[]) => {
    if (!connectionRef.current || connectionRef.current.state !== 'Connected') return;

    try {
      const result = await connectionRef.current.invoke(method, ...args);
      console.log(`📤 ${method} invoked`, result);
      return result;
    } catch (error: any) {
      if (error?.message?.includes('Seller ID claim missing')) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          connectionRef.current = new signalR.HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/negotiationHub`, {
              accessTokenFactory: () => newToken,
            })
            .withAutomaticReconnect()
            .build();

          await connectionRef.current.start();
          const result = await connectionRef.current.invoke(method, ...args);
          console.log(`📤 ${method} retried after refresh`, result);
          return result;
        }
      } else {
        console.error(`❌ ${method} failed`, error);
      }
    }
  };

  const broadcastOrder = async () => {
    if (!orderId) return;
    console.log('📢 Sending BroadcastOrder...');
    await tryInvoke('BroadcastOrder', orderId, 1);
    await checkIfBroadcasted();
  };

  const checkIfBroadcasted = async (isInitial = false): Promise<boolean | null> => {
    if (!orderId) return null;
    if (isInitial) setIsCheckingBroadcast(true);
    console.log('🔍 Checking if order is broadcasted...');
    const result = await tryInvoke('CheckIfOrderBroadcasted', orderId);
    console.log('🔍 Checking Broadcast Result:', result);
    if (typeof result === 'boolean') setIsOrderBroadcasted(result);
    if (isInitial) setIsCheckingBroadcast(false);
    return typeof result === 'boolean' ? result : null;
  };

  const cancelBroadcastOrder = async () => {
    if (!orderId) return;
    console.log('🚫 Sending CancelOrderBroadcast...');
    await tryInvoke('CancelOrderBroadcast', orderId);
    await checkIfBroadcasted();
  };

  const acceptDeliveryOffer = (deliveryId: string) => {
    if (!orderId) return;
    console.log('✅ Accepting delivery offer:', deliveryId);
    const offer = offers.find((o) => o.deliveryId === deliveryId);
    if (!offer || !connectionRef.current) return;
    tryInvoke('SellerResponse', {
      orderId,
      deliveryId: offer.deliveryId,
      finalFees: offer.proposedPrice,
    });
    setOffers([]);
  };

  const rejectDeliveryOffer = (deliveryId: string) => {
    console.log('❌ Rejecting delivery offer:', deliveryId);
    setOffers((prev) => prev.filter((o) => o.deliveryId !== deliveryId));
  };

  return {
    offers,
    broadcastStatus,
    deliveryUnresponsive,
    isOrderBroadcasted,
    isCheckingBroadcast,
    broadcastOrder,
    checkIfBroadcasted,
    cancelBroadcastOrder,
    acceptDeliveryOffer,
    rejectDeliveryOffer,
  };
}
