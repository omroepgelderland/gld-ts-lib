interface NimbusJWTMetadata {
  header: {
    alg: string;
    typ: "JWT";
  };
  payload: {
    type: string;
    scopes: string[];
    env: string;
    user: {
      id: number;
      readRate: number;
      firstName: string;
      lastName: string;
      loginName: string;
      groups: string[];
    };
    iat: number;
    exp: number;
  };
}

/**
 * Creates DOM-elements from a template imported by html-loader.
 *
 * @returns Root-elements of the template.
 */
function get_html_template(imported_template: string): HTMLCollection {
  const template = document.createElement("template");
  template.innerHTML = imported_template.trim();
  return template.content.children;
}

/**
 * Creates a single DOM-element from a template imported by html-loader.
 *
 * @param imported_template - HTML-string.
 *
 * @returns DOM-element.
 *
 * @throws Error if the template has more or less than one single root-element.
 */
function get_html_template_single<T extends Element>(
  imported_template: string,
): T {
  const template = get_html_template(imported_template);
  if (template.length !== 1) {
    throw new Error("Template-html must have exacly one root-element.");
  }
  return template.item(0) as T;
}

/**
 * @param elementId - Element ID
 *
 * @returns Element
 *
 * @throws Error when the element does not exist.
 */
function getElementById<T extends HTMLElement>(elementId: string): T {
  const elem = document.getElementById(elementId);
  if (elem === null) {
    throw new Error(`#${elementId} niet gevonden`);
  }
  return elem as T;
}

function assert_notnil<T>(arg: T | null | undefined): T {
  if (arg == null) {
    throw new Error();
  }
  return arg;
}

function querySelector<T extends Element>(
  selectors: string,
  context: Document | Element = document,
): T {
  const elem = context.querySelector<T>(selectors);
  if (elem === null) {
    throw new Error(`Selector ${selectors} not found`);
  }
  return elem;
}

function querySelectorAllTagName<K extends keyof HTMLElementTagNameMap>(
  tag_name: K,
  selectors = "",
  context: Document | Element = document,
): NodeListOf<HTMLElementTagNameMap[K]> {
  selectors = tag_name + selectors;
  return context.querySelectorAll<HTMLElementTagNameMap[K]>(selectors);
}

function querySelectorTagName<K extends keyof HTMLElementTagNameMap>(
  tag_name: K,
  selectors = "",
  context: Document | Element = document,
): HTMLElementTagNameMap[K] {
  selectors = tag_name + selectors;
  const elem = context.querySelector<HTMLElementTagNameMap[K]>(selectors);
  if (elem === null) {
    throw new Error(`Selector ${selectors} not found`);
  }
  return elem;
}

function decode_nimbus_access_token_segment(segment: string): string {
  let t = segment.replace(/-/g, "+").replace(/_/g, "/");
  switch (t.length % 4) {
    case 0:
      break;
    case 2:
      t += "==";
      break;
    case 3:
      t += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }
  try {
    return decodeURIComponent(
      atob(t).replace(/(.)/g, (match, p1) => {
        let n = p1.charCodeAt(0).toString(16).toUpperCase();
        return n.length < 2 && (n = "0" + n), "%" + n;
      }),
    );
  } catch {
    return atob(t);
  }
}

function decode_nimbus_jwt(token: string): NimbusJWTMetadata {
  try {
    const parts = token.split(".");
    return {
      header: JSON.parse(decode_nimbus_access_token_segment(parts[0])),
      payload: JSON.parse(decode_nimbus_access_token_segment(parts[1])),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : token;
    throw new Error(`Invalid token specified: ${msg}`);
  }
}

function is_dev(): boolean {
  return window.location.host === "webdev.gld.nl";
}

/**
 * Compares two maps.
 *
 * @param map1
 * @param map2
 * @param cmp_value - Function for comparing two map values.
 */
function maps_equal<K, V>(
  map1: Map<K, V>,
  map2: Map<K, V>,
  cmp_value: (v1: V, v2: V) => boolean,
): boolean {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [k, v] of map1) {
    const v2 = map2.get(k);
    if (v2 == null) {
      return false;
    }
    if (!cmp_value(v, v2)) {
      return false;
    }
  }
  return true;
}

export {
  get_html_template_single,
  get_html_template,
  getElementById,
  assert_notnil,
  querySelector,
  querySelectorAllTagName,
  querySelectorTagName,
  decode_nimbus_jwt,
  is_dev,
  maps_equal,
};
