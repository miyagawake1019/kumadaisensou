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
    const summonButtons = document.querySelectorAll('.summon-btn'); // Note: This might be empty initially
    const backToSelectBtn = document.getElementById('back-to-select-btn');

    // Game Constants
    const PLAYER_BASE_X = 50;
    const ENEMY_BASE_X = 700; // Based on 800px width
    const FPS = 30;
    const FRAME_TIME = 1000 / FPS;

    // Unit Definitions
    const UNIT_TYPES = {
        'little': { name: 'こぐま', cost: 100, hp: 50, attack: 10, speed: 2, cooldown: 1000, icon: '🧸', id: 1 },
        'pillar': { name: '柱グマ', cost: 300, hp: 150, attack: 30, speed: 1.5, cooldown: 2000, icon: '🗿', id: 2 },
        'big': { name: 'おオグマ', cost: 500, hp: 400, attack: 80, speed: 1, cooldown: 4000, icon: '🐻', id: 3 },
        'max': { name: '最大おおぐま', cost: 1000, hp: 1000, attack: 200, speed: 0.5, cooldown: 8000, icon: '👹', id: 4 },
        'ninja': { name: '忍者グマ', cost: 2000, hp: 600, attack: 150, speed: 4, cooldown: 3000, icon: '🥷', id: 5 },
        'magic': { name: '魔法グマ', cost: 5000, hp: 800, attack: 300, speed: 1, cooldown: 5000, icon: '🧙', id: 6 },
        'mecha': { name: 'メカグマ', cost: 10000, hp: 3000, attack: 500, speed: 0.8, cooldown: 10000, icon: '🤖', id: 7 },
        'galaxy': { name: '銀河グマ', cost: 50000, hp: 10000, attack: 2000, speed: 2, cooldown: 15000, icon: '🌌', id: 8 },
        'universe': { name: '宇宙グマ', cost: 100000, hp: 20000, attack: 5000, speed: 3, cooldown: 20000, icon: '🪐', id: 9 },
        'dimension': { name: '次元グマ', cost: 500000, hp: 50000, attack: 10000, speed: 4, cooldown: 25000, icon: '🌀', id: 10 },
        'god': { name: '神グマ', cost: 1000000, hp: 100000, attack: 50000, speed: 1, cooldown: 30000, icon: '⚡', id: 11 },
        'infinity': { name: '無限グマ', cost: 5000000, hp: 500000, attack: 100000, speed: 5, cooldown: 40000, icon: '♾️', id: 12 }
    };

    // --- Persistent Data Management ---
    const STORAGE_KEY = 'kuma_wars_data';
    let playerData = {
        coins: 1000, // Starting bonus
        unlockedUnits: ['little'] // Default unlocked
    };

    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with default to handle new fields
                playerData = { ...playerData, ...parsed };
            } catch (e) {
                console.error("Save data corrupted", e);
            }
        }
        updateGlobalCoinsUI();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
        updateGlobalCoinsUI();
    }

    function updateGlobalCoinsUI() {
        const el = document.getElementById('player-coins');
        if (el) el.textContent = playerData.coins;
    }

    // --- Screens ---
    const mainMenuScreen = document.getElementById('main-menu-screen');
    const gachaScreen = document.getElementById('gacha-screen');
    const zukanScreen = document.getElementById('zukan-screen');

    // --- Event Listeners ---

    // Main Menu Navigation
    document.getElementById('menu-start-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        stageSelectScreen.style.display = 'flex';
    });

    document.getElementById('menu-gacha-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        gachaScreen.style.display = 'flex';
        document.getElementById('gacha-message').textContent = '';
        document.getElementById('gacha-result').textContent = '?';
    });

    document.getElementById('menu-zukan-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        zukanScreen.style.display = 'flex';
        renderZukan();
    });

    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        stageSelectScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    document.getElementById('back-to-menu-from-gacha-btn').addEventListener('click', () => {
        gachaScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    document.getElementById('back-to-menu-from-zukan-btn').addEventListener('click', () => {
        zukanScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    // Gacha Logic
    document.getElementById('pull-gacha-btn').addEventListener('click', () => {
        const cost = 1000;
        if (playerData.coins < cost) {
            document.getElementById('gacha-message').textContent = "コインが足りません！";
            return;
        }

        playerData.coins -= cost;

        // Random unit selection
        const unitKeys = Object.keys(UNIT_TYPES);
        const randomKey = unitKeys[Math.floor(Math.random() * unitKeys.length)];
        const unit = UNIT_TYPES[randomKey];

        document.getElementById('gacha-result').textContent = unit.icon;

        if (!playerData.unlockedUnits.includes(randomKey)) {
            playerData.unlockedUnits.push(randomKey);
            document.getElementById('gacha-message').textContent = `NEW! ${unit.name} をゲット！`;
        } else {
            document.getElementById('gacha-message').textContent = `${unit.name} (入手済み) - 500コイン還元`;
            playerData.coins += 500; // Refund half
        }

        saveData();
    });

    // Stage Selection
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

    // Summon Buttons (Delegation)
    const controlsDiv = document.getElementById('controls');
    controlsDiv.addEventListener('click', (e) => {
        // Handle clicks on the button or its children
        const btn = e.target.closest('.summon-btn');
        if (!btn) return;

        const type = btn.getAttribute('data-type');
        const cost = parseInt(btn.getAttribute('data-cost'));
        if (gameState.money >= cost && !gameState.gameOver && !btn.disabled) {
            gameState.money -= cost;
            spawnUnit(type, 'player');
            updateMoneyUI();

            // Simple cooldown visual (disable button temporarily)
            btn.disabled = true;
            setTimeout(() => {
                if (btn) btn.disabled = false;
            }, UNIT_TYPES[type].cooldown);
        }
    });

    // Zukan Render
    function renderZukan() {
        const grid = document.getElementById('zukan-grid');
        grid.innerHTML = '';

        Object.keys(UNIT_TYPES).forEach(key => {
            const unit = UNIT_TYPES[key];
            const isUnlocked = playerData.unlockedUnits.includes(key);

            const item = document.createElement('div');
            item.className = 'zukan-item';
            if (!isUnlocked) item.classList.add('locked');

            item.innerHTML = `
                <div class="zukan-icon">${isUnlocked ? unit.icon : '?'}</div>
                <div class="zukan-name">${isUnlocked ? unit.name : '???'}</div>
                <div class="zukan-cost">${isUnlocked ? '¥' + unit.cost : ''}</div>
            `;
            grid.appendChild(item);
        });
    }

    // --- Game Logic ---

    // Game State
    let gameLoopId;
    let gameState = {
        money: 0,
        stage: 1,
        units: [],
        playerBaseHp: 1000,
        enemyBaseHp: 1000,
        lastMoneyUpdate: 0,
        gameOver: false,
        startTime: 0,
        enemySpawnTimer: 0
    };

    function startGame(stageId, stageName) {
        // Reset State
        gameState = {
            money: 0,
            stage: stageId,
            units: [],
            playerBaseHp: 1000,
            enemyBaseHp: 1000 * Math.pow(1.2, stageId), // Exponential difficulty
            lastMoneyUpdate: Date.now(),
            gameOver: false,
            startTime: Date.now(),
            enemySpawnTimer: Date.now()
        };

        // Clear Lane
        lane.innerHTML = '';

        // Generate Controls based on Unlocks
        controlsDiv.innerHTML = '';
        playerData.unlockedUnits.forEach(key => {
            const unit = UNIT_TYPES[key];
            const btn = document.createElement('button');
            btn.className = 'summon-btn';
            btn.setAttribute('data-cost', unit.cost);
            btn.setAttribute('data-type', key);
            btn.innerHTML = `${unit.name}<br>¥${unit.cost}`;
            controlsDiv.appendChild(btn);
        });

        // Update UI
        stageSelectScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        backToSelectBtn.style.display = 'block'; // Show back button
        currentStageTitle.textContent = stageName;
        updateMoneyUI();
        updateBaseHpUI();

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
        let spawnInterval = 5000 - (gameState.stage * 300); // Faster in later stages
        if (spawnInterval < 500) spawnInterval = 500; // Cap speed

        if (now - gameState.enemySpawnTimer > spawnInterval) {
            // Determine enemy type based on time/difficulty
            let enemyType = 'little';

            // Progressive difficulty scaled by stage
            // Higher stages reach stronger units faster
            const difficultyMultiplier = gameState.stage; // 1 to 10
            const effectiveTime = timeElapsed * difficultyMultiplier;

            if (effectiveTime > 300) enemyType = 'galaxy';
            else if (effectiveTime > 200) enemyType = 'mecha';
            else if (effectiveTime > 120) enemyType = 'magic';
            else if (effectiveTime > 80) enemyType = 'ninja';
            else if (effectiveTime > 50) enemyType = 'max';
            else if (effectiveTime > 30) enemyType = 'big';
            else if (effectiveTime > 15) enemyType = 'pillar';

            // Random chance to spawn weaker units even late game
            // In high stages, force strong units
            if (gameState.stage >= 8 && Math.random() < 0.3) {
                 if (effectiveTime > 50) enemyType = 'max';
                 // Ensure we don't downgrade too much in hard stages
            }

            // Fallback: If stage is high, start with stronger units
            if (gameState.stage >= 5 && enemyType === 'little') enemyType = 'pillar';
            if (gameState.stage >= 8 && (enemyType === 'little' || enemyType === 'pillar')) enemyType = 'big';

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

        let message = isWin ? "勝利！ (Victory!)" : "敗北... (Defeat...)";

        if (isWin) {
            // Award Coins
            const reward = 100 * gameState.stage;
            playerData.coins += reward;
            saveData();
            message += `\n${reward} コイン獲得！`;
        }

        alert(message);

        // Return to Select
        gameScreen.style.display = 'none';
        stageSelectScreen.style.display = 'flex';
    }

    // Initialize
    loadData();

    // --- UI Updates ---

    function updateMoneyUI() {
        moneyDisplay.textContent = gameState.money;
    }

    function updateBaseHpUI() {
        playerBaseHpDisplay.textContent = Math.max(0, gameState.playerBaseHp);
        enemyBaseHpDisplay.textContent = Math.max(0, gameState.enemyBaseHp);
    }

    function updateButtonsState() {
        const dynamicButtons = document.querySelectorAll('.summon-btn');
        dynamicButtons.forEach(btn => {
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
