console.clear();

const slider = document.querySelector("#slider"),
      sliderLength = document.querySelector(".slider__length");

slider.addEventListener("input", function(event) {
    sliderLength.dataset.length = slider.value;
});