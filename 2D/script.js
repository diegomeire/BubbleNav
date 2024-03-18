const injectSVG = () => {
  document.body.insertAdjacentHTML(
  "beforeend",
  `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display:none">
      <defs>
        <filter id="goo">
          <fegaussianblur
            in="SourceGraphic"
            stddeviation="30"
            result="blur"
          />
          <fecolormatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 29 -8"
            result="goo"
          />
          <fecomposite in="SourceGraphic" in2="goo" operator="atop"/>
        </filter>
      </defs>
    </svg>`);

};




const gooeyButtons = () => {
  const buttons = document.querySelectorAll("button[data-gooey]");
  const mouseDot = document.createElement("SPAN");
  const margin = 100;
  const size = 100;

  mouseDot.style.display = "block";
  mouseDot.style.position = "absolute";
  mouseDot.style.zIndex = -1;
  mouseDot.style.width = "100px";
  mouseDot.style.height = "100px";
  mouseDot.style.borderRadius = "50%";
  mouseDot.style.background = "yellow";
  mouseDot.style.visibility = "hidden";
  mouseDot.style.opacity = 0.5;

  injectSVG();

  document.body.style.filter = "url('#goo')";

  document.body.appendChild(mouseDot);

  const calcDistance = (mouse, bounds) => {
    const { clientX: mX, clientY: mY } = mouse;
    const distanceXLeft = Math.min(
    1,
    (mX - (bounds.x - margin)) / (margin + bounds.width / 2));

    const distanceXRight = Math.min(
    1,
    -(mX - (bounds.x + bounds.width + margin)) / (margin + bounds.width / 2));

    const distanceYTop = Math.min(
    1,
    (mY - (bounds.y - margin)) / (margin + bounds.height / 2));

    const distanceYBottom = Math.min(
    1,
    -(mY - (bounds.y + bounds.height + margin)) / (margin + bounds.height / 2));

    return Math.min(
    distanceXLeft,
    distanceXRight,
    distanceYTop,
    distanceYBottom);

  };

  window.addEventListener("mousemove", e => {
    const x = e.clientX;
    const y = e.clientY;
    let inside = buttons.length;

    buttons.forEach(button => {
      const bounds = button.getBoundingClientRect();

      if (
      x > bounds.x - margin &&
      x < bounds.x + bounds.width + margin &&
      y > bounds.y - margin &&
      y < bounds.y + bounds.height + margin)
      {
        inside++;
        const distance = calcDistance(e, bounds);
        mouseDot.size = size * distance;
        mouseDot.style.width = `${size * distance}px`;
        mouseDot.style.height = `${size * distance}px`;
        mouseDot.style.background = window.getComputedStyle(
        button).
        backgroundColor;
      } else {
        inside--;
      }
    });

    if (inside !== 0) {
      mouseDot.style.visibility = "visible";
      mouseDot.style.left = `${x - mouseDot.size / 2}px`;
      mouseDot.style.top = `${y - mouseDot.size / 2}px`;
    } else {
      mouseDot.style.visibility = "hidden";
    }
  });
};