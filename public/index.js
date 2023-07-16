const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

const socket = io('http://localhost:3000');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loadingText = document.getElementById("loadingText");
const pickerNav = document.getElementById("pickerNav");
const gridLayout = true;

const dpi = window.devicePixelRatio;
const size = 100;
canvas.width = size * dpi;
canvas.height = size * dpi;
let isLoading = true;
ctx.scale(dpi, dpi);

canvas.addEventListener("click", clicked);

const colorSet = [
    { red: "FF0000" },
    { cyan: "32DBC6" },
    { cream: "FFFFFF" },
    { violet: "5639A6" },
    { sunShine: "FAF15D" },
    { green: "1A936F" }
];
let selectedColor = colorSet[0].red;

colorSet.forEach((color, i) => {
    const button = document.createElement("button");
    button.style.backgroundColor = "#" + Object.values(color)[0];
    button.addEventListener("click", (e) => {
        selectedColor = Object.values(colorSet[i])[0];
    });
    pickerNav.appendChild(button);
});

let pixels = [];

canvas.style.opacity = 0;
async function getData() {
    await fetch("http://localhost:3000/map")
        .then((res) => res.json())
        .then((data) => {
            pixels = data;
            drawAll();
            canvas.style.opacity = 1;
            loadingText.classList.add("hidden")
        });


}



function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    pixels.forEach((pixel) => {
        drawPixel(pixel.color, pixel.x, pixel.y);
    });
}

function drawPixel(color, positionX, positionY) {
    ctx.fillStyle = `#${color}`;
    ctx.fillRect(positionX, positionY, 1, 1);
    ctx.fill();
}




const activePixel = document.getElementById("activePixel");

socket.on("brush", (pixelData) => {
    console.log(pixelData);

    pixels.forEach((pixel) => {
        if (pixel.x === pixelData.x && pixel.y === pixelData.y) {
            pixel.color = pixelData.color[0];
            drawPixel(pixel.color, pixel.x, pixel.y);
        }
    });
});

function clicked(e) {
    const clickX = e.offsetX;
    const clickY = e.offsetY;
    console.log(clickX, clickY)

    pixels.forEach((pixel) => {
        if (pixel.x === clickX && pixel.y === clickY) {
            const pixelData = { "color": [selectedColor], "x": pixel.x, "y": pixel.y };
            socket.emit('brush', pixelData);

            pixel.color = selectedColor;
            drawPixel(pixel.color, pixel.x, pixel.y);
        }
    });
}



function animate() {
    drawAll();
}









if (isMobile.any()) {
    /* alert("Bu web sitesi mobil cihazlarda çalışmamaktadır :(") */
    document.body.innerHTML = `
    <h1 style="text-align:center">Kusura bakma uygulama mobilde çalışmıyor :((</h1>
    `
} else {
    getData();
    animate();
}