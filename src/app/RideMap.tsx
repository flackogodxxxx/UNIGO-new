import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { campus, type Ride } from "./model";
export default function RideMap({
  rides,
  selected,
  onSelect,
}: {
  rides: Ride[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    map = useRef<L.Map | null>(null),
    layer = useRef<L.LayerGroup | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const callback = useRef(onSelect);
  useEffect(() => {
    callback.current = onSelect;
  }, [onSelect]);
  useEffect(() => {
    if (!host.current) return;
    const m = L.map(host.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([-22.978, -49.875], 13);
    map.current = m;
    L.control.zoom({ position: "bottomright" }).addTo(m);
    const tiles = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    ).addTo(m);
    tiles.on("tileerror", () => {
      setFailed(true);
      setLoading(false);
    });
    let loaded = false;
    tiles.on("tileload", () => {
      loaded = true;
      setLoading(false);
      setFailed(false);
    });
    const timeout = window.setTimeout(() => {
      if (!loaded) {
        setLoading(false);
        setFailed(true);
      }
    }, 10000);
    L.marker([campus.lat, campus.lng], {
      icon: L.divIcon({
        className: "campus-map-marker",
        html: "<span>UNIFIO</span>",
        iconSize: [74, 30],
      }),
      title: "UniFio - referência do campus",
    }).addTo(m);
    m.fitBounds(
      [
        [campus.lat, campus.lng],
        [-22.999, -49.848],
      ],
      { padding: [45, 65] },
    );
    layer.current = L.layerGroup().addTo(m);
    const resize = new ResizeObserver(() => m.invalidateSize());
    resize.observe(host.current);
    return () => {
      window.clearTimeout(timeout);
      resize.disconnect();
      m.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);
  useEffect(() => {
    if (!map.current || !layer.current) return;
    layer.current.clearLayers();
    rides.forEach((r) => {
      const active = r.id === selected;
      const marker = L.marker([r.lat, r.lng], {
        icon: L.divIcon({
          className: "ride-map-marker",
          html: `<span class="${active ? "chosen" : ""}">R$ ${r.price.toFixed(0)}</span>`,
          iconSize: [62, 34],
          iconAnchor: [31, 17],
        }),
        title: `Carona de ${r.driver}`,
        keyboard: true,
      }).on("click", () => callback.current(r.id));
      marker.addTo(layer.current!);
    });
    const chosen = rides.find((r) => r.id === selected);
    if (chosen)
      map.current.fitBounds(
        [
          [chosen.lat, chosen.lng],
          [campus.lat, campus.lng],
        ],
        {
          padding: [70, 70],
          maxZoom: 13,
          animate: true,
          duration: 0.45,
        },
      );
  }, [rides, selected]);
  return (
    <div className="ride-map-shell">
      <div
        ref={host}
        className="ride-map"
        aria-label="Mapa de pontos de saída em Ourinhos"
      />
      <div className="map-caption">
        Ourinhos e região <span>Pontos aproximados · não é navegação</span>
      </div>
      {loading && !failed && (
        <p className="map-warning" role="status">
          Carregando o mapa… A lista já está disponível.
        </p>
      )}
      {failed && (
        <p className="map-warning" role="status">
          O mapa externo está indisponível. Você pode continuar pela lista de
          caronas.
        </p>
      )}
    </div>
  );
}
