/** Résout une clé à points (ex: "nav.contact") dans un objet imbriqué. */
export function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj)
}
