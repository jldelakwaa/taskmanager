export function localId() {
  // randomUUID is unavailable on HTTP LAN origins; getRandomValues still works.
  return (
    "demo-" +
    Array.from(crypto.getRandomValues(new Uint32Array(4)), (value) =>
      value.toString(16).padStart(8, "0"),
    ).join("")
  );
}
