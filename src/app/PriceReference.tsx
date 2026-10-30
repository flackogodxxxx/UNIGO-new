import { useState } from "react";
import { places, linearKm, money } from "./model";
export default function PriceReference() {
  const [origin, setOrigin] = useState(0),
    [seats, setSeats] = useState(2),
    [price, setPrice] = useState("");
  const distance = linearKm(places[origin].lat, places[origin].lng);
  const suggested = Math.max(
    1,
    Math.round(distance / (Math.max(1, seats) + 1)),
  );
  return (
    <>
      <label>
        Ponto de saída
        <select
          name="origin"
          value={origin}
          onChange={(e) => setOrigin(Number(e.target.value))}
        >
          {places.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <div className="ua-form-row">
        <label>
          Lugares
          <input
            name="seats"
            type="number"
            min="1"
            max="4"
            required
            value={seats || ""}
            onChange={(e) => setSeats(Number(e.target.value))}
          />
        </label>
        <label>
          Contribuição (R$)
          <input
            name="price"
            type="number"
            min="0"
            max="100"
            step="0.5"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Você define o valor"
          />
        </label>
      </div>
      <div className="ua-price-reference">
        <strong>Uma referência, não uma tarifa.</strong>
        <p>
          {distance.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km em
          linha reta até o campus. Exemplo de cálculo: R$ 1/km por veículo,
          dividido entre motorista e {seats || 1} passageiro(s).
        </p>
        <button
          type="button"
          className="ua-secondary"
          onClick={() => setPrice(String(suggested))}
        >
          Usar referência de {money(suggested)}
        </button>
        <small>
          Estimativa linear, sem roteamento viário. O caminho real pode ser
          maior. O valor final é seu; a UNIGO não cobra comissão.
        </small>
      </div>
    </>
  );
}
