export type Ride = {
  id: string;
  driver: string;
  course: string;
  origin: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  price: number;
  seats: number;
  recurring: boolean;
  own: boolean;
};
export type Request = {
  id: string;
  rideId: string;
  date?: string;
  status: "pending" | "accepted" | "cancelled" | "completed";
  messages: { from: "you" | "driver"; text: string }[];
  feedback?: string;
};
export type AppData = { version: 1; rides: Ride[]; requests: Request[] };
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const campus = { lat: -22.9232789, lng: -49.9070705 };
// Campus centroid from OpenStreetMap way 355386390, not a pickup gate.
export function linearKm(lat: number, lng: number) {
  const rad = Math.PI / 180;
  const dlat = (campus.lat - lat) * rad,
    dlng = (campus.lng - lng) * rad;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat * rad) * Math.cos(campus.lat * rad) * Math.sin(dlng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export const places = [
  { name: "Centro de Ourinhos", lat: -22.979, lng: -49.87 },
  { name: "Vila Margarida", lat: -22.967, lng: -49.882 },
  { name: "Jardim Matilde", lat: -22.991, lng: -49.859 },
];
export function seed(): AppData {
  return {
    version: 1,
    rides: places.map((p, i) => ({
      id: `demo-${i}`,
      driver: ["Lucas Martins", "Beatriz Costa", "Rafael Almeida"][i],
      course: [
        "Engenharia · 6º período",
        "Administração · 4º período",
        "Direito · 8º período",
      ][i],
      origin: p.name,
      lat: p.lat,
      lng: p.lng,
      date: today(),
      time: ["18:20", "18:40", "19:00"][i],
      price: [12, 10, 15][i],
      seats: [2, 3, 1][i],
      recurring: i === 1,
      own: false,
    })),
    requests: [],
  };
}
export function availableSeats(ride: Ride, requests: Request[], date: string) {
  return Math.max(
    0,
    ride.seats -
      requests.filter(
        (q) =>
          q.rideId === ride.id &&
          (q.date || ride.date) === date &&
          ["accepted", "completed"].includes(q.status),
      ).length,
  );
}
export const storageKey = "unigo-app-demo-v1";
export function load(): AppData {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (
      raw?.version === 1 &&
      Array.isArray(raw.rides) &&
      Array.isArray(raw.requests) &&
      raw.rides.every(
        (r: Ride) =>
          typeof r.id === "string" &&
          typeof r.driver === "string" &&
          Number.isFinite(r.lat) &&
          Number.isFinite(r.lng) &&
          Number.isFinite(r.seats) &&
          typeof r.origin === "string" &&
          typeof r.course === "string" &&
          typeof r.date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
          typeof r.time === "string" &&
          /^\d{2}:\d{2}$/.test(r.time) &&
          Number.isFinite(r.price) &&
          r.price >= 0 &&
          r.price <= 100 &&
          Number.isInteger(r.seats) &&
          r.seats >= 0 &&
          r.seats <= 4 &&
          typeof r.recurring === "boolean" &&
          typeof r.own === "boolean",
      ) &&
      raw.requests.every(
        (r: Request) =>
          typeof r.id === "string" &&
          typeof r.rideId === "string" &&
          raw.rides.some((ride: Ride) => ride.id === r.rideId) &&
          ["pending", "accepted", "cancelled", "completed"].includes(
            r.status,
          ) &&
          Array.isArray(r.messages) &&
          r.messages.every(
            (m) =>
              ["you", "driver"].includes(m.from) &&
              typeof m.text === "string" &&
              m.text.length <= 1000,
          ) &&
          (r.feedback === undefined || typeof r.feedback === "string"),
      )
    )
      return raw;
  } catch {
    /* Recover incompatible demo data. */
  }
  return seed();
}
export const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
