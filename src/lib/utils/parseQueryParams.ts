export const parseQueryParams = (query: Object) => {
  return Object.entries(query)
    .map(([key, value]) => encodeURI(key + "=" + value))
    .join("&");
};
