var productIdInput = document.querySelector('input[name="product-id"]');
const shop = document.getElementById("embdshop").value;
var productid = "null";
let data = {};
let stroke_color = document.getElementById("star-color");

async function displayRating() {
  if (productIdInput) {
    productid = productIdInput.value;
  }
  function generateStarElements(average) {
    const roundedAverage = Math.round(average);

    const starElements = Array.from(
      { length: 5 },
      (_, i) => `<li>
    <svg viewBox="0 0 23 22" class="review-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="${i < roundedAverage
          ? "M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z"
          : "M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z"
        }" fill="${i < roundedAverage ? `${stroke_color}` : "#D4D4D8"}" stroke="${i < roundedAverage ? `${stroke_color}` : "#71717A"
        }" stroke-width="0.79375"/>
    </svg>
  </li>`,
    );
    return starElements.join("");
  }
  let url =
    " https://grand-glen-reduces-seating.trycloudflare.com/main-rating-api";
  data = {
    productid,
    shop,
    apiType: "GET",
    sing: "mainstar",
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log("Failed to fetch:", response.statusText);
      return;
    }

    var responseData = await response.json();

    let review = "Review";
    if (responseData) {
      if (productIdInput) {
        if (responseData.body.maintotalCount > 0) {
          if (responseData.body.maintotalCount > 1) {
            review = "Reviews";
          }
          let mainprodrev = document.querySelectorAll(".main-prdouct-star")[0];

          const starForMainProduct = `<ul class="card_product_star" onclick="scrollToBottom(0)">${generateStarElements(responseData.body.mainProdRating)}</ul>
                              <span class="card_product_rating">${responseData.body.mainProdRating.toFixed(1)} (${responseData.body.maintotalCount} ${review})</span>
                            </div>
                          `;
          mainprodrev.innerHTML += starForMainProduct;
        } else {
          let mainprodrev = document.querySelectorAll(".main-prdouct-star")[0];
          const starForMainProduct = `<ul class="card_product_star" onclick="scrollToBottom(1)">${generateEmptyStarElements()}</ul>
                    <span class="card_product_rating"> 0 (${review})</span>
                  </div>
                `;
          mainprodrev.innerHTML += starForMainProduct;
        }
      }
    }
  } catch (error) {
    console.log("An error occurred", error);
  }
}
displayRating();

function generateEmptyStarElements() {
  const starElements = Array.from(
    { length: 5 },
    (_, i) => ` <li>
    <svg width="23" height="18" viewBox="0 0 23 22" class="review-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z" fill="#D4D4D8" stroke="#71717A" stroke-width="0.79375"></path>
    </svg>
  </li>`,
  );
  return starElements.join("");
}
function scrollToBottom(x) {
  var productid = productIdInput.value;
  const element = document.getElementById(`${productid}`);
  const element1 = document.querySelector(".review-empty");

  if (x == 0) {
    element.scrollIntoView({ behavior: "smooth" });
  } else if (x == 1) {
    element1.scrollIntoView({ behavior: "smooth" });
  }
}
