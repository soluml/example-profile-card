async function gravatarHash(email) {
  const textAsBuffer = new TextEncoder().encode(email);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");

  return hash;
}

(async () => {
  const hash = await gravatarHash("benjamin@soluml.com");
  const imgSrc = "https://gravatar.com/avatar/" + hash;

  console.log({ imgSrc });
})();
