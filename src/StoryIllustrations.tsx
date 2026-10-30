import { motion } from "motion/react";
import { Check } from "@phosphor-icons/react";
export { default as CampusScene } from "./CampusArchitecture";
const C = {
  ink: "#0d1321",
  deep: "#1d2d44",
  slate: "#3e5c76",
  denim: "#748cab",
  shell: "#f0ebd8",
};
function Person({
  x,
  y,
  dark = false,
}: {
  x: number;
  y: number;
  dark?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="22" fill={dark ? C.slate : C.shell} stroke={C.denim} />
      <circle cy="-5" r="6" fill={dark ? C.shell : C.slate} />
      <path d="M-12 12q0-12 12-12t12 12" fill={dark ? C.shell : C.slate} />
    </g>
  );
}
export function RouteStory() {
  return (
    <svg
      className="route-story-svg"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Dois trajetos se encontram e continuam juntos"
    >
      <path
        d="M85 65C218 65 145 145 280 145S380 100 477 100M85 225C220 225 165 145 280 145"
        fill="none"
        stroke={C.slate}
        strokeWidth="16"
      />
      <motion.path
        d="M85 65C218 65 145 145 280 145S380 100 477 100"
        fill="none"
        stroke={C.shell}
        strokeWidth="2"
        strokeDasharray="5 9"
        animate={{ strokeDashoffset: [0, -56] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <path
        d="M85 225C220 225 165 145 280 145"
        fill="none"
        stroke={C.denim}
        strokeWidth="2"
        strokeDasharray="5 9"
      />
      <Person x={85} y={65} />
      <Person x={85} y={225} dark />
      <circle cx="280" cy="145" r="26" fill={C.shell} />
      <path
        d="M267 146l9 9 17-21"
        fill="none"
        stroke={C.deep}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="477" cy="100" r="32" fill={C.deep} stroke={C.denim} />
      <Person x={465} y={99} />
      <Person x={494} y={107} dark />
    </svg>
  );
}
export function TrustNetwork() {
  return (
    <div className="network-panel">
      <svg
        viewBox="0 0 620 210"
        role="img"
        aria-label="Vínculo acadêmico conecta alunos, professores e colaboradores"
      >
        <g fill="none" stroke={C.denim} strokeOpacity=".5">
          <path d="M100 105C165 105 185 55 275 105M345 105C435 55 455 105 520 105M160 170C230 170 240 135 275 105M345 105C385 135 390 170 460 170" />
          <ellipse
            cx="310"
            cy="105"
            rx="235"
            ry="82"
            strokeDasharray="3 8"
            opacity=".4"
          />
        </g>
        <Person x={100} y={105} />
        <Person x={520} y={105} dark />
        <Person x={160} y={170} dark />
        <Person x={460} y={170} />
        <circle cx="310" cy="105" r="48" fill={C.deep} stroke={C.denim} />
        <circle cx="310" cy="105" r="39" fill="none" stroke={C.slate} />
        <text
          x="310"
          y="112"
          textAnchor="middle"
          fontSize="25"
          fontWeight="600"
          fill={C.shell}
        >
          unigo
        </text>
      </svg>
      <span>
        <Check size={15} /> Vínculo acadêmico + histórico compartilhado
      </span>
    </div>
  );
}
