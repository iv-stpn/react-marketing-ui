/** Measures the single-line (nowrap) rendered width of each text string. */
export function measureWidths(el: HTMLElement, texts: string[]) {
  const parent = el.parentElement;
  if (!parent) return texts.map(() => 0);

  const ghost = el.cloneNode();
  if (!(ghost instanceof HTMLElement)) return texts.map(() => 0);

  Object.assign(ghost.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  });
  parent.appendChild(ghost);
  const widths = texts.map((t) => {
    ghost.textContent = t;
    return ghost.getBoundingClientRect().width;
  });
  ghost.remove();
  return widths;
}
