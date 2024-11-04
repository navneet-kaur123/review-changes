let timerId;

async function displayRating() {
    var elements = document.getElementsByClassName("card__heading h5");
    const shop = document.getElementById("embdshop").value;
    var ids = [];
    let data = {};

    if (elements) {
        for (let i = 0; i < elements.length; i++) {
            var id = elements[i].id;
            var lastDigits = id.substring(id.lastIndexOf('-') + 1);
            ids.push(lastDigits);
        }
    }
    function generateStarElements(average) {
        const roundedAverage = Math.round(average);
        const starElements = Array.from({ length: 5 }, (_, i) => ` <li>
        <svg width="23" height="18" viewBox="0 0 23 22" class="review-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${i < roundedAverage
                ? "M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z"
                : "M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z"
            }" fill="${i < roundedAverage ? "#FECE23" : "#D4D4D8"}" stroke="${i < roundedAverage ? "#D6AB15" : "#71717A"
            }" stroke-width="0.79375"/>
        </svg>
      </li>`);
        return starElements.join("");
    }
    clearInterval(timerId);
    let url = " https://grand-glen-reduces-seating.trycloudflare.com/ratingapi";   
    data = {
        ids,
        shop,
        apiType: "RATING",
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
        if (responseData) {
            if (elements) {

                for (let i = 0; i < elements.length; i++) {
                    const rt = elements[i].id.slice(-13);

                    for (let j = 0; j < responseData.body.length; j++) {

                        if (rt == responseData.body[j].productId) {
                            let reviewvalue = "Review";
                            if (responseData.body[j].totalCount > 1) {
                                reviewvalue = "Reviews";
                            }
                            const starListHtml = `
                            <div class="card_product_rating-box">
                              <ul class="card_product_star">${generateStarElements(responseData.body[j].rating)}</ul>
                              <span class="card_product-rating">${responseData.body[j].rating.toFixed(1)} (${responseData.body[j].totalCount} ${reviewvalue})</span>
                            </div>
                          `;

                            let s = document.getElementById(`${elements[i].id}`);
                            s.insertAdjacentHTML('afterend', starListHtml);


                        }
                    }
                }
            }
        }

    } catch (error) {
        console.log("An error occurred", error);
    }

}
timerId = setInterval(function () {
    var ulElement = document.querySelector("ul.grid.product-grid");

    if (ulElement != null) {
        displayRating();
        clearInterval(timerId);
    }
}, 1000);


