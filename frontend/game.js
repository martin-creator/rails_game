// intialize context
// download game assests https://itch.io/
kaboom({
    scale: 3,
    width: 240,
    height: 160,
    background: [0, 0, 0],
    canvas: document.getElementById("screen"),
});

const PLAYER_SPEED = 80;

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

loadSprite("knight", "/sprites/knight.png", {
    sliceX: 8,
    anims: {
        idle: { from: 0, to: 3, speed: 5, loop: true },
        run: { from: 4, to: 7, speed: 10, loop: true },
    }
});

loadSprite("ogre", "/sprites/ogre.png", {
    sliceX: 4,
    anims: {
        run: { from: 0, to: 3, speed: 5, loop: true },
    }
});

loadSprite("spikes", "/sprites/spikes.png", {
    sliceX: 4,
    anims: {
        idle: { from: 0, to: 3, speed: 7, loop: true },
    }
});

loadSprite("hole", "/sprites/hole.png", {
    sliceX: 4,
    anims: {
        open: { from: 0, to: 1, speed: 5, loop: false },
    }
});


scene("play", ({ level }) => {
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
        "&": () => [sprite("ogre", { anim: "run" }), area(), solid(), scale(0.75), origin("center"), "ogre", "danger"],
        "^": () => [sprite("spikes", { anim: "idle" }), area(), "spikes", "danger"],
        h: () => [sprite("hole"), area(),{opened: false}, "hole"],
    }

    // List of maps
    const matrix = [
        [
            "lwwwffwwr",
            "l       r",
            "l     & r",
            "l     ^ r",
            "l   & & r",
            "l ^     r",
            "l h   & r",
            "l      ^r",
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

    // add player
    const player = add([
        pos(map.getPos(2, 2)),
        sprite("knight", { anim: "idle" }),
        solid(), // making a player solid means it can't move through other solids
        //area(), // area() makes the player a rectangle
        origin("center"), // origin("center") makes the player rotate from the center
        area({ width: 16, height: 16, offset: vec2(0, 8) }), // area(width:16, height: 16) makes the player a rectangle
    ]);

    onKeyDown("left", () => {
        player.flipX(true);
        player.move(-PLAYER_SPEED, 0);
    });

    onKeyDown("right", () => {
        player.flipX(false);
        player.move(PLAYER_SPEED, 0);
    });

    onKeyDown("up", () => {
        player.move(0, -PLAYER_SPEED);
    });

    onKeyDown("down", () => {
        player.move(0, PLAYER_SPEED);
    });

    onKeyPress(["left", "right", "up", "down"], () => {
        player.play("run");
    });

    onKeyRelease(["left", "right", "up", "down"], () => {
        if (
            !keyIsDown("left") &&
            !keyIsDown("right") &&
            !keyIsDown("up") &&
            !keyIsDown("down")
        ) {
            player.play("idle");
        };
    })

});


go("play", { level: 0 });

//debug.inspect = true;

