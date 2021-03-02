const scriptURL =
  "https://script.google.com/macros/s/AKfycbysfjU3xrA5BpMImWSFPjn9eygcq1Vo_Wjia6ikYQxX_v1fMqxIkabK/exec";
const form = document.forms["submit-to-google-sheet"];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  loader();

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      successGreen();
    })
    .catch((error) => {
      failedRed();
    });
});

function successGreen() {
  document.getElementById("submit-button").style.backgroundColor = "green";

  document.getElementById("btn-icon").src = "images/tick.svg";
  document.getElementById("btn-icon").classList = "tick";
}

function failedRed() {
  document.getElementById("submit-button").style.backgroundColor = "red";
  document.getElementById("submit-button").innerHTML = "!";
}

function loader() {
  document.getElementById("btn-icon").src = "images/loader.svg";
  document.getElementById("btn-icon").classList = "tick loader";
}

// DOM selectors
const stars = document.getElementById("stars");
const starsCtx = stars.getContext("2d");
const slider = document.querySelector(".slider input");
const output = document.querySelector("#speed");

// global variables
let screen,
  starsElements,
  starsParams = { speed: 1, number: 300, extinction: 4 };

// run stars
setupStars();
updateStars();

// handle slider
output.innerHTML = slider.value;
slider.oninput = function () {
  output.innerHTML = this.value;
  starsParams.speed = this.value;
};

// update stars on resize to keep them centered
window.onresize = function () {
  setupStars();
};

// star constructor
function Star() {
  this.x = Math.random() * stars.width;
  this.y = Math.random() * stars.height;
  this.z = Math.random() * stars.width;

  this.move = function () {
    this.z -= starsParams.speed;
    if (this.z <= 0) {
      this.z = stars.width;
    }
  };

  this.show = function () {
    let x, y, rad, opacity;
    x = (this.x - screen.c[0]) * (stars.width / this.z);
    x = x + screen.c[0];
    y = (this.y - screen.c[1]) * (stars.width / this.z);
    y = y + screen.c[1];
    rad = stars.width / this.z;
    opacity =
      rad > starsParams.extinction
        ? 1.5 * (2 - rad / starsParams.extinction)
        : 1;

    starsCtx.beginPath();
    starsCtx.fillStyle = "rgba(130, 130, 130, " + opacity + ")";
    starsCtx.arc(x, y, rad, 0, Math.PI * 2);
    starsCtx.fill();
  };
}

// setup <canvas>, create all the starts
function setupStars() {
  screen = {
    w: window.innerWidth,
    h: window.innerHeight,
    c: [window.innerWidth * 0.5, window.innerHeight * 0.5],
  };
  window.cancelAnimationFrame(updateStars);
  stars.width = screen.w;
  stars.height = screen.h;
  starsElements = [];
  for (let i = 0; i < starsParams.number; i++) {
    starsElements[i] = new Star();
  }
}

// redraw the frame
function updateStars() {
  starsCtx.fillStyle = "#000";
  starsCtx.fillRect(0, 0, stars.width, stars.height);
  starsElements.forEach(function (s) {
    s.show();
    s.move();
  });
  window.requestAnimationFrame(updateStars);
}
