export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000'
    : 'https://api.building-inspection.hammadtariq.me';
