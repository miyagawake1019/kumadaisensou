const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const TRACK_COLOR = "#555";
const GRASS_COLOR = "#558B2F";
const BORDER_COLOR = "#FFF";

// Kart object
const kart = {
    x: 400,
    y: 500,
    width: 20, // width of the body
    height: 34, // length of the body
    angle: -Math.PI / 2, // Facing up (-90 degrees)
    speed: 0,
    maxSpeed: 7,
    acceleration: 0.15,
    friction: 0.96,
    turnSpeed: 0.07,
    color: 'red'
};

// Input handling
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
        // Prevent default scrolling for arrow keys
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

function drawTrack() {
    // Fill background (grass)
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple oval track
    ctx.beginPath();
    ctx.ellipse(400, 300, 350, 250, 0, 0, 2 * Math.PI);
    ctx.lineWidth = 120;
    ctx.strokeStyle = TRACK_COLOR;
    ctx.stroke();

    // Track borders
    ctx.lineWidth = 5;
    ctx.strokeStyle = BORDER_COLOR;

    // Outer border
    ctx.beginPath();
    ctx.ellipse(400, 300, 410, 310, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner border
    ctx.beginPath();
    ctx.ellipse(400, 300, 290, 190, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Start/Finish line
    ctx.save();
    ctx.translate(400, 550); // Bottom of the oval
    ctx.fillStyle = "#FFF";
    ctx.fillRect(-10, -60, 20, 120); // Checkered pattern base
    // Simple checkerboard effect
    ctx.fillStyle = "#000";
    for(let i=0; i<4; i++) {
        for(let j=0; j<12; j++) {
            if ((i+j)%2 === 0) ctx.fillRect(-10 + i*5, -60 + j*10, 5, 10);
        }
    }
    ctx.restore();
}

function drawKart() {
    ctx.save();
    ctx.translate(kart.x, kart.y);
    ctx.rotate(kart.angle + Math.PI / 2); // Adjust because we draw the kart pointing up (which is -PI/2 in logic)

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(-12, -15, 24, 34);

    // Wheels
    ctx.fillStyle = "black";
    ctx.fillRect(-14, -12, 6, 10); // Front Left
    ctx.fillRect(8, -12, 6, 10);  // Front Right
    ctx.fillRect(-14, 8, 6, 10);  // Rear Left
    ctx.fillRect(8, 8, 6, 10);   // Rear Right

    // Body
    ctx.fillStyle = kart.color;
    ctx.beginPath();
    ctx.roundRect(-10, -16, 20, 32, 5);
    ctx.fill();

    // Driver (head)
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Spoiler
    ctx.fillStyle = "#800";
    ctx.fillRect(-12, 14, 24, 4);

    ctx.restore();
}

function update() {
    // 1. Handle Acceleration / Speed
    if (keys.ArrowUp) {
        kart.speed += kart.acceleration;
    }
    if (keys.ArrowDown) {
        kart.speed -= kart.acceleration;
    }

    // 2. Handle Turning
    // Only turn if moving (simple physics) - or allow pivot for arcade feel.
    // Let's require a tiny bit of speed to turn efficiently, or just allow it.
    // Standard Mario Kart allows turning even at 0 speed (though it doesn't do much until you move).
    // Let's make it so you can always turn, but it feels better moving.
    if (Math.abs(kart.speed) > 0.1) {
        // Reverse steering if going backward? Real cars do this. Mario kart usually doesn't flip controls.
        // We'll keep it standard: Left is always Left relative to the kart.
        const direction = kart.speed > 0 ? 1 : -1; // If reversing, steering is inverted visually if we don't account for it, but actually in games, Right -> Turn Right always.

        if (keys.ArrowLeft) {
            kart.angle -= kart.turnSpeed; // * direction; // Uncomment * direction for realistic reverse steering
        }
        if (keys.ArrowRight) {
            kart.angle += kart.turnSpeed; // * direction;
        }
    }

    // 3. Apply Friction / Drag
    kart.speed *= kart.friction;

    // Cap speed
    if (kart.speed > kart.maxSpeed) kart.speed = kart.maxSpeed;
    if (kart.speed < -kart.maxSpeed / 2) kart.speed = -kart.maxSpeed / 2; // Reverse is slower

    // 4. Update Position
    kart.x += Math.cos(kart.angle) * kart.speed;
    kart.y += Math.sin(kart.angle) * kart.speed;

    // 5. Screen wrapping (optional, or collision)
    // For now, let's just let them drive off-road.
    // Simple bounds checking to keep in canvas (optional)
    if (kart.x < 0) kart.x = canvas.width;
    if (kart.x > canvas.width) kart.x = 0;
    if (kart.y < 0) kart.y = canvas.height;
    if (kart.y > canvas.height) kart.y = 0;
}

function loop() {
    update();
    drawTrack();
    drawKart();
    requestAnimationFrame(loop);
}

// Start the game
loop();
