export interface BannerApiResponse {
  banners: Banner[];
  systime: string;
}

export interface Banner {
  text: string;
  name: string;
  type: string;
}
