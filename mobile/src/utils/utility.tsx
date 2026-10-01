import ReactNativeBlobUtil from 'react-native-blob-util';
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
