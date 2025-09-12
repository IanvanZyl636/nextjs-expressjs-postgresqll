/**
 * Forward cookies from Express response to Next.js
 */
export function getResponseSetCookies(res:Response) {
  const setCookieHeader = res.headers.get("set-cookie")

  if (!setCookieHeader) return [];

  const cookieStrings = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_\-]+=)/);

  if (!cookieStrings) return [];

  const cookies:{name: string, value: string, options: Record<string, any>}[] = [];

  cookieStrings.forEach((cookieStr) => {    
    const [nameValue, ...attrs] = cookieStr.split(";");
    const [name, value] = nameValue.split("=");    

    if (!name || !value) return [];
    
    const options: Record<string, any> = {};

    attrs.forEach((attr) => {
      const [attrName, attrValue] = attr.split("=").map((s) => s.trim());
      switch (attrName.toLowerCase()) {
        case "httponly":
          options.httpOnly = true;
          break;
        case "secure":
          options.secure = true;
          break;
        case "samesite":
          options.sameSite = attrValue as "strict" | "lax" | "none";
          break;
        case "max-age":
          options.maxAge = Number(attrValue);
          break;
        case "path":
          options.path = attrValue;
          break;
      }
    });

    cookies.push({name:name.trim(), value:value.trim(), options});
  });

  return cookies;
}