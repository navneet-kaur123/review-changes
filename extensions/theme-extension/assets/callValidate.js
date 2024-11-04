document.addEventListener("DOMContentLoaded", function () {
  const shopId = window.shopDomain;
  generateToken(shopId);
});

async function generateToken(shopId) {
  const cookieString = document.cookie;
  const jwtTokenCookie = cookieString
    .split("; ")
    .find((row) => row.startsWith("jwtaccessToken="));
  const accessToken = jwtTokenCookie ? jwtTokenCookie.split("=")[1] : null;

  const url = "https://grand-glen-reduces-seating.trycloudflare.com/call-validate";
  const data = {
    shop: shopId,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      var responseData = await response.json();
      if (responseData.body.token != null) {
        let accessToken = responseData.body.token.accessToken;
        let refreshToken = responseData.body.token.refreshToken;
        const access = "jwtaccessToken";
        const refresh = "jwtrefreshToken";

        const maxAge = 24 * 60 * 60;
        document.cookie = `${access}=${accessToken};Max-Age=${maxAge};path=/;SameSite=Lax;Secure`;
        document.cookie = `${refresh}=${refreshToken};Max-Age=${maxAge};path=/;SameSite=Lax;Secure`;
      }
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function checkToken() {
  const shopId = window.shopDomain;
  const cookieString = document.cookie;
  const jwtTokenCookie = cookieString
    .split("; ")
    .find((row) => row.startsWith("jwtaccessToken="));
  const jwtTokenCookie1 = cookieString
    .split("; ")
    .find((row) => row.startsWith("jwtrefreshToken="));

  const jwtaccessToken = jwtTokenCookie ? jwtTokenCookie.split("=")[1] : null;
  const jwtRefreshToken = jwtTokenCookie1
    ? jwtTokenCookie1.split("=")[1]
    : null;

  const url = "https://grand-glen-reduces-seating.trycloudflare.com/call-validate-first";
  const data = {
    shop: shopId,
    jwtaccessToken,
    jwtRefreshToken,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtaccessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      var responseData = await response.json();
      if (responseData.body.token) {
        if (responseData.body.token.accessToken) {
          const maxAge = 24 * 60 * 60;
          document.cookie = `jwtaccessToken=${responseData.body.token.accessToken};Max-Age=${maxAge};path=/;SameSite=Lax;Secure`;
          document.cookie = `jwtrefreshToken=${responseData.body.token.refreshToken};path=/;Max-Age=${maxAge};SameSite=Lax;Secure`;
        } else if (responseData.body.token == "refresh the page") {
          const access = "jwtaccessToken";
          const refresh = "jwtrefreshToken";
          document.cookie = `${access}=; Max-Age=-99999999; path=/; SameSite=Lax; Secure;`;
          document.cookie = `${refresh}=; Max-Age=-99999999; path=/; SameSite=Lax; Secure;`;
          const writePrompt = document.querySelector("#refresh-the-page");
          writePrompt.classList.add("show");
        } else if (responseData.body.token.newAccessToken) {
          const maxAge = 24 * 60 * 60;
          const newaccessToken = responseData.body.token.newAccessToken;
          document.cookie = `jwtaccessToken=${newaccessToken};Max-Age=${maxAge};path=/;SameSite=Lax;Secure`;
        }
      }
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}
