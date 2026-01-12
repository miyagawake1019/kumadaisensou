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
        'little': { name: 'こぐま', cost: 50, hp: 50, attack: 10, speed: 2, cooldown: 1000, icon: '🧸', id: 1, rarity: 'common' },
        'pillar': { name: '柱グマ', cost: 150, hp: 150, attack: 30, speed: 1.5, cooldown: 2000, icon: '🗿', id: 2, rarity: 'common' },
        'big': { name: 'おオグマ', cost: 250, hp: 400, attack: 80, speed: 1, cooldown: 4000, icon: '🐻', id: 3, rarity: 'common' },
        'max': { name: '最大おおぐま', cost: 500, hp: 1000, attack: 200, speed: 0.5, cooldown: 8000, icon: '👹', id: 4, rarity: 'rare' },
        'ninja': { name: '忍者グマ', cost: 1000, hp: 600, attack: 150, speed: 4, cooldown: 3000, icon: '🥷', id: 5, rarity: 'rare' },
        'magic': { name: '魔法グマ', cost: 2500, hp: 800, attack: 300, speed: 1, cooldown: 5000, icon: '🧙', id: 6, rarity: 'rare' },
        'mecha': { name: 'メカグマ', cost: 5000, hp: 3000, attack: 500, speed: 0.8, cooldown: 10000, icon: '🤖', id: 7, rarity: 'epic' },
        'galaxy': { name: '銀河グマ', cost: 25000, hp: 10000, attack: 2000, speed: 2, cooldown: 15000, icon: '🌌', id: 8, rarity: 'legendary' },
        'universe': { name: '宇宙グマ', cost: 50000, hp: 20000, attack: 5000, speed: 3, cooldown: 20000, icon: '🪐', id: 9, rarity: 'legendary' },
        'dimension': { name: '次元グマ', cost: 250000, hp: 50000, attack: 10000, speed: 4, cooldown: 25000, icon: '🌀', id: 10, rarity: 'legendary' },
        'god': { name: '神グマ', cost: 500000, hp: 100000, attack: 50000, speed: 1, cooldown: 30000, icon: '⚡', id: 11, rarity: 'legendary' },
        'infinity': { name: '無限グマ', cost: 2500000, hp: 500000, attack: 100000, speed: 5, cooldown: 40000, icon: '♾️', id: 12, rarity: 'legendary' },
        'fire': { name: '炎グマ', cost: 750, hp: 400, attack: 120, speed: 3, cooldown: 2500, icon: '🔥', id: 13, rarity: 'rare' },
        'ice': { name: '氷グマ', cost: 750, hp: 600, attack: 80, speed: 1.5, cooldown: 2500, icon: '🧊', id: 14, rarity: 'rare' },
        'thunder': { name: '雷グマ', cost: 1250, hp: 500, attack: 150, speed: 5, cooldown: 3000, icon: '⚡', id: 15, rarity: 'rare' },
        'knight': { name: '騎士グマ', cost: 1500, hp: 1500, attack: 100, speed: 1, cooldown: 3500, icon: '🛡️', id: 16, rarity: 'rare' },
        'king': { name: '王様グマ', cost: 10000, hp: 5000, attack: 800, speed: 1.2, cooldown: 10000, icon: '👑', id: 17, rarity: 'epic' },
        'angel': { name: '天使グマ', cost: 3000, hp: 800, attack: 200, speed: 2, cooldown: 4000, icon: '👼', id: 18, rarity: 'rare' },
        'devil': { name: '悪魔グマ', cost: 4000, hp: 1200, attack: 400, speed: 3, cooldown: 4500, icon: '😈', id: 19, rarity: 'rare' },
        'robot': { name: 'ロボグマ', cost: 6000, hp: 4000, attack: 300, speed: 0.5, cooldown: 8000, icon: '🦾', id: 20, rarity: 'epic' },
        'samurai': { name: '侍グマ', cost: 8000, hp: 2000, attack: 1000, speed: 4, cooldown: 5000, icon: '⚔️', id: 21, rarity: 'epic' },
        'craft': { name: '攻撃クラフト', cost: 12000, hp: 3000, attack: 1500, speed: 5, cooldown: 6000, icon: '✈️', id: 22, rarity: 'epic' },
        'dragon': { name: 'ドラゴングマ', cost: 15000, hp: 8000, attack: 2000, speed: 2, cooldown: 12000, icon: '🐉', id: 23, rarity: 'epic' },
        'hero': { name: '勇者グマ', cost: 20000, hp: 5000, attack: 3000, speed: 3, cooldown: 10000, icon: '🗡️', id: 24, rarity: 'epic' },
        'alien': { name: 'エイリアングマ', cost: 30000, hp: 6000, attack: 4000, speed: 4, cooldown: 8000, icon: '👽', id: 25, rarity: 'legendary' },
        'ghost': { name: 'ゴーストグマ', cost: 40000, hp: 2000, attack: 5000, speed: 6, cooldown: 5000, icon: '👻', id: 26, rarity: 'legendary' },
        'legend': { name: '伝説のクマ', cost: 10000000, hp: 1000000, attack: 500000, speed: 5, cooldown: 20000, icon: '⚜️', id: 27, rarity: 'legendary' },
        'shadow': { name: '影グマ', cost: 5000, hp: 1500, attack: 600, speed: 6, cooldown: 4000, icon: '👥', id: 28, rarity: 'epic' },
        'sun': { name: '太陽グマ', cost: 100000, hp: 30000, attack: 8000, speed: 1, cooldown: 15000, icon: '☀️', id: 29, rarity: 'legendary' },
        'moon': { name: '月グマ', cost: 80000, hp: 25000, attack: 6000, speed: 2, cooldown: 14000, icon: '🌙', id: 30, rarity: 'legendary' },
        'star': { name: '星グマ', cost: 60000, hp: 15000, attack: 10000, speed: 5, cooldown: 10000, icon: '⭐', id: 31, rarity: 'legendary' },
        'blackhole': { name: 'ブラックホールグマ', cost: 5000000, hp: 800000, attack: 200000, speed: 0.2, cooldown: 50000, icon: '⚫', id: 32, rarity: 'legendary' },
        'virus': { name: 'ウイルスグマ', cost: 3000, hp: 500, attack: 1000, speed: 4, cooldown: 2000, icon: '🦠', id: 33, rarity: 'rare' },
        'glitch': { name: 'グリッチグマ', cost: 15000, hp: 5000, attack: 5000, speed: 8, cooldown: 500, icon: '👾', id: 34, rarity: 'epic' },
        'panda': { name: 'パンダ', cost: 300, hp: 600, attack: 150, speed: 2, cooldown: 1200, icon: '🐼', id: 45, rarity: 'common' },
        // New Units
        'leaf': { name: '葉っぱグマ', cost: 100, hp: 300, attack: 50, speed: 4, cooldown: 800, icon: '🍃', id: 46, rarity: 'common' },
        'flower': { name: '花グマ', cost: 200, hp: 400, attack: 80, speed: 3, cooldown: 1000, icon: '🌼', id: 47, rarity: 'common' },
        'tree': { name: '木グマ', cost: 500, hp: 2000, attack: 100, speed: 1, cooldown: 3000, icon: '🌳', id: 48, rarity: 'common' },
        'cactus': { name: 'サボテングマ', cost: 600, hp: 800, attack: 300, speed: 2, cooldown: 1500, icon: '🌵', id: 49, rarity: 'common' },
        'mushroom': { name: 'キノコグマ', cost: 150, hp: 200, attack: 200, speed: 2, cooldown: 900, icon: '🍄', id: 50, rarity: 'common' },
        'cat': { name: 'ネコグマ', cost: 400, hp: 500, attack: 250, speed: 5, cooldown: 1200, icon: '🐱', id: 51, rarity: 'common' },
        'dog': { name: 'イヌグマ', cost: 450, hp: 600, attack: 200, speed: 4, cooldown: 1300, icon: '🐶', id: 52, rarity: 'common' },
        'rabbit': { name: 'ウサギグマ', cost: 350, hp: 300, attack: 150, speed: 6, cooldown: 1000, icon: '🐰', id: 53, rarity: 'common' },
        'turtle': { name: 'カメグマ', cost: 800, hp: 3000, attack: 50, speed: 0.5, cooldown: 4000, icon: '🐢', id: 54, rarity: 'common' },
        'shark': { name: 'サメグマ', cost: 1200, hp: 1000, attack: 600, speed: 4, cooldown: 2000, icon: '🦈', id: 55, rarity: 'rare' },
        'doctor': { name: 'ドクターグマ', cost: 2000, hp: 800, attack: 100, speed: 2, cooldown: 5000, icon: '🥼', id: 56, rarity: 'rare' },
        'nurse': { name: 'ナースグマ', cost: 1800, hp: 700, attack: 80, speed: 3, cooldown: 4500, icon: '💉', id: 57, rarity: 'rare' },
        'police': { name: 'ポリスグマ', cost: 1500, hp: 1200, attack: 400, speed: 3, cooldown: 2500, icon: '👮', id: 58, rarity: 'rare' },
        'firefighter': { name: '消防士グマ', cost: 1600, hp: 1500, attack: 300, speed: 3, cooldown: 3000, icon: '🚒', id: 59, rarity: 'rare' },
        'pilot': { name: 'パイロットグマ', cost: 2500, hp: 1000, attack: 800, speed: 5, cooldown: 4000, icon: '👨‍✈️', id: 60, rarity: 'epic' },
        'astronaut': { name: '宇宙飛行士グマ', cost: 5000, hp: 2000, attack: 1000, speed: 1, cooldown: 6000, icon: '👨‍🚀', id: 61, rarity: 'epic' },
        'elf': { name: 'エルフグマ', cost: 3000, hp: 900, attack: 700, speed: 4, cooldown: 2500, icon: '🧝', id: 62, rarity: 'epic' },
        'dwarf': { name: 'ドワーフグマ', cost: 3500, hp: 2500, attack: 600, speed: 2, cooldown: 4000, icon: '🧔', id: 63, rarity: 'epic' },
        'orc': { name: 'オークグマ', cost: 2800, hp: 3000, attack: 500, speed: 2, cooldown: 3500, icon: '👹', id: 64, rarity: 'rare' },
        'goblin': { name: 'ゴブリングマ', cost: 800, hp: 400, attack: 300, speed: 5, cooldown: 1000, icon: '👺', id: 65, rarity: 'common' },
        'slime': { name: 'スライムグマ', cost: 500, hp: 1000, attack: 100, speed: 1, cooldown: 1500, icon: '💧', id: 66, rarity: 'common' },
        'skeleton': { name: 'ガイコツグマ', cost: 1000, hp: 600, attack: 400, speed: 3, cooldown: 1800, icon: '💀', id: 67, rarity: 'common' },
        'witch': { name: '魔女グマ', cost: 4500, hp: 800, attack: 1200, speed: 2, cooldown: 5000, icon: '🧙‍♀️', id: 68, rarity: 'epic' },
        'wizard': { name: '魔法使いグマ', cost: 4500, hp: 800, attack: 1200, speed: 2, cooldown: 5000, icon: '🧙‍♂️', id: 69, rarity: 'epic' },
        'cyborg': { name: 'サイボーググマ', cost: 8000, hp: 5000, attack: 2000, speed: 3, cooldown: 7000, icon: '🦾', id: 70, rarity: 'legendary' },
        'drone': { name: 'ドローングマ', cost: 2000, hp: 500, attack: 500, speed: 6, cooldown: 2000, icon: '🚁', id: 71, rarity: 'rare' },
        'laser': { name: 'レーザーグマ', cost: 6000, hp: 1500, attack: 3000, speed: 1, cooldown: 8000, icon: '🔫', id: 72, rarity: 'epic' },
        'rocket': { name: 'ロケットグマ', cost: 5000, hp: 1000, attack: 4000, speed: 8, cooldown: 10000, icon: '🚀', id: 73, rarity: 'epic' },
        'ball': { name: 'ボールグマ', cost: 100, hp: 200, attack: 50, speed: 6, cooldown: 500, icon: '⚽', id: 74, rarity: 'common' },
        'box': { name: '箱グマ', cost: 200, hp: 1000, attack: 0, speed: 0, cooldown: 2000, icon: '📦', id: 75, rarity: 'common' },
        'cloud': { name: '雲グマ', cost: 1500, hp: 800, attack: 200, speed: 1, cooldown: 3000, icon: '☁️', id: 76, rarity: 'rare' },
        'rainbow': { name: '虹グマ', cost: 7777, hp: 2000, attack: 777, speed: 7, cooldown: 7000, icon: '🌈', id: 77, rarity: 'legendary' }
    };

    // --- Persistent Data Management ---
    const STORAGE_KEY = 'kuma_wars_data';
    let playerData = {
        coins: 1000, // Starting bonus
        unlockedUnits: ['little'], // Default unlocked
        unitLevels: { 'little': 1 }, // Unit levels
        selectedDeck: ['little'], // Units selected for battle (max 3)
        maxStageCleared: 0 // Track progression
    };

    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with default to handle new fields
                playerData = { ...playerData, ...parsed };
                // Ensure unitLevels exists for backward compatibility
                if (!playerData.unitLevels) {
                    playerData.unitLevels = {};
                    playerData.unlockedUnits.forEach(u => playerData.unitLevels[u] = 1);
                }
            } catch (e) {
                console.error("Save data corrupted", e);
            }
        }
        updateGlobalCoinsUI();
        updateStageButtons();
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
    const teamSelectScreen = document.getElementById('team-select-screen');

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

    document.getElementById('menu-team-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        teamSelectScreen.style.display = 'flex';
        renderTeamSelect();
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

    document.getElementById('back-to-menu-from-team-btn').addEventListener('click', () => {
        teamSelectScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    // Gacha Logic
    document.getElementById('pull-gacha-btn').addEventListener('click', () => {
        const cost = 500;
        if (playerData.coins < cost) {
            document.getElementById('gacha-message').textContent = "コインが足りません！";
            return;
        }

        playerData.coins -= cost;

        // Weighted Random Selection
        const unitKeys = Object.keys(UNIT_TYPES);
        let weightedPool = [];

        unitKeys.forEach(key => {
            const unit = UNIT_TYPES[key];
            let weight = 1;
            if (unit.rarity === 'common') weight = 50;
            else if (unit.rarity === 'rare') weight = 20;
            else if (unit.rarity === 'epic') weight = 5;
            else if (unit.rarity === 'legendary') weight = 1;

            for(let i=0; i<weight; i++) weightedPool.push(key);
        });

        const randomKey = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        const unit = UNIT_TYPES[randomKey];

        document.getElementById('gacha-result').textContent = unit.icon;

        if (!playerData.unlockedUnits.includes(randomKey)) {
            playerData.unlockedUnits.push(randomKey);
            playerData.unitLevels[randomKey] = 1;
            document.getElementById('gacha-message').textContent = `NEW! ${unit.name} をゲット！ (Lv.1)`;
        } else {
            // Duplicate: Level Up
            if (!playerData.unitLevels[randomKey]) playerData.unitLevels[randomKey] = 1;
            playerData.unitLevels[randomKey]++;
            const newLevel = playerData.unitLevels[randomKey];
            document.getElementById('gacha-message').textContent = `${unit.name} かぶり！ レベルアップ！ (Lv.${newLevel})`;
            // No coin refund, stats increased instead
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
            const level = playerData.unitLevels[key] || 1;

            const item = document.createElement('div');
            item.className = 'zukan-item';
            if (!isUnlocked) item.classList.add('locked');

            item.innerHTML = `
                <div class="zukan-icon">${isUnlocked ? unit.icon : '?'}</div>
                <div class="zukan-name">${isUnlocked ? unit.name : '???'}</div>
                <div class="zukan-cost">${isUnlocked ? 'Lv.' + level : ''}</div>
            `;
            grid.appendChild(item);
        });
    }

    // Team Select Render & Logic
    function renderTeamSelect() {
        const grid = document.getElementById('team-grid');
        grid.innerHTML = '';

        playerData.unlockedUnits.forEach(key => {
            const unit = UNIT_TYPES[key];
            const isSelected = playerData.selectedDeck.includes(key);
            const level = playerData.unitLevels[key] || 1;

            const item = document.createElement('div');
            item.className = 'team-item';
            if (isSelected) item.classList.add('selected');

            item.innerHTML = `
                <div class="zukan-icon">${unit.icon}</div>
                <div class="zukan-name">${unit.name} (Lv.${level})</div>
            `;

            item.addEventListener('click', () => {
                toggleUnitSelection(key);
                renderTeamSelect(); // Re-render to show updates
            });

            grid.appendChild(item);
        });

        document.getElementById('team-count').textContent = `${playerData.selectedDeck.length} / 3`;
    }

    function toggleUnitSelection(key) {
        if (playerData.selectedDeck.includes(key)) {
            // Deselect
            // Don't allow empty deck (optional, but good UX)
            if (playerData.selectedDeck.length > 1) {
                playerData.selectedDeck = playerData.selectedDeck.filter(k => k !== key);
            }
        } else {
            // Select
            if (playerData.selectedDeck.length < 3) {
                playerData.selectedDeck.push(key);
            } else {
                // Already at 3, maybe alert or replace?
                // For simplicity: alert
                alert("3匹までしか選べません！(Max 3 units)");
            }
        }
        saveData();
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
            enemyBaseHp: 1000 * Math.pow(1.2, stageId), // Adjusted difficulty scaling (1.15 -> 1.2)
            lastMoneyUpdate: Date.now(),
            gameOver: false,
            startTime: Date.now(),
            enemySpawnTimer: Date.now()
        };

        // Clear Lane
        lane.innerHTML = '';

        // Generate Controls based on Selected Deck
        controlsDiv.innerHTML = '';
        // Use default if nothing selected (shouldn't happen due to initialization logic)
        const deck = (playerData.selectedDeck && playerData.selectedDeck.length > 0)
            ? playerData.selectedDeck
            : playerData.unlockedUnits.slice(0, 3);

        deck.forEach(key => {
            const unit = UNIT_TYPES[key];
            const level = playerData.unitLevels[key] || 1;
            const btn = document.createElement('button');
            btn.className = 'summon-btn';
            btn.setAttribute('data-cost', unit.cost);
            btn.setAttribute('data-type', key);
            btn.innerHTML = `${unit.name} Lv.${level}<br>¥${unit.cost}`;
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
        if (now - gameState.lastMoneyUpdate > 30) { // Every 0.03 seconds (Insanely fast)
            gameState.money += 1000 + (gameState.stage * 100); // Even bigger amount
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

        // Base spawn rate - Slower than before
        let spawnInterval = 6000 - (gameState.stage * 200);
        if (spawnInterval < 1000) spawnInterval = 1000; // Cap speed not too fast

        if (now - gameState.enemySpawnTimer > spawnInterval) {
            // Determine enemy type based on time/difficulty
            let enemyType = 'little';

            // Progressive difficulty scaled by stage
            // Higher stages reach stronger units faster, but slowed down overall
            const difficultyMultiplier = gameState.stage * 0.8; // Reduced multiplier
            const effectiveTime = timeElapsed * difficultyMultiplier;

            // Adjusted thresholds to delay strong enemies
            if (effectiveTime > 400) enemyType = 'galaxy';
            else if (effectiveTime > 300) enemyType = 'mecha';
            else if (effectiveTime > 200) enemyType = 'magic';
            else if (effectiveTime > 120) enemyType = 'ninja';
            else if (effectiveTime > 80) enemyType = 'max';
            else if (effectiveTime > 50) enemyType = 'big';
            else if (effectiveTime > 20) enemyType = 'pillar';

            // Ensure Galaxy Bear appears in very late stages regardless of time, but rare
            if (gameState.stage >= 15 && Math.random() < 0.1) {
                enemyType = 'galaxy';
            }

            // Legend Bear in final stages
            if (gameState.stage >= 40 && Math.random() < 0.05) {
                enemyType = 'legend';
            }

            spawnUnit(enemyType, 'enemy');
            gameState.enemySpawnTimer = now;
        }
    }

    function spawnUnit(type, side) {
        const stats = UNIT_TYPES[type];

        // Base Stats
        let hp = stats.hp;
        let attack = stats.attack;

        // Apply Level Bonus for Player
        if (side === 'player') {
            const level = playerData.unitLevels[type] || 1;
            if (level > 1) {
                // +100 HP/Attack per level
                hp += (level - 1) * 100;
                attack += (level - 1) * 100;
            }
        }

        // Scale Enemy Stats
        if (side === 'enemy') {
            const multiplier = 1 + (gameState.stage * 0.1); // +10% per stage (Reduced from 20%)
            hp *= multiplier;
            attack *= multiplier;
        } else if (side === 'player' && type === 'little') {
            // Player's Little Bear is overpowered (100 Billion) - Level bonus adds on top but is negligible
            hp = 100000000000;
            attack = 100000000000;
        }

        const unit = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            side: side,
            x: side === 'player' ? PLAYER_BASE_X : ENEMY_BASE_X,
            hp: hp,
            maxHp: hp,
            attack: attack,
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

                            // Fire Effect for Little Bear
                            if (u1.type === 'little') {
                                createFireEffect(u2.x, 20 + 25); // Approximate center Y
                            }
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
                handleUnitDeath(unit);
                return false;
            }
            return true;
        });
    }

    function handleUnitDeath(unit) {
        // 1. Deal 100 Damage to nearby enemies
        // Note: gameState.units contains the *current* state.
        // We iterate over surviving units to apply damage.

        gameState.units.forEach(target => {
            if (target.side !== unit.side) {
                const dist = Math.abs(target.x - unit.x);
                if (dist < 100) { // Death blast range
                    target.hp -= 100;
                    visualizeDamage(target);
                }
            }
        });

        // 2. Visuals - Become Angel
        unit.element.textContent = '👼';
        unit.element.classList.add('angel-ascend');
        // Reset specific unit styles that might conflict or look weird
        // (optional, but angel text is enough for "angel form")

        // 3. Remove DOM later
        setTimeout(() => {
            unit.element.remove();
        }, 1000);
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
            // Award Coins - significantly increased
            const reward = 1000 * gameState.stage; // Was 500 * stage
            playerData.coins += reward;

            // Unlock next stage
            if (gameState.stage > playerData.maxStageCleared) {
                playerData.maxStageCleared = gameState.stage;
            }

            saveData();
            updateStageButtons();
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

    function updateStageButtons() {
        const buttons = document.querySelectorAll('.stage-btn');
        buttons.forEach(btn => {
            const stage = parseInt(btn.getAttribute('data-stage'));
            if (stage > playerData.maxStageCleared + 1) {
                btn.disabled = true;
                btn.classList.add('locked');
            } else {
                btn.disabled = false;
                btn.classList.remove('locked');
            }
        });
    }

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

    function createFireEffect(x, y) {
        const fire = document.createElement('div');
        fire.className = 'fire-effect';
        fire.textContent = '🔥';
        fire.style.left = x + 'px';
        fire.style.bottom = y + 'px';
        lane.appendChild(fire);

        setTimeout(() => {
            fire.remove();
        }, 500);
    }
});
