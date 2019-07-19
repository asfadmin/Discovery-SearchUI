export interface BannerApiResponse {
  banners: Banner[];
  systime: string;
}

export interface Banner {
  text: string;
  type: string;
  target: string[];
}
