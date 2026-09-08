import { useState } from 'react';
import { Heading, Callout } from '../components/UI';
export function Lattice() {
  const [zoom, setZoom] = useState(40);
  const [x, setX] = useState(37);
  const [y, setY] = useState(23);
  const [rotation, setRotation] = useState(12);
  const points = Array.from({ length: 225 }, (_, i) => ({
    x: ((i % 15) - 7) * zoom,
    y: (Math.floor(i / 15) - 7) * zoom,
  }));
  const closest = [...points]
    .sort(
      (a, b) =>
        (a.x - x) ** 2 + (a.y - y) ** 2 - ((b.x - x) ** 2 + (b.y - y) ** 2),
    )
    .slice(0, 4);
  return (
    <>
      <Heading
        eyebrow="MATHEMATICAL INTUITION"
        title="What does lattice-based mean?"
      >
        <p>
          A lattice can be visualized as a repeating arrangement of points. Real
          lattice-based cryptography operates in much higher-dimensional
          mathematical structures.
        </p>
      </Heading>
      <Callout>
        This is an analogy for intuition. ML-KEM and ML-DSA use much
        higher-dimensional algebraic structures.
      </Callout>
      <div className="card">
        <svg
          className="lattice"
          viewBox="-300 -220 600 440"
          role="img"
          aria-label="A two-dimensional lattice with a movable coral target and its four nearby points"
        >
          <g transform={`rotate(${rotation})`}>
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={closest.includes(p) ? 6 : 2.5}
                fill={closest.includes(p) ? '#99f5bc' : '#57766f'}
              />
            ))}
            {closest.map((p, i) => (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={p.x}
                y2={p.y}
                stroke="#93ddbd"
                strokeDasharray="4 5"
              />
            ))}
            <circle cx={x} cy={y} r="8" fill="#ffb49b" />
            <text x={x + 14} y={y - 10} fill="#ffcfbd" fontSize="14">
              Target
            </text>
          </g>
        </svg>
        <div className="slider-grid">
          {[
            ['Zoom', zoom, setZoom, 20, 65],
            ['Rotation', rotation, setRotation, -45, 45],
            ['Target X', x, setX, -170, 170],
            ['Target Y', y, setY, -150, 150],
          ].map(([label, value, setter, min, max]) => (
            <label key={String(label)}>
              {String(label)}: {Number(value)}
              <input
                type="range"
                min={Number(min)}
                max={Number(max)}
                value={Number(value)}
                onChange={(e) =>
                  (setter as (n: number) => void)(Number(e.target.value))
                }
              />
            </label>
          ))}
        </div>
      </div>
      <h2>Easy to picture is not easy to break</h2>
      <p>
        In two dimensions, nearby points are easy to find by inspection.
        High-dimensional structures and carefully chosen noise make related
        problems difficult. Module-Learning With Errors, central to ML-KEM,
        concerns distinguishing or recovering structure from noisy algebraic
        equations. ML-DSA also relies on module-lattice problems.
      </p>
      <p>
        This picture does not demonstrate the actual security reduction or an
        attack on either standard. Rotation and zoom only change our view; they
        do not change a security level. The standards define exact rings,
        distributions, encodings, and parameter choices that this analogy
        intentionally leaves out.
      </p>
    </>
  );
}
