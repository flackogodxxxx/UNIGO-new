import { motion } from "motion/react";
import { useId, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
type P = [number, number];
const ink = "#0d1321",
  deep = "#1d2d44",
  slate = "#3e5c76",
  denim = "#748cab",
  shell = "#f0ebd8";
const wings: P[][] = [
  [
    [250, 176],
    [313, 160],
    [452, 205],
    [402, 240],
  ],
  [
    [425, 111],
    [494, 110],
    [523, 199],
    [459, 206],
  ],
  [
    [621, 123],
    [697, 139],
    [619, 215],
    [551, 196],
  ],
  [
    [634, 224],
    [814, 204],
    [836, 243],
    [646, 271],
  ],
  [
    [654, 279],
    [846, 328],
    [824, 378],
    [626, 326],
  ],
];
const annex: P[] = [
  [872, 124],
  [937, 144],
  [1060, 263],
  [1005, 285],
];
const blend = (a: P, b: P, t: number): P => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];
const points = (ps: P[]) => ps.map((p) => p.join(",")).join(" ");
function Roof({ outline, annex = false }: { outline: P[]; annex?: boolean }) {
  const [a, b, c, d] = outline;
  const drop = annex ? 15 : 10;
  return (
    <g
      data-obstacle="building"
      data-campus-part={annex ? "annex" : "radial-wing"}
    >
      <polygon
        points={points(outline.map(([x, y]) => [x + 6, y + drop + 3]))}
        fill={ink}
        opacity=".45"
      />
      <polygon
        points={points([d, c, [c[0], c[1] + drop], [d[0], d[1] + drop]])}
        fill={deep}
        stroke={denim}
        strokeWidth="1"
      />
      <polygon
        points={points([b, c, [c[0], c[1] + drop], [b[0], b[1] + drop]])}
        fill={slate}
      />
      <polygon
        points={points(outline)}
        fill={annex ? shell : denim}
        stroke={shell}
        strokeWidth="1.4"
        strokeOpacity=".65"
      />
      <polygon
        points={points([blend(a, d, 0.5), blend(b, c, 0.5), c, d])}
        fill={shell}
        opacity=".12"
      />
      {Array.from({ length: 14 }, (_, i) => {
        const t = (i + 1) / 15;
        const p = blend(a, b, t),
          q = blend(d, c, t);
        return (
          <line
            key={i}
            x1={p[0]}
            y1={p[1]}
            x2={q[0]}
            y2={q[1]}
            stroke={deep}
            strokeWidth=".8"
            opacity=".32"
          />
        );
      })}
      <path
        d={`M${points([blend(a, d, 0.5)])}L${points([blend(b, c, 0.5)])}`}
        stroke={shell}
        strokeWidth="1"
        opacity=".5"
      />
      {Array.from({ length: 8 }, (_, i) => {
        const p = blend(d, c, (i + 0.5) / 8);
        return (
          <path
            key={i}
            d={`M${p[0]} ${p[1] + 3}v${drop - 4}`}
            stroke={shell}
            strokeWidth={annex ? 4 : 2}
            opacity=".5"
          />
        );
      })}
    </g>
  );
}
function Tree({ x, y, r = 10 }: { x: number; y: number; r?: number }) {
  return (
    <g data-obstacle="vegetation" transform={`translate(${x} ${y})`}>
      <ellipse
        cy={r * 0.7}
        rx={r * 1.2}
        ry={r * 0.65}
        fill={ink}
        opacity=".45"
      />
      <path d={`M0 0v${r}`} stroke={denim} strokeWidth="2" />
      <circle cx={-r * 0.36} cy={-r * 0.2} r={r * 0.78} fill={slate} />
      <circle cx={r * 0.37} cy={-r * 0.33} r={r * 0.75} fill={slate} />
      <circle cy={-r * 0.65} r={r * 0.8} fill={denim} opacity=".6" />
    </g>
  );
}
function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g data-obstacle="vegetation" transform={`translate(${x} ${y})`}>
      <path d="M0 20L2-9" stroke={shell} strokeOpacity=".5" strokeWidth="2" />
      <path
        d="M2-9q-16-17-25-2q14-5 25 2q14-17 25-2q-15-5-25 2q-12-7-18 10q13-13 18-10q14-7 19 9q-13-12-19-9q-2-16 9-19q-5 12-9 19"
        fill={denim}
        opacity=".8"
      />
    </g>
  );
}
const trees: P[] = [
  [116, 310],
  [145, 260],
  [183, 219],
  [218, 191],
  [225, 153],
  [278, 140],
  [337, 132],
  [380, 125],
  [536, 128],
  [574, 121],
  [740, 145],
  [791, 159],
  [845, 196],
  [886, 276],
  [891, 333],
  [868, 398],
  [811, 449],
  [740, 471],
  [672, 498],
  [594, 516],
  [508, 519],
  [429, 504],
  [359, 482],
  [293, 413],
  [278, 369],
  [230, 316],
  [197, 273],
  [238, 267],
  [307, 271],
  [355, 251],
  [692, 390],
  [748, 410],
  [576, 449],
  [493, 412],
  [566, 354],
  [367, 152],
  [755, 296],
  [941, 370],
];
const road =
  "M78 324C87 224 181 137 305 105C432 67 626 68 758 115C886 158 935 271 913 360C886 461 727 539 538 540C365 542 205 484 126 409";
// Route and road share the same centerline; vehicles never cut across landscaping.
const approach = "M200 545Q236 548 252 526L269 507";
const arrival =
  "A42 26 0 0 0 311 481A42 26 0 0 0 305 466C320 451 327 424 345 407S359 388 365 380A80 49 0 0 1 345 350A80 49 0 0 1 399 304";
const accessRoad = approach + arrival;
const paths = [
  "M24 510L200 545" + accessRoad.slice("M200 545".length),
  "M734 650L200 545" + accessRoad.slice("M200 545".length),
];
export default function CampusArchitecture() {
  const id = useId().replaceAll(":", "");
  const [run, setRun] = useState(0);
  return (
    <div className="campus-scene campus-scene--clean campus-scene--aerial">
      <div className="scene-heading">
        <span>CAMINHOS QUE SE ENCONTRAM</span>
        <button
          className="replay-route"
          aria-label="Rever animação dos caminhos"
          onClick={() => setRun(run + 1)}
        >
          <ArrowCounterClockwise size={17} />
        </button>
      </div>
      <svg
        className="campus-svg"
        viewBox="0 0 1100 650"
        role="img"
        aria-labelledby={`${id}-title`}
      >
        <title id={`${id}-title`}>
          Campus em leque: cinco alas radiais, pátio circular aberto, duas
          rotatórias, via perimetral e quadras
        </title>
        <defs>
          <pattern
            id={`${id}-dots`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill={denim} opacity=".14" />
          </pattern>
        </defs>
        <rect width="1100" height="650" fill={`url(#${id}-dots)`} />
        <g transform="translate(0 10)">
          <path
            d="M47 359C61 204 185 101 366 65C591 16 839 90 931 194L1088 310L984 434L1019 579L738 622L309 555L64 445Z"
            fill={slate}
            opacity=".13"
          />
          <path
            data-road="approach"
            d="M24 510L734 650"
            stroke={slate}
            strokeWidth="31"
            opacity=".65"
          />
          <path
            d="M24 510L734 650"
            stroke={denim}
            strokeWidth="1"
            strokeDasharray="15 12"
            opacity=".55"
          />
          <g data-campus-part="perimeter-road">
            <path d={road} fill="none" stroke={slate} strokeWidth="31" />
            <path
              d={road}
              fill="none"
              stroke={denim}
              strokeWidth="1.4"
              strokeDasharray="9 12"
            />
            <path
              d="M78 324Q73 357 36 374L197 470Q211 479 227 481"
              fill="none"
              stroke={slate}
              strokeWidth="26"
            />
            <path
              d="M539 532L553 398Q546 366 535 339"
              fill="none"
              stroke={slate}
              strokeWidth="25"
            />
          </g>
          <path
            data-road="access"
            d={accessRoad}
            fill="none"
            stroke={slate}
            strokeWidth="20"
            strokeLinecap="round"
          />
          <g data-campus-part="roundabouts">
            <ellipse
              cx="425"
              cy="350"
              rx="80"
              ry="49"
              fill="none"
              stroke={slate}
              strokeWidth="20"
            />
            <ellipse
              cx="425"
              cy="350"
              rx="70"
              ry="39"
              fill="#3e5c7622"
              stroke={denim}
              strokeWidth="1"
            />

            <ellipse
              cx="269"
              cy="481"
              rx="42"
              ry="26"
              fill="none"
              stroke={slate}
              strokeWidth="19"
            />
            <ellipse
              cx="269"
              cy="481"
              rx="31"
              ry="16"
              fill={deep}
              stroke={denim}
              strokeWidth="1"
            />
          </g>
          <g fill="none" stroke={denim} strokeWidth="2" opacity=".45">
            <path d="M155 305L412 278M242 348L405 288M689 437L590 302M781 308L629 282M309 131L455 219M704 166L619 229" />
          </g>
          <g
            data-campus-part="courts"
            transform="translate(815 490) rotate(16)"
          >
            <rect
              width="148"
              height="93"
              rx="2"
              fill={slate}
              stroke={denim}
              strokeWidth="3"
            />
            <rect
              x="9"
              y="8"
              width="130"
              height="77"
              fill="none"
              stroke={shell}
              strokeWidth="1"
            />
            <path
              d="M74 8v77M9 25h21v42H9M139 25h-21v42h21"
              fill="none"
              stroke={shell}
              strokeWidth="1"
            />
            <ellipse
              cx="74"
              cy="46"
              rx="14"
              ry="13"
              fill="none"
              stroke={shell}
            />
            <path d="M-7 0v93M155 0v93" stroke={denim} strokeDasharray="4 5" />
          </g>
          <g data-campus-part="parking" stroke={denim} opacity=".45">
            {Array.from({ length: 11 }, (_, i) => (
              <path key={i} d={`M${569 + i * 22} ${507 - i * 5.1}l7 16`} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path key={`p${i}`} d={`M${560 - i * 2} ${386 + i * 17}l17 -2`} />
            ))}
          </g>
          {trees.slice(0, 18).map(([x, y], i) => (
            <Tree key={i} x={x} y={y} r={i % 3 === 0 ? 14 : 10} />
          ))}
          <Roof outline={annex} annex />
          {wings.slice(0, 3).map((outline, i) => (
            <Roof key={i} outline={outline} />
          ))}
          <g data-obstacle="courtyard" data-campus-part="open-courtyard">
            <path
              d="M426 220Q445 197 510 201Q585 199 619 226L645 264L625 295Q540 330 455 296L425 270Z"
              fill={deep}
              stroke={denim}
              strokeWidth="2"
              transform="translate(0 9)"
            />
            <path
              d="M426 220Q445 197 510 201Q585 199 619 226L645 264L625 295Q540 330 455 296L425 270Z M459 232Q484 213 524 219Q566 214 596 239L606 264Q569 298 489 279L459 264Z"
              fill={shell}
              fillRule="evenodd"
              opacity=".85"
              stroke={denim}
              strokeWidth="1"
            />
            <path
              d="M459 232Q484 213 524 219Q566 214 596 239L606 264Q569 298 489 279L459 264Z"
              fill={slate}
              opacity=".3"
            />
            <path
              d="M513 221L515 278M464 258L593 271"
              stroke={shell}
              strokeOpacity=".45"
              strokeWidth="3"
            />
            <circle cx="542" cy="256" r="9" fill={denim} />
            <circle cx="542" cy="256" r="4" fill={deep} />
            {[
              [470, 232],
              [486, 225],
              [563, 227],
              [581, 237],
              [594, 251],
              [578, 278],
            ].map(([x, y], i) => (
              <Tree key={i} x={x} y={y} r={7} />
            ))}
            <path
              d="M454 286v14M485 302v12M539 311v12M592 303v12M624 288v11"
              stroke={shell}
              strokeOpacity=".6"
              strokeWidth="3"
            />
          </g>
          {wings.slice(3).map((outline, i) => (
            <Roof key={i} outline={outline} />
          ))}
          {trees.slice(18).map(([x, y], i) => (
            <Tree key={i} x={x} y={y} r={i % 3 === 0 ? 13 : 9} />
          ))}
          {[
            [299, 217],
            [321, 225],
            [343, 233],
            [367, 241],
            [390, 249],
            [617, 337],
            [648, 348],
            [679, 360],
            [710, 371],
          ].map(([x, y], i) => (
            <Palm key={i} x={x} y={y} />
          ))}
          <Tree x={259} y={475} r={9} />
          <Tree x={277} y={480} r={8} />
          <g aria-hidden="true" data-campus-part="arrival-point">
            <path
              d="M407 292L426 283"
              stroke={shell}
              strokeWidth="2"
              strokeDasharray="3 4"
              opacity=".6"
            />
            <circle
              cx="399"
              cy="304"
              r="9"
              fill={deep}
              stroke={shell}
              strokeWidth="2"
            />
            <circle cx="399" cy="304" r="3" fill={shell} />
          </g>
          <g key={run}>
            {paths.map((d, i) => (
              <g key={i}>
                <motion.path
                  data-route="arrival"
                  d={d}
                  fill="none"
                  stroke={i === 0 ? shell : denim}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
                <circle r="5" fill={i === 0 ? shell : denim}>
                  <animateMotion
                    path={d}
                    dur={`${8 + i * 2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </g>
        </g>
      </svg>
      <div className="campus-signature">
        <span>Da entrada ao encontro.</span>
        <span>Interpretação do campus</span>
      </div>
    </div>
  );
}
