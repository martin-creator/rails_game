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
const OGRE_SPEED = 30;

const WIZARD_SPEED = 20;
const FIRE_SPEED = 100;

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

loadSprite("chest", "/sprites/chest.png", {
    sliceX: 3,
    anims: {
        open: { from: 0, to: 2, speed: 20, loop: false },
        close: { from: 2, to: 0, speed: 20, loop: false },
    }
});


loadSprite("wizard", "/sprites/wizard.png", {
    sliceX: 8,
    anims: {
        idle: { from: 0, to: 3, speed: 5, loop: true },
        run: { from: 4, to: 7, speed: 10, loop: true },
    }
});

/**
 * ---------------
 * SCENCE - PLAY
 * ---------------
 */


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
        "&": () => [sprite("ogre", { anim: "run" }), area(), solid(), scale(0.75), origin("center"), { dir: choose([-1, 1]), timer: 0 }, "ogre", "danger"],
        "^": () => [sprite("spikes", { anim: "idle" }), area(), "spikes", "danger"],
        h: () => [sprite("hole"), area(), { opened: false }, "hole"],
    }

    // List of maps
    const matrix = [
        [
            "lwwwffwwr",
            "l       r",
            "l     & r",
            "l     ^ r",
            "l    & r",
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

    // -- SCORE LABEL --

    add([pos(200, 20), sprite("chest", { frame: 2 }), origin("center")])
    const scoreLabel = add([
        text("0"),
        pos(200, 45),
        { value: 0 },
        scale(0.3),
        origin("center"),
    ]);

    add([text("Martin"), pos(200, 70), scale(0.15), origin("center")])


    // -- PLAYER --

    // add player
    const player = add([
        pos(map.getPos(2, 2)),
        sprite("knight", { anim: "idle" }),
        solid(), // making a player solid means it can't move through other solids
        //area(), // area() makes the player a rectangle
        origin("center"), // origin("center") makes the player rotate from the center
        area({ width: 16, height: 16, offset: vec2(0, 8) }), // area(width:16, height: 16) makes the player a rectangle
    ]);

    player.onCollide("danger", async (d) => {
        shake(10);
        burp();
        addKaboom(player.pos);
        destroy(player);
        destroy(d);

        await wait(2);
        go("over", { score: scoreLabel.value });

    });

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


    onKeyPress("space", () => {
        every("hole", async (h) => {
            if (player.isTouching(h)) {
                if (!h.opened) {
                    h.opened = true;
                    h.play("open");

                    await wait(1);
                    go("play", { level: 1 });
                }
            }
        });

        every("chest", async (c) => {
            if (player.isTouching(c)) {
                if (!c.opened) {
                    c.play("open");
                    c.opened = true;

                    scoreLabel.value++;
                    scoreLabel.text = scoreLabel.value;
                }
            }
        })
    });

    // -- OGRES --

    // Event that runs every frame(60fps)

    onUpdate("ogre", (o) => {
        o.move(o.dir * OGRE_SPEED, 0);
        o.timer -= dt(); // dt() is the time since the last frame

        if (o.timer <= 0) {
            o.dir = -o.dir;
            o.timer = rand(5)
        }
    });

    // ------- Code for Map 2 -------

    if (level == 0) return;

    // -- CHEST --
    // Add a new chest in a random position every 2 seconds
    // And then remove it after 4 seconds

    loop(2, () => {
        const x = rand(1, 8)
        const y = rand(1, 8)

        add([
            sprite("chest"),
            pos(map.getPos(x, y)),
            area(),
            solid(),
            { opened: false },
            lifespan(4, { fade: 0.5 }),
            "chest",
        ])


    });

    // -- WIZARD --
    const wizard = add([
        sprite("wizard"),
        pos(map.getPos(8, 7)),
        origin("center"),
        area(),
        "danger",
        state("move", ["idle", "attack", "move"]),
    ]);


    wizard.onStateEnter("idle", async () => {
        wizard.play("idle");
        await wait(0.5);
        wizard.enterState("attack");
    });

    wizard.onStateEnter("attack", async () => {
        if (!player.exists()) {
            const dir = player.pos.sub(wizard.pos).unit();

            // Generate a fireball
            add([
                pos(wizard.pos),
                move(dir, FIRE_SPEED),
                rect(2, 2),
                area(),
                origin("center"),
                color(RED),
                cleanup(), // cleanup() destroys the fireball when it leaves the screen
                "fire",
                "danger",
            ]);
        }



        await wait(1);
        wizard.enterState("move");
    });

    wizard.onStateEnter("move", async () => {
        wizard.play("run");
        await wait(2);
        wizard.enterState("idle");
    });

    wizard.onStateUpdate("move", () => {
        if (!player.exists()) return;

        const dir = player.pos.sub(wizard.pos).unit();
        wizard.flipX(dir.x < 0);
        wizard.move(dir.scale(WIZARD_SPEED));
    });

    wizard.enterState("move");


});

/**
 * ---------------
 * SCENCE - OVER
 * ---------------
 */

scene("over", ({ score }) => {
    add([text(score, 26), origin("center"), pos(width() / 2, height() / 2)]);

    onMousePress(() => {
        go("play", { level: 0 });
    });
});


go("play", { level: 1 });

//debug.inspect = true;

