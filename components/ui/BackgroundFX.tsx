export function BackgroundFX() {
  return (
    <div className="paper-grain pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* warm light from the top, like paper under a desk lamp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,252,244,0.9) 0%, rgba(243,239,228,0) 55%)",
        }}
      />
      {/* faint deckle vignette at the very edges */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 240px rgba(27,24,19,0.06)",
        }}
      />
    </div>
  );
}
