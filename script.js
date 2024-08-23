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
  gravatarSize = 100,
  dropPosition = { x: 50, y: 50 }
) {
  const { promise, resolve } = Promise.withResolvers();

  const hash = await gravatarHash(email);

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

  return promise;
}

(async () => {
  const { rgbColor, imgSrc } = await getGravatarAndColor("benjamin@soluml.com");

  console.log({ rgbColor, imgSrc });
})();
