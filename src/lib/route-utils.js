function extractQueryParams(route) {
  const {params: {query}} = route;
  if(!query) {
    return {};
  }
  const qp = new URLSearchParams(query);
  const retVal = {}
  for(const [key, val] of qp) {
    retVal[key] = val;
  }
  return retVal;
}

export {
  extractQueryParams
}