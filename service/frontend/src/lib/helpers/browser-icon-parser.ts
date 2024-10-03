const BASE_URL = "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0";

export async function getBrowserIcon(browserName: string) {
  const browserNameLowerCase = browserName.toLowerCase();
  return `${BASE_URL}/${browserNameLowerCase}/${browserNameLowerCase}.png`;
}
