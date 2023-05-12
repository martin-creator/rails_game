// intialize context
// download game assests https://itch.io/
kaboom({
    scale:3,
    width: 240,
    height: 160,
    background: [0, 0, 0],
    canvas: document.getElementById("screen"),
});

loadSprite("floor", "/sprites/floor.png", { sliceX:8});

scene("play", () => {
    // add background 10x10
    addLevel([
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
    ], 
    {
        width: 16,
        height: 16,
        " ":() => [sprite("floor",  { frame: ~~rand(0, 8) })],
    })

});

go("play")