export interface BannerApiResponse {
  banners: Banner[];
  systime: string;
}

export interface Banner {
  id: string;
  text: string;
  name: string;
  type: string;
}
