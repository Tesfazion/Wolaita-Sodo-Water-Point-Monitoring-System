export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (!error) return fallback;
  const serverMessage = error.response?.data?.message;
  if (typeof serverMessage === 'string' && serverMessage.trim()) return serverMessage;
  if (error.message && error.message !== 'Request failed with status code 500') return error.message;
  return fallback;
}
