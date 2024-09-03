const DEFAULT_GRAVATAR_SIZE = 80;

async function gravatarHash(email) {
  const textAsBuffer = new TextEncoder().encode(email);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");

  return hash;
}

async function getGravatarAndColor(
  email,
  gravatarSize = DEFAULT_GRAVATAR_SIZE,
  dropPosition = { x: 50, y: 50 }
) {
  const hash = await gravatarHash(email);

  return new Promise((resolve) => {
    const canvasEl = document.createElement("canvas");
    const ctx = canvasEl.getContext("2d");
    canvasEl.width = gravatarSize;
    canvasEl.height = gravatarSize;

    const imgSrc = "https://gravatar.com/avatar/" + hash;
    const imgEl = new Image();
    imgEl.crossOrigin = "Anonymous";
    imgEl.addEventListener(
      "load",
      () => {
        ctx.drawImage(imgEl, 0, 0);

        const imageData = ctx.getImageData(
          dropPosition.x,
          dropPosition.y,
          gravatarSize,
          gravatarSize
        ).data;
        const rgbColor = [imageData[0], imageData[1], imageData[2]];

        resolve({ rgbColor, imgSrc });
      },
      { once: true }
    );
    imgEl.src = `${imgSrc}?s=${gravatarSize}`;
  });
}

document.addEventListener("click", async (event) => {
  const { target } = event;
  const selector = ".profile-card__imgBtn";
  const profileCardImgBtnEl = target.matches(selector)
    ? target
    : target.closest(selector);

  if (!profileCardImgBtnEl) {
    return;
  }

  const email = prompt("Change the gravatar?", "");

  if (!email) {
    return;
  }

  const { rgbColor, imgSrc } = await getGravatarAndColor(email);
  const profileCardEl = profileCardImgBtnEl.closest(".profile-card");
  const profileCardImgEl = profileCardImgBtnEl.children[0];

  profileCardImgEl.style.setProperty(
    "srcset",
    `${imgSrc}?s=${DEFAULT_GRAVATAR_SIZE * 2} 2x`
  );
  profileCardImgEl.src = `${imgSrc}?s=${DEFAULT_GRAVATAR_SIZE}`;
  profileCardEl.style.setProperty("--c", rgbColor.join(", "));
});
