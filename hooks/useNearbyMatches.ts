import { useCallback, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { SportsMatch } from '../context/SportsContext';

export type Coordinates = { latitude: number; longitude: number };
export const RADIUS_OPTIONS = [1, 3, 5, 10, 20] as const;
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const toRad = (n: number) => n * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
export function hasCoordinates(m: SportsMatch): m is SportsMatch & Coordinates {
  return typeof m.latitude === 'number' && Number.isFinite(m.latitude) && Math.abs(m.latitude) <= 90 &&
    typeof m.longitude === 'number' && Number.isFinite(m.longitude) && Math.abs(m.longitude) <= 180;
}
export function useNearbyMatches(matches: SportsMatch[]) {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [radius, setRadius] = useState<number>(3);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const locate = useCallback(async () => {
    setLocating(true); setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Localização não autorizada. Ative a permissão nas configurações do dispositivo para encontrar partidas próximas.');
        return;
      }
      const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setPosition({ latitude: result.coords.latitude, longitude: result.coords.longitude });
    } catch {
      setLocationError('Não foi possível obter sua localização. Verifique o GPS, a conexão e as permissões do navegador.');
    } finally { setLocating(false); }
  }, []);
  const located = useMemo(() => matches.filter(hasCoordinates), [matches]);
  const nearby = useMemo(() => !position ? located : located.filter(m => distanceKm(position, m) <= radius)
    .sort((a,b) => distanceKm(position,a) - distanceKm(position,b)), [located, position, radius]);
  const withoutCoordinates = useMemo(() => matches.filter(m => !hasCoordinates(m)), [matches]);
  return { position, radius, setRadius, locating, locationError, locate, nearby, withoutCoordinates };
}
