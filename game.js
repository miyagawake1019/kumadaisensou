document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const stageSelectScreen = document.getElementById('stage-select-screen');
    const gameScreen = document.getElementById('game-screen');

    // UI Elements
    const currentStageTitle = document.getElementById('current-stage-title');
    const moneyDisplay = document.getElementById('money-display');
    const playerBaseHpDisplay = document.getElementById('player-base-hp');
    const enemyBaseHpDisplay = document.getElementById('enemy-base-hp');
    const lane = document.getElementById('lane');
    const summonButtons = document.querySelectorAll('.summon-btn');
    const backToSelectBtn = document.getElementById('back-to-select-btn');

    // Game Constants
    const PLAYER_BASE_X = 50;
    const ENEMY_BASE_X = 700; // Based on 800px width
    const FPS = 30;
    const FRAME_TIME = 1000 / FPS;

    // Unit Definitions
    const UNIT_TYPES = {
        'little': { name: 'こぐま', cost: 100, hp: 50, attack: 10, speed: 2, cooldown: 1000, icon: '🧸' },
        'pillar': { name: '柱グマ', cost: 300, hp: 150, attack: 30, speed: 1.5, cooldown: 2000, icon: '🗿' },
        'big': { name: 'おオグマ', cost: 500, hp: 400, attack: 80, speed: 1, cooldown: 4000, icon: '🐻' },
        'max': { name: '最大おおぐま', cost: 1000, hp: 1000, attack: 200, speed: 0.5, cooldown: 8000, icon: '👹' }
    };

    // Game State
    let gameLoopId;
    let gameState = {
        money: 0,
        stage: 1,
        units: [], // { id, type, side (player/enemy), x, hp, maxHp, attack, speed, element }
        playerBaseHp: 1000,
        enemyBaseHp: 1000,
        lastMoneyUpdate: 0,
        gameOver: false,
        startTime: 0,
        enemySpawnTimer: 0
    };

    // --- Event Listeners ---

    document.querySelectorAll('.stage-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const stageId = parseInt(btn.getAttribute('data-stage'));
            const stageName = btn.textContent;
            startGame(stageId, stageName);
        });
    });

    backToSelectBtn.addEventListener('click', () => {
        stopGame();
        gameScreen.style.display = 'none';
        stageSelectScreen.style.display = 'flex';
    });

    summonButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const cost = parseInt(btn.getAttribute('data-cost'));
            if (gameState.money >= cost && !gameState.gameOver) {
                gameState.money -= cost;
                spawnUnit(type, 'player');
                updateMoneyUI();

                // Simple cooldown visual (disable button temporarily)
                btn.disabled = true;
                setTimeout(() => {
                    btn.disabled = false;
                }, UNIT_TYPES[type].cooldown); // Use defined cooldown
            }
        });
    });

    // --- Game Logic ---

    function startGame(stageId, stageName) {
        // Reset State
        gameState = {
            money: 0,
            stage: stageId,
            units: [],
            playerBaseHp: 1000,
            enemyBaseHp: 1000 * stageId, // Stronger base for later stages
            lastMoneyUpdate: Date.now(),
            gameOver: false,
            startTime: Date.now(),
            enemySpawnTimer: Date.now()
        };

        // Clear Lane
        lane.innerHTML = '';

        // Update UI
        stageSelectScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        backToSelectBtn.style.display = 'block'; // Show back button
        currentStageTitle.textContent = stageName;
        updateMoneyUI();
        updateBaseHpUI();

        // Enable buttons
        summonButtons.forEach(btn => btn.disabled = false);

        // Start Loop
        if (gameLoopId) clearInterval(gameLoopId);
        gameLoopId = setInterval(gameLoop, FRAME_TIME);
    }

    function stopGame() {
        clearInterval(gameLoopId);
        backToSelectBtn.style.display = 'none'; // Hide back button
    }

    function gameLoop() {
        if (gameState.gameOver) return;

        const now = Date.now();

        // 1. Money Accumulation (Passive income)
        if (now - gameState.lastMoneyUpdate > 50) { // Every 0.05 seconds (Extremely fast)
            gameState.money += 500 + (gameState.stage * 50); // Massive amount
            gameState.lastMoneyUpdate = now;
            updateMoneyUI();
        }

        // 2. Enemy Spawning Logic
        handleEnemySpawning(now);

        // 3. Move Units
        moveUnits();

        // 4. Combat
        resolveCombat();

        // 5. Clean up dead units
        cleanupUnits();

        // 6. Check Win/Loss
        checkGameEnd();

        // 7. Update Buttons State
        updateButtonsState();
    }

    function handleEnemySpawning(now) {
        // Simple difficulty ramp: spawn enemies based on time elapsed
        const timeElapsed = (now - gameState.startTime) / 1000; // seconds

        // Base spawn rate
        let spawnInterval = 5000 - (gameState.stage * 500); // Faster in later stages
        if (spawnInterval < 2000) spawnInterval = 2000;

        if (now - gameState.enemySpawnTimer > spawnInterval) {
            // Determine enemy type based on time/difficulty
            let enemyType = 'little';

            // Progressive difficulty
            if (timeElapsed > 60) enemyType = 'max';      // After 60s
            else if (timeElapsed > 30) enemyType = 'big'; // After 30s
            else if (timeElapsed > 15) enemyType = 'pillar'; // After 15s

            // Random chance to spawn weaker units even late game
            const roll = Math.random();
            if (enemyType === 'max' && roll < 0.7) enemyType = 'big';
            if (enemyType === 'big' && roll < 0.6) enemyType = 'pillar';

            spawnUnit(enemyType, 'enemy');
            gameState.enemySpawnTimer = now;
        }
    }

    function spawnUnit(type, side) {
        const stats = UNIT_TYPES[type];
        const unit = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            side: side,
            x: side === 'player' ? PLAYER_BASE_X : ENEMY_BASE_X,
            hp: stats.hp,
            maxHp: stats.hp,
            attack: stats.attack,
            speed: stats.speed,
            range: 30, // Attack range
            element: createUnitElement(type, side)
        };

        gameState.units.push(unit);
        lane.appendChild(unit.element);
        updateUnitPosition(unit);
    }

    function createUnitElement(type, side) {
        const el = document.createElement('div');
        el.classList.add('unit', side);
        el.setAttribute('data-type', type);
        el.textContent = UNIT_TYPES[type].icon;

        // Add HP bar? Maybe later.
        return el;
    }

    function moveUnits() {
        gameState.units.forEach(unit => {
            if (unit.isFighting) return; // Don't move if fighting

            if (unit.side === 'player') {
                unit.x += unit.speed;
                // Stop at enemy base
                if (unit.x >= ENEMY_BASE_X - 50) { // -50 for base width offset
                    unit.x = ENEMY_BASE_X - 50;
                }
            } else {
                unit.x -= unit.speed;
                // Stop at player base
                if (unit.x <= PLAYER_BASE_X + 50) {
                    unit.x = PLAYER_BASE_X + 50;
                }
            }
            updateUnitPosition(unit);
        });
    }

    function updateUnitPosition(unit) {
        unit.element.style.left = unit.x + 'px';
    }

    function resolveCombat() {
        // Reset fighting state
        gameState.units.forEach(u => u.isFighting = false);

        // Check Unit vs Unit
        for (let i = 0; i < gameState.units.length; i++) {
            const u1 = gameState.units[i];

            // Check collision with opposing units
            for (let j = 0; j < gameState.units.length; j++) {
                if (i === j) continue;
                const u2 = gameState.units[j];

                if (u1.side !== u2.side) {
                    // Check distance
                    const dist = Math.abs(u1.x - u2.x);
                    if (dist < 40) { // Collision threshold
                        u1.isFighting = true;
                        // Attack
                        if (!u1.lastAttack || Date.now() - u1.lastAttack > 1000) {
                            u2.hp -= u1.attack;
                            u1.lastAttack = Date.now();
                            visualizeDamage(u2);
                        }
                    }
                }
            }

            // Check Collision with Base
            if (u1.side === 'player') {
                if (u1.x >= ENEMY_BASE_X - 60) {
                    u1.isFighting = true;
                    if (!u1.lastAttack || Date.now() - u1.lastAttack > 1000) {
                        gameState.enemyBaseHp -= u1.attack;
                        u1.lastAttack = Date.now();
                        updateBaseHpUI();
                        visualizeBaseDamage('enemy');
                    }
                }
            } else { // Enemy
                if (u1.x <= PLAYER_BASE_X + 60) {
                    u1.isFighting = true;
                    if (!u1.lastAttack || Date.now() - u1.lastAttack > 1000) {
                        gameState.playerBaseHp -= u1.attack;
                        u1.lastAttack = Date.now();
                        updateBaseHpUI();
                        visualizeBaseDamage('player');
                    }
                }
            }
        }
    }

    function cleanupUnits() {
        gameState.units = gameState.units.filter(unit => {
            if (unit.hp <= 0) {
                unit.element.remove();
                return false;
            }
            return true;
        });
    }

    function checkGameEnd() {
        if (gameState.playerBaseHp <= 0) {
            endGame(false);
        } else if (gameState.enemyBaseHp <= 0) {
            endGame(true);
        }
    }

    function endGame(isWin) {
        gameState.gameOver = true;
        stopGame();
        alert(isWin ? "勝利！ (Victory!)" : "敗北... (Defeat...)");
        // Could show a result screen instead of alert
    }

    // --- UI Updates ---

    function updateMoneyUI() {
        moneyDisplay.textContent = gameState.money;
    }

    function updateBaseHpUI() {
        playerBaseHpDisplay.textContent = Math.max(0, gameState.playerBaseHp);
        enemyBaseHpDisplay.textContent = Math.max(0, gameState.enemyBaseHp);
    }

    function updateButtonsState() {
        summonButtons.forEach(btn => {
            const cost = parseInt(btn.getAttribute('data-cost'));
            if (gameState.money < cost && !btn.disabled) {
                btn.style.opacity = '0.5';
            } else if (gameState.money >= cost && !btn.disabled) {
                 btn.style.opacity = '1';
            }
        });
    }

    function visualizeDamage(unit) {
        // Flash red or create floating number
        unit.element.style.filter = 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)';
        setTimeout(() => {
            if (unit.element) unit.element.style.filter = 'none';
        }, 200);
    }

    function visualizeBaseDamage(side) {
        const base = document.getElementById(side + '-base');
        base.style.transform = side === 'enemy' ? 'scaleX(-1) scale(1.1)' : 'scale(1.1)';
        setTimeout(() => {
            base.style.transform = side === 'enemy' ? 'scaleX(-1)' : 'scale(1)';
        }, 100);
    }
});
