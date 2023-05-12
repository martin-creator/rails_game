// intialize context
// download game assests https://itch.io/
kaboom({
    scale: 3,
    width: 240,
    height: 160,
    background: [0, 0, 0],
    canvas: document.getElementById("screen"),
});

loadSprite("floor", "/sprites/floor.png", { sliceX: 8 });
loadSprite("wall_left", "/sprites/wall_left.png");
loadSprite("wall_mid", "/sprites/wall_mid.png");
loadSprite("wall_right", "/sprites/wall_right.png");
loadSprite("wall_fountain", "/sprites/wall_fountain.png", {
    sliceX: 3,
    anims: {
        idle: { from: 0, to: 2, speed: 5, loop: true },
    }
});

scene("play", ({level}) => {
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
            " ": () => [sprite("floor", { frame: ~~rand(0, 8) })],
        });

    // add walls
    const mapConfig = {
        width: 16,
        height: 16,
        l: () => [sprite("wall_left"), area(), solid(), "wall"],
        r: () => [sprite("wall_right"), area(), solid(), "wall"],
        w: () => [sprite("wall_mid"), area(), solid(), "wall"],
        f: () => [sprite("wall_fountain", { anim: "idle" }), area(), solid(), "wall"],
    }

    // List of maps
    const matrix = [
        [
            "lwwwffwwr",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "lwwwwwwwr",
        ],

        [
            "lfffffffr",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "l       r",
            "lwwwwwwwr",
        ]

    ]

    // map level
    map = addLevel(matrix[level], mapConfig);


});

go("play", { level: 0})