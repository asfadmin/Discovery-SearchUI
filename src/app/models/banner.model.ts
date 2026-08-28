export interface bannerapiresponse {
  banners: Banner[];
  systime: string;
}

export interface banner {
  id: string;
  text: string;
  name: string;
  type: string;
}
