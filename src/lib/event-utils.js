function addListener(target, event, handler, once) {
  const h = once
      ? evt => {
        if(once) {
          target.removeEventListener(event, h);
        }
        handler(evt);
      }
      : handler;
  target.addEventListener(event, h);
  return () => {
    target.removeEventListener(event, h);
  };
}

export {
  addListener
};