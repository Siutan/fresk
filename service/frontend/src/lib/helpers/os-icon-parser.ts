const JSON_LIST_URL =
  "https://raw.githubusercontent.com/ngeenx/operating-system-logos/refs/heads/master/src/os-list.json";

const ICON_URL =
  "https://raw.githubusercontent.com/ngeenx/operating-system-logos/refs/heads/master/src/64x64";

const DEFAULT_ICON =
  "https://www.devopsschool.com/trainer/assets/images/os-logo.png";

export async function getOSIcon(osName: string) {
  let osNameLowerCase = osName.toLowerCase();

  if (osName === "macos") {
    osNameLowerCase = "mac";
  }

  // icon list is {code: "AND", name: "Android", slug: "android"} use the slug to get the icon
  const os = JSON.parse(
    await fetch(JSON_LIST_URL).then((res) => res.text())
  ).find((os: { slug: string }) => os.slug === osNameLowerCase);

  if (!os) {
    return DEFAULT_ICON;
  }

  return `${ICON_URL}/${os.slug}.png`;
}
