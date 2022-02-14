const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;

// ask Jorge why (req, res, next) => step is needed
// ==> It's basically a function returning another function (return (req, res, next))
// await fn returns a promise which is why we need Promis.resolve
