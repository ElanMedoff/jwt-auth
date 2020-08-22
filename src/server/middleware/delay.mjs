export default async function delay(req, res, next) {
  setTimeout(() => {
    next();
  }, 1500);
}
