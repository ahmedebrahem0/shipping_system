import { ASSET_PROXY_BASE_PATH } from "@/constants/api-endpoints";

export const getAssetUrl = (path: string) => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${ASSET_PROXY_BASE_PATH}${normalizedPath}`;
};
