function extractQueryParams(route) {
  const {params: {query}} = route;
  if(!query) {
    return {};
  }
  const qp = new URLSearchParams(query);
  const retVal = {};
  for(const [key, val] of qp) {
    const existing = retVal[key];
    if(existing) {
      if(Array.isArray(existing)) {
        existing.push(val);
      }else {
        retVal[key] = [existing, val];
      }
      continue;
    }
    retVal[key] = val;
  }
  return retVal;
}

export {
  extractQueryParams
}