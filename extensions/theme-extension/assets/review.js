let ratingValue = 0;
let isRatingExists = 0;
function loadRating() {
  //create svg element
  const svgElement = `<li><svg viewBox="0 0 30 29" fill="none"><path d="M13.5739 2.00861C14.0229 0.626645 15.978 0.626647 16.427 2.00861L18.5662 8.59221C18.9009 9.62226 19.8608 10.3197 20.9438 10.3197H27.8662C29.3193 10.3197 29.9235 12.1791 28.7479 13.0332L23.1476 17.1021C22.2713 17.7387 21.9047 18.8671 22.2394 19.8972L24.3785 26.4808C24.8276 27.8627 23.2458 29.0119 22.0703 28.1578L16.4699 24.0889C15.5937 23.4523 14.4072 23.4523 13.531 24.0889L7.93066 28.1578C6.75508 29.0119 5.17336 27.8627 5.62239 26.4808L7.76153 19.8972C8.09622 18.8671 7.72957 17.7387 6.85335 17.1021L1.25302 13.0332C0.0774449 12.1791 0.681608 10.3197 2.13469 10.3197H9.05709C10.1402 10.3197 11.1 9.62226 11.4347 8.59221L13.5739 2.00861Z" stroke="#D4D4D8"></path></svg></li>`;
  //select the ul with class "star-rating"
  const starRatingUrl = document.querySelectorAll("ul.star-rating")[0];
  //creating 5 stars
  for (let i = 0; i < 5; i++) {
    starRatingUrl.innerHTML += svgElement;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  loadRating();

  const ratingDivWrapElements =
    document.getElementsByClassName("rating-review-wrap");
  if (ratingDivWrapElements.length > 0) {
    ratingDivWrapElements[0].style.display = "none";
  }
  const ratingDivEmptyWrapElements =
    document.getElementsByClassName("review-empty");
  if (ratingDivEmptyWrapElements.length > 0) {
    ratingDivEmptyWrapElements[0].style.display = "none";
  }
  const sectionid = document.getElementById("sectionid")?.value;
  const mainsection = document.querySelectorAll(
    "#shopify-section-" + sectionid,
  );

  mainsection[0]?.classList?.add("rating-main-section");

  const nextDiv = mainsection[0]?.querySelector("div.scroll-trigger");
  if (nextDiv) {
    nextDiv.classList.remove("scroll-trigger");
  }
  postReview(0);

  const closeButtons = document.querySelectorAll(".modal__close");
  const loginFirst = document.querySelector("#review-login-first");
  const modals = document.querySelectorAll(".modal");
  const writeReviews = document.querySelectorAll(".write-review");
  const addReview = document.querySelector("#add-review");
  const writePrompt = document.querySelector("#review-already-added");
  var sortButton = document.querySelector(".sortbtn");
  var sortButton1 = document.querySelector(".open-close-svg");
  var openSort = document.getElementsByClassName("sort-options")[0];
  sortButton.addEventListener("click", function () {
    openSort.classList.toggle("display-sort");
    document.getElementById("svg1").classList.toggle("close-svg");
  });

  sortButton1.addEventListener("click", function () {
    openSort.classList.toggle("display-sort");
  });

  var sortOptions = document.getElementById("Sortby");
  sortOptions.addEventListener("click", function (event) {
    if (event.target && event.target.nodeName === "LI") {
      var selectedId = event.target.id;
      var selectedValue = event.target.textContent;
      var textNode = sortButton.firstChild;
      textNode.textContent = selectedValue;
      postReview(0, selectedId);
    }
  });
  window.onclick = function (e) {
    if (!e.target.matches(".sortbtn")) {
      var myDropdown = document.getElementById("Sortby");
      if (myDropdown.classList.contains("display-sort")) {
        myDropdown.classList.remove("display-sort");
        document.getElementById("svg1").classList.toggle("close-svg");
      }
    }
  };

  writeReviews.forEach((openBtn) => {
    openBtn.addEventListener("click", () => {
      const customerId = document.getElementById("customerId").value
        ? document.getElementById("customerId").value
        : "";
      if (customerId == "") {
        loginFirst.classList.add("show");
        return false;
      }

      document.body.style.overflow = "hidden";

      document.getElementById("title").value = "";
      document.getElementById("comment").value = "";
      ratingValue = 0;
      stars.forEach((star) => {
        star.classList.remove("selected");
        star.style.color = "black";
      });

      addReview.classList.add("show");
    });
  });
  closeButtons.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      modals.forEach((modal) => {
        modal.classList.remove("show");
        document.body.style.overflow = "";
      });
    });
  });

  const starRating = document.querySelector(".star-rating");
  const stars = starRating.querySelectorAll("li");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      if (index === ratingValue - 1) {
        ratingValue = 0;
      } else {
        ratingValue = index + 1;
      }

      stars.forEach((s, i) => {
        s.classList.toggle("selected", i < ratingValue);
      });
    });
  });
});

async function postReview(type, sort = 1, loadmore = 1) {
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
  const url =
    "https://grand-glen-reduces-seating.trycloudflare.com/product-review-ajax";

  let limit = 5;
  let page = loadmore;
  let data = {};

  if (type === 1) {
    var isError = 0;
    const titleElement = document.getElementById("title").value;
    const commentElement = document.getElementById("comment").value;
    const selectedRating = ratingValue ? ratingValue : 0;
    const title = titleElement.trim();
    const comment = commentElement.trim();

    if (title === "") {
      document.getElementById("title-error").innerText = "Title is required.";
      isError = isError + 1;
    } else if (title.length < 10 || title.length > 100) {
      document.getElementById("title-error").innerText =
        "Title must be between 10 and 100 characters.";
      isError = isError + 1;
    } else {
      document.getElementById("title-error").innerText = "";
    }

    if (comment === "") {
      document.getElementById("comment-error").innerText =
        "Comment is required.";
      isError = isError + 1;
    } else if (comment.length < 50 || comment.length > 500) {
      document.getElementById("comment-error").innerText =
        "Comment must be between 50 and 500 characters.";
      isError = isError + 1;
    } else {
      document.getElementById("comment-error").innerText = "";
    }

    if (selectedRating === 0) {
      document.getElementById("rating-select-error").innerText =
        "Rating is required.";
      isError = isError + 1;
    } else {
      document.getElementById("rating-select-error").innerText = "";
    }

    if (isError > 0) {
      return false;
    }
    const customerId = document.getElementById("customerId").value
      ? document.getElementById("customerId").value
      : "";
    const productId = document.getElementById("productId").value;
    const shopId = window.shopDomain;

    const customerName = document.getElementById("customerName").value;
    const productTitle = document.getElementById("productTitle").value;

    if (customerId === "") {
      alert("Please login to write a review.");
      return false;
    }

    data = {
      title,
      comment,
      rating: selectedRating,
      customerId,
      productId,
      shop: shopId,
      customerName,
      productTitle,
      jwtaccessToken,
      jwtRefreshToken,
      apiType: "CREATE",
    };
  } else if (type == 0) {
    const productId = document.getElementById("productId").value;
    const shopId = window.shopDomain;
    data = {
      productId: productId,
      shop: shopId,
      apiType: "GET",
      limit,
      page,
      sort,
    };
  } else {
    const productId = document.getElementById("productId").value;
    const shopId = window.shopDomain;
    data = {
      productId: productId,
      shop: shopId,
      apiType: "SORT",
      limit,
      page,
      type,
    };
  }
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
      console.log(responseData, "responsedata");
      if (type === 1) {
        const reviewAdded = document.querySelector("#review-added");
        const addReview = document.querySelector("#add-review");
        addReview.classList.remove("show");

        if (responseData.token) {
          if (responseData.token.accessToken) {
            const maxAge = 24 * 60 * 60;
            document.cookie = `jwtaccessToken=${responseData.token.accessToken};Max-Age=${maxAge};path=/;SameSite=Lax;Secure`;
            document.cookie = `jwtrefreshToken=${responseData.token.refreshToken};path=/;Max-Age=${maxAge};SameSite=Lax;Secure`;
          } else if (responseData.token == "refresh the page") {
            const access = "jwtaccessToken";
            const refresh = "jwtrefreshToken";
            document.cookie = `${access}=; Max-Age=-99999999; path=/; SameSite=Lax; Secure;`;
            document.cookie = `${refresh}=; Max-Age=-99999999; path=/; SameSite=Lax; Secure;`;
            const writePrompt = document.querySelector("#refresh-the-page");
            writePrompt.classList.add("show");
          } else if (responseData.token.newAccessToken) {
            const newaccessToken = responseData.token.newAccessToken;
            document.cookie = `jwtaccessToken=${newaccessToken};path=/;SameSite=Lax;Secure`;
          }
        }

        if (responseData.alreadyReviewed) {
          const writePrompt = document.querySelector("#review-already-added");
          document.querySelector(".reviewPrompt").innerHTML =
            responseData.alreadyReviewed;
          writePrompt.classList.add("show");
        } else if (responseData.newProductCreated == "true") {
          reviewAdded.classList.add("show");
        }
      } else if (type === 0) {
        if (responseData.dataArr.productReviews.length > 0) {
          const ratingDivWrapElements =
            document.getElementsByClassName("rating-review-wrap");
          if (ratingDivWrapElements.length > 0) {
            ratingDivWrapElements[0].style.display = "block";
          }
          loadHtml(responseData.dataArr);
        } else {
          const ratingDivEmptyWrapElements =
            document.getElementsByClassName("review-empty");
          if (ratingDivEmptyWrapElements.length > 0) {
            ratingDivEmptyWrapElements[0].style.display = "block";
          }
        }
        const loaderWrapElements =
          document.getElementsByClassName("loader-wrap");
        if (loaderWrapElements.length > 0) {
          loaderWrapElements[0].style.display = "none";
        }
      } else {
        loadHtml(responseData.dataArr);
      }
    } else {
      console.error("Some error occurred:", response);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

function loadmoreData(page, x = 0) {
  page != null ? postReview(0, x, page) : "";
}

function generateStarElements(average) {
  const roundedAverage = Math.round(average);
  const starElements = Array.from(
    { length: 5 },
    (_, i) => `
    <li>
      <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="${
          i < roundedAverage
            ? "M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z"
            : "M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z"
        }" fill="${i < roundedAverage ? "#FECE23" : "#D4D4D8"}" stroke="${
          i < roundedAverage ? "#D6AB15" : "#71717A"
        }" stroke-width="0.79375"/>
      </svg>
    </li>
  `,
  );
  return starElements.join("");
}

function generateRatingPercentageElements(progressbar, totalRating) {
  return Array.from({ length: 5 }, (_, index) => {
    const ratingData = progressbar.groupData.find(
      (item) => item.rating === 5 - index,
    );

    const percentage = ratingData ? ratingData._count.id : 0;
    const precentagebar = parseInt((percentage / totalRating) * 100);

    const fillColor = ratingData ? "#FECE23" : "#D4D4D8";
    const strokeColor = ratingData ? "#D6AB15" : "#71717A";

    return `
      <div class="rating-percentage">
        <div class="star-number">
          <span class="number">${5 - index}</span> 
          <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.79375"/>
          </svg>
        </div>
        <div class="progress">
          <div class="progress-done" data-done="${precentagebar}"></div>
        </div>
        <div class="progress-result">${
          ratingData ? ratingData._count.id : 0
        }</div>
      </div>
    `;
  }).join("");
}

function generateAllReviewsHtml(productReviews) {
  return productReviews.map(generateReviewHtml).join("");
}
function generateReviewHtml(review) {
  const reviewDate = new Date(review.createdAt);
  if (review.userId) {
    isRatingExists = 1;
  }
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    reviewDate,
  );

  var x = `<h3>${review.customerName}</h3>`;
  if (review.isVerified == "YES") {
    x = `<div class="verifed"><h3>${review.customerName}</h3><h4>(Verified Purchase)</h4></div>`;
  }

  review.rating = review.rating.toFixed(1);
  return `
    <div class="client-review-box">
      <div class="review-title">
        <div class="review-box-rating">
          <span class="number">${review.rating}</span>
          <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4897 0.813761C11.559 0.614375 11.841 0.614376 11.9103 0.81376L12.2852 0.683455L11.9103 0.813761L14.1695 7.3133C14.3091 7.71485 14.6838 7.98711 15.1089 7.99577L21.9884 8.13596C22.1995 8.14027 22.2866 8.40844 22.1184 8.53597L16.6351 12.6931C16.2964 12.9499 16.1532 13.3905 16.2763 13.7974L18.2689 20.3835C18.33 20.5856 18.1019 20.7513 17.9286 20.6308L12.2805 16.7005C11.9316 16.4577 11.4684 16.4577 11.1195 16.7005L5.47136 20.6308C5.2981 20.7513 5.06997 20.5856 5.1311 20.3835L7.12367 13.7974C7.24677 13.3905 7.10364 12.9499 6.76488 12.6931L1.28159 8.53597C1.11338 8.40844 1.20051 8.14027 1.41156 8.13596L8.29113 7.99577C8.71616 7.98711 9.09089 7.71485 9.23047 7.3133L11.4897 0.813761Z" fill="#FECE23" stroke="#D6AB15" stroke-width="0.79375"/>
          </svg>
        </div>
        <h3>${review.title}</h3>
      </div>
      <p>${review.comment}</p>
      <div class="product-review-details">
        <div class="client-name-box">
          <span class="image-client">
            <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21.5" cy="21.5" r="21.5" fill="#E8E8E8"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1333 10C20.4439 10 19.7612 10.1358 19.1242 10.3996C18.4873 10.6635 17.9085 11.0502 17.421 11.5377C16.9335 12.0252 16.5468 12.604 16.2829 13.2409C16.0191 13.8779 15.8833 14.5606 15.8833 15.25C15.8833 15.9394 16.0191 16.6221 16.2829 17.2591C16.5468 17.896 16.9335 18.4748 17.421 18.9623C17.9085 19.4498 18.4873 19.8365 19.1242 20.1004C19.7612 20.3642 20.4439 20.5 21.1333 20.5C22.5257 20.5 23.861 19.9469 24.8456 18.9623C25.8302 17.9777 26.3833 16.6424 26.3833 15.25C26.3833 13.8576 25.8302 12.5223 24.8456 11.5377C23.861 10.5531 22.5257 10 21.1333 10ZM18.1333 15.25C18.1333 14.4544 18.4494 13.6913 19.012 13.1287C19.5746 12.5661 20.3377 12.25 21.1333 12.25C21.929 12.25 22.692 12.5661 23.2546 13.1287C23.8172 13.6913 24.1333 14.4544 24.1333 15.25C24.1333 16.0456 23.8172 16.8087 23.2546 17.3713C22.692 17.9339 21.929 18.25 21.1333 18.25C20.3377 18.25 19.5746 17.9339 19.012 17.3713C18.4494 16.8087 18.1333 16.0456 18.1333 15.25Z" fill="black"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M29.3594 26.8405C28.5446 25.3734 27.3522 24.1508 25.9058 23.2996C24.4594 22.4484 22.8117 21.9996 21.1334 21.9996C19.4551 21.9996 17.8074 22.4484 16.361 23.2996C14.9147 24.1508 13.7222 25.3734 12.9074 26.8405L12.2519 28.0195C12.0824 28.325 11.9957 28.6695 12.0002 29.0189C12.0047 29.3682 12.1003 29.7103 12.2775 30.0114C12.4548 30.3124 12.7076 30.562 13.0109 30.7354C13.3142 30.9088 13.6575 31 14.0069 31H28.2599C28.6093 31 28.9526 30.9088 29.2559 30.7354C29.5592 30.562 29.812 30.3124 29.9893 30.0114C30.1665 29.7103 30.2622 29.3682 30.2666 29.0189C30.2711 28.6695 30.1844 28.325 30.0149 28.0195L29.3594 26.8405ZM14.8739 27.9325C15.4938 26.8159 16.4011 25.8855 17.5018 25.2377C18.6024 24.5899 19.8563 24.2482 21.1334 24.2482C22.4105 24.2482 23.6644 24.5899 24.7651 25.2377C25.8657 25.8855 26.773 26.8159 27.3929 27.9325L27.8459 28.75H14.4209L14.8739 27.9325Z" fill="black"/>
            </svg>
          </span>
          <div class="name">
          ${x}    
            <p>${formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateProgressBarWidths() {
  const progresses = document.querySelectorAll(".progress-done");
  progresses.forEach((progress) => {
    const progressValue = progress.getAttribute("data-done");
    progress.style.width = `${progressValue}%`;
    progress.style.opacity = 1;
  });
}

function loadHtml(data) {
  const { productAverage, productReviews, totalRating } = data;
  productAverage.average = productAverage.average.toFixed(1);
  const starListHtml = `
    <div class="rating-box">
      <h2 class="rating">${productAverage.average}</h2>
      <ul class="star">${generateStarElements(productAverage.average)}</ul>
      <p>${productAverage.totalCount} Ratings & Reviews.</p>
    </div>
  `;
  let x = productAverage.sort;
  const ratingPercentageWrapHtml = `
    <div class="rating-percentage-wrap">
      ${generateRatingPercentageElements(productAverage, totalRating)}
    </div>
  `;

  document.querySelector(".rating-review").innerHTML =
    starListHtml + ratingPercentageWrapHtml;
  const allReviewsHtml = generateAllReviewsHtml(productReviews);

  const viewMore =
    productAverage.nextPage == null
      ? ""
      : ` 
    <div class="view-all-wrap">
      <button class="view-all common-btn" type="button" onclick="loadmoreData(${productAverage.nextPage},'${x}')">Load more.</button>
    </div>
  `;

  document.querySelector(".client-review-box-main").innerHTML =
    allReviewsHtml + viewMore;
  document.querySelector(".view-all-wrap").innerHTML = viewMore;

  updateProgressBarWidths();
}
function updateCharacterCount(inputId, counterId, minLength, maxLength) {
  const inputElement = document.getElementById(inputId);
  const counterElement = document.getElementById(counterId);
  const errorElement = document.getElementById(`${inputId}-error`);

  let currentLength = inputElement.value.length;

  if (currentLength > maxLength) {
    inputElement.value = inputElement.value.slice(0, maxLength);
    currentLength = maxLength;
  }

  counterElement.innerText = `Character limit: ${currentLength} / ${maxLength}`;

  if (currentLength == maxLength) {
    counterElement.classList.add("error");
    counterElement.innerText = `Maximum limit exceed.`;
  } else {
    counterElement.classList.remove("error");
    errorElement.innerText = "";
  }
}
