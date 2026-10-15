import ReactNativeBlobUtil from 'react-native-blob-util';

export function toStandardBase64(base64url: string) {
  let b64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad === 2) b64 += '==';
  else if (pad === 3) b64 += '=';
  return b64;
}

export const urlToBase64Fetch = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string); // data URI
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadImage = async (url: string, id: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/share_${id}.${ext}`;

  const res = await ReactNativeBlobUtil.config({ fileCache: true, path }).fetch(
    'GET',
    url,
  );
  return { path: res.path(), mime: ext === 'png' ? 'image/png' : 'image/jpeg' };
};

export function getErrorString(error: any, defaultValue?: string) {
  let e = defaultValue || 'Something went wrong. Please try again';
  if (typeof error === 'string') {
    e = error;
  } else if (error && error.message) {
    e = error.message;
  } else if (error && error.props) {
    e = error.props;
  }
  return e;
}
