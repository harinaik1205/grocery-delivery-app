declare module 'react-native-config' {
  export interface NativeConfig {
    HOSTNAME?: string;
    ENV?: string;
    GOOGLE_MAPS_API_KEY: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
