console.clear();

const slider = document.querySelector("#slider"),
      sliderLength = document.querySelector(".slider__length"),
      btnGenerator =document.getElementById("btn__generator"),
      numberCheck = document.getElementById("number"),
      symbolCheck = document.getElementById("symbol"),
      lowercaseCheck = document.getElementById("lowercase"),
      uppercaseCheck = document.getElementById("uppercase"),
      settingBox = document.querySelector(".setting__box"),
      root = getComputedStyle(document.querySelector(":root")),
      result = document.querySelector(".complite"),
      copyBtn = document.querySelector(".stick__copy"),
      display = document.querySelector(".complite__field");

// slider propertys
const fillSlider = {
    fill: root.getPropertyValue("--lime-dark-color"),
    background: root.getPropertyValue("--lime-color")
}

fillApply(slider);

// when the thumb changes
slider.addEventListener("input", function(event) {
    sliderLength.dataset.length = slider.value;
    fillApply(event.target);
});

// a function that paints the slider line
function fillApply(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${fillSlider.fill} ${percentage}%,
         ${fillSlider.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderLength.dataset.length = slider.value;
}

function getRandomNumber() {
    return String.fromCodePoint(Math.floor(Math.random() * (57 - 48 + 1) + 48));
}

function getRandomSymbol() {
    const symbol = "!@#$%&?*-_:";
    return symbol[Math.floor(Math.random() * symbol.length)];
}

function getRandomUppercase() {
    return String.fromCodePoint(Math.floor(Math.random() * (90 - 65 + 1) + 65));
}

function getRandomLowercase() {
    return getRandomUppercase().toLowerCase();
}

const randomFunc = {
    number: getRandomNumber,
    symbol: getRandomSymbol,
    upper: getRandomUppercase,
    lower: getRandomLowercase
};

let isGeneratePassword = false;
btnGenerator.addEventListener("click", event => {
    const length = slider.value,
          hasNumber = numberCheck.checked,
          hasSymbol = symbolCheck.checked,
          hasUpper = uppercaseCheck.checked,
          hasLower = lowercaseCheck.checked;

    const valuesGenerate = [length, hasNumber, hasSymbol, hasLower, hasUpper];
    display.innerHTML = generatePassword(...valuesGenerate) || "SELECT VALUES";
    isGeneratePassword = true;
});

// function which generate password
// if at least one checkbox true
function generatePassword(length, number, symbol, lower, upper) {
    const cond = number + symbol + lower + upper,
          typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    let password = "";
    
    if (!cond) return;
    
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const typeFunc = Object.keys(type)[0];
            password += randomFunc[typeFunc]();
        });
    }

    return password.slice(0, length)
                   .split("")
                   .sort(() => Math.random() - 0.5)
                   .join("");
}

// check checkbox true
settingBox.addEventListener("click", event => {
    const current = event.target.closest("[type='checkbox']");
    if (!current) return;
    disableCheckbox();
});

// at least one checkbox true?
function disableCheckbox() {
    const totalChecked = [lowercaseCheck, uppercaseCheck, symbolCheck, numberCheck]
        .filter(item => item.checked);
    totalChecked.forEach(el => {
        el.disabled = totalChecked.length === 1;
    })
}

let coordsResult = {
    top: result.getBoundingClientRect().top,
    left: result.getBoundingClientRect().left
};

result.addEventListener("mousemove", function(event) {
    coordsResult = {
        top: result.getBoundingClientRect().top,
        left: result.getBoundingClientRect().left
    };

    if (isGeneratePassword) {
        copyBtn.style.display = "block";
        copyBtn.style.pointerEvents = "all";
        copyBtn.style.top = event.clientY - coordsResult.top - copyBtn.offsetHeight / 2 + "px";
        copyBtn.style.left = event.clientX - coordsResult.left - copyBtn.offsetWidth / 2 + "px";
    }
    document.onmouseout = onMouseOut;

    function onMouseOut(event) {
        let current = event.target;
        if (current.closest(".complite")) return;
        
        copyBtn.style.display = "";
		copyBtn.style.pointerEvents = 'none';
        result.onmouseout = null;
    }
});

display.onmousedown = () => false;

// copy password to clipbort
copyBtn.addEventListener("click", function(event) {
    navigator.clipboard.writeText(display.textContent)
        .then(() => {})
        .catch(err => {
            console.log(err);
        });
});