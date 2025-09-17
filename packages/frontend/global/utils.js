export function empty (object) {
    Object.keys(object).forEach(key => delete object[key]);
}

export function get (object, path) {
    return path?.split('.').reduce((value, key) => value?.[key], object)
}

export function render (string = '', data) {
    return string.replace(/{{ *([\w.]+) *}}/g, (match, path) => get(data, path))
}

export function getProp (name, target) {
    const { SSR } = import.meta.env;
    return !SSR && parseFloat(getComputedStyle(target ?? document.body).getPropertyValue(name))
}

export function download (id) {
    window.open(`${BACKEND_URL}/assets/${id}?download=true`, '_blank').focus();
}

export function checkSlug ({ name, params, meta }, key) {
    const { id, slug } = meta.preload[key];
    if (!params.slug || params.slug !== slug) return { name, params: { id, slug }};
}

export function getListItem (list, value) {
    return list.find(item => item.value === value);
}

export function getListText (list, value) {
    const item = getListItem.bind(null, list);
    return Array.isArray(value) ? value.map(value => item(value)?.text).join(', ') : item(value)?.text;
}

export function clone (object) {
    return JSON.parse(JSON.stringify(object));
}
