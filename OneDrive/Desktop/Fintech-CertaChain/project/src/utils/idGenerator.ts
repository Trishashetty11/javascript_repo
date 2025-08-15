export const generateCertificateId = (): string => {
  const randomString = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CERT-${randomString}`;
};