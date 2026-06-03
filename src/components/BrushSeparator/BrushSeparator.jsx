import "./BrushSeparator.css";

const BRUSH_VARIANTS = {
  default: `<svg xmlns='http://www.w3.org/2000/svg' width='2000' height='180' viewBox='0 0 2000 180'><path fill='{{fill}}' d='M0 70 C 240 -30 480 160 720 85 C 960 -15 1200 130 1440 70 C 1680 20 1920 95 2000 95 L2000 180 L0 180 Z' opacity='0.96'/><path fill='{{fill}}' d='M0 90 C 220 10 460 180 700 95 C 940 20 1180 145 1420 90 C 1660 45 1900 115 2000 115 L2000 180 L0 180 Z' opacity='0.75'/><path fill='{{fill}}' d='M0 110 C 190 40 430 190 670 110 C 910 30 1150 160 1390 100 C 1630 50 1870 120 2000 120 L2000 180 L0 180 Z' opacity='0.55'/></svg>`,
  organic: `<svg xmlns='http://www.w3.org/2000/svg' width='2000' height='240' viewBox='0 0 2000 240'><path fill='{{fill}}' d='M0 88 C 92 118 188 132 302 128 C 438 124 538 84 652 90 C 744 95 792 126 874 134 C 1009 146 1130 102 1244 92 C 1366 81 1464 118 1572 124 C 1699 131 1815 98 1913 89 C 1957 85 1986 87 2000 90 L2000 240 L0 240 Z' opacity='0.98'/><path fill='{{fill}}' d='M0 103 C 108 136 224 148 338 140 C 460 132 564 101 666 107 C 764 113 822 145 908 151 C 1026 160 1149 122 1268 109 C 1382 97 1490 133 1600 138 C 1730 143 1846 112 1931 104 C 1966 101 1989 103 2000 105 L2000 240 L0 240 Z' opacity='0.78'/><path fill='{{fill}}' d='M0 121 C 102 150 224 162 352 154 C 473 147 582 118 684 123 C 792 129 848 157 943 164 C 1067 173 1183 140 1294 128 C 1405 117 1510 147 1621 151 C 1737 156 1852 131 1935 122 C 1968 118 1990 120 2000 122 L2000 240 L0 240 Z' opacity='0.56'/></svg>`
};

const buildBrushImage = (fillColor, variant = "default") => {
  const svgTemplate = BRUSH_VARIANTS[variant] || BRUSH_VARIANTS.default;
  const svg = svgTemplate.replaceAll("{{fill}}", fillColor);
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

function BrushSeparator({
  color = "#ffffff",
  className = "",
  absolute = false,
  height = "110px",
  offsetY = "45%",
  waveDistance = "34px",
  variant = "default"
}) {
  const classes = [
    "brush-separator",
    "brush-separator--bleed",
    absolute ? "brush-separator--absolute" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      aria-hidden="true"
      className={classes}
      style={{
        "--brush-height": height,
        "--brush-offset-y": offsetY,
        "--brush-wave-distance": waveDistance,
        "--brush-bg-image": buildBrushImage(color, variant)
      }}
    />
  );
}

export default BrushSeparator;
