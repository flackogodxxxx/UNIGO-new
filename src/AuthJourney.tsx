import { useEffect, useRef } from "react";
import { User, CarProfile, Buildings, Handshake } from "@phosphor-icons/react";

export default function AuthJourney() {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const node = svg.current;
    if (!node) return;
    let visible = true;
    const sync = () => {
      if (visible && !document.hidden) node.unpauseAnimations();
      else node.pauseAnimations();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  const branches = [
    "M72 64H118Q149 64 149 96V102Q149 130 180 130H206",
    "M72 196H118Q149 196 149 164V158Q149 130 180 130H206",
  ];
  return (
    <figure className="auth-journey">
      <svg
        ref={svg}
        viewBox="0 0 480 264"
        role="img"
        aria-labelledby="auth-journey-title"
      >
        <title id="auth-journey-title">
          Você e quem dirige se encontram e seguem juntos até o campus
        </title>
        <g fill="none" stroke="#748cab" strokeWidth="2">
          {branches.map((d) => (
            <path key={d} d={d} opacity=".55" />
          ))}
          <path d="M262 130H386" stroke="#f0ebd8" opacity=".7" />
        </g>
        {branches.map((d, i) => (
          <circle key={d} r="4" fill={i ? "#a4b3c6" : "#f0ebd8"}>
            <animateMotion
              path={d}
              dur="12s"
              keyPoints="0;1;1"
              keyTimes="0;0.35;1"
              calcMode="spline"
              keySplines="0.4 0 0.2 1;0 0 1 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0;0"
              keyTimes="0;0.04;0.31;0.35;1"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
        ))}
        <circle r="5" fill="#f0ebd8">
          <animateMotion
            path="M262 130H386"
            dur="12s"
            keyPoints="0;0;1;1"
            keyTimes="0;0.39;0.8;1"
            calcMode="spline"
            keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0;1;1;0;0"
            keyTimes="0;0.39;0.42;0.76;0.8;1"
            dur="12s"
            repeatCount="indefinite"
          />
        </circle>
        <g className="journey-node">
          <rect x="20" y="38" width="52" height="52" rx="16" />
          <User x={34} y={52} width={24} height={24} />
          <text x="46" y="112">
            Você
          </text>
        </g>
        <g className="journey-node">
          <rect x="20" y="170" width="52" height="52" rx="16" />
          <CarProfile x={33} y={184} width={26} height={26} />
          <text x="46" y="244">
            Quem dirige
          </text>
        </g>
        <g className="journey-node journey-node--meeting">
          <rect x="206" y="102" width="56" height="56" rx="18" />
          <Handshake x={220} y={116} width={28} height={28} />
          <text x="234" y="185">
            O encontro
          </text>
        </g>
        <g className="journey-node">
          <rect x="386" y="100" width="60" height="60" rx="18" />
          <Buildings x={402} y={116} width={28} height={28} />
          <text x="416" y="185">
            Campus
          </text>
        </g>
      </svg>
      <figcaption>
        <span>Dois trajetos se encontram.</span>
        <strong>Daqui em diante, vocês vão juntos.</strong>
      </figcaption>
    </figure>
  );
}
