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
        'rainbow': { name: '虹グマ', cost: 7777, hp: 2000, attack: 777, speed: 7, cooldown: 7000, icon: '🌈', id: 77, rarity: 'legendary' },
        // New Units 2
        'burger': { name: 'バーガーグマ', cost: 500, hp: 1000, attack: 200, speed: 2, cooldown: 1000, icon: '🍔', id: 78, rarity: 'common' },
        'pizza': { name: 'ピザグマ', cost: 600, hp: 800, attack: 300, speed: 3, cooldown: 1200, icon: '🍕', id: 79, rarity: 'common' },
        'sushi': { name: '寿司グマ', cost: 1000, hp: 500, attack: 500, speed: 5, cooldown: 1500, icon: '🍣', id: 80, rarity: 'rare' },
        'donut': { name: 'ドーナツグマ', cost: 400, hp: 600, attack: 150, speed: 4, cooldown: 800, icon: '🍩', id: 81, rarity: 'common' },
        'cake': { name: 'ケーキグマ', cost: 800, hp: 1200, attack: 100, speed: 1, cooldown: 2000, icon: '🍰', id: 82, rarity: 'common' },
        'baseball': { name: '野球グマ', cost: 2000, hp: 1500, attack: 600, speed: 3, cooldown: 2500, icon: '⚾', id: 83, rarity: 'rare' },
        'soccer': { name: 'サッカーグマ', cost: 2200, hp: 1200, attack: 700, speed: 5, cooldown: 2800, icon: '⚽', id: 84, rarity: 'rare' },
        'tennis': { name: 'テニスグマ', cost: 1800, hp: 1000, attack: 500, speed: 6, cooldown: 2200, icon: '🎾', id: 85, rarity: 'rare' },
        'basketball': { name: 'バスケグマ', cost: 2500, hp: 1800, attack: 800, speed: 4, cooldown: 3000, icon: '🏀', id: 86, rarity: 'epic' },
        'golf': { name: 'ゴルフグマ', cost: 1500, hp: 900, attack: 400, speed: 2, cooldown: 2000, icon: '⛳', id: 87, rarity: 'common' },
        'guitar': { name: 'ギターグマ', cost: 3000, hp: 1200, attack: 1000, speed: 3, cooldown: 3500, icon: '🎸', id: 88, rarity: 'epic' },
        'piano': { name: 'ピアノグマ', cost: 3500, hp: 2000, attack: 800, speed: 1, cooldown: 4000, icon: '🎹', id: 89, rarity: 'epic' },
        'drum': { name: 'ドラムグマ', cost: 2800, hp: 2500, attack: 500, speed: 2, cooldown: 3000, icon: '🥁', id: 90, rarity: 'rare' },
        'violin': { name: 'バイオリングマ', cost: 3200, hp: 1000, attack: 1200, speed: 3, cooldown: 3800, icon: '🎻', id: 91, rarity: 'epic' },
        'trumpet': { name: 'ラッパグマ', cost: 2600, hp: 1500, attack: 600, speed: 4, cooldown: 3200, icon: '🎺', id: 92, rarity: 'rare' },
        'mummy': { name: 'ミイラグマ', cost: 1200, hp: 3000, attack: 200, speed: 1, cooldown: 2500, icon: '🤕', id: 93, rarity: 'common' },
        'werewolf': { name: '狼男グマ', cost: 4000, hp: 2500, attack: 1500, speed: 6, cooldown: 4500, icon: '🐺', id: 94, rarity: 'epic' },
        'reaper': { name: '死神グマ', cost: 10000, hp: 500, attack: 10000, speed: 5, cooldown: 10000, icon: '💀', id: 95, rarity: 'legendary' },
        'bat': { name: 'コウモリグマ', cost: 800, hp: 400, attack: 300, speed: 7, cooldown: 1000, icon: '🦇', id: 96, rarity: 'common' },
        'metal': { name: 'メタルグマ', cost: 50000, hp: 100, attack: 100, speed: 10, cooldown: 5000, icon: '⚙️', id: 97, rarity: 'legendary' }
    };

    // --- Persistent Data Management ---
    const STORAGE_KEY = 'kuma_wars_data';
    let playerData = {
        coins: 1000, // Starting bonus
        normalTickets: 5, // Start with some tickets
        rareTickets: 1,  // Start with one rare ticket
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
                // Ensure tickets exist
                if (playerData.normalTickets === undefined) playerData.normalTickets = 5;
                if (playerData.rareTickets === undefined) playerData.rareTickets = 1;
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
        const coinEl = document.getElementById('player-coins');
        if (coinEl) coinEl.textContent = playerData.coins;

        const normalTicketEl = document.getElementById('player-normal-tickets');
        if (normalTicketEl) normalTicketEl.textContent = playerData.normalTickets;

        const rareTicketEl = document.getElementById('player-rare-tickets');
        if (rareTicketEl) rareTicketEl.textContent = playerData.rareTickets;
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

    // Reset All Data
    document.getElementById('reset-all-btn').addEventListener('click', () => {
        if (confirm("本当にデータを全部消して最初からにしますか？ (Are you sure you want to reset all data?)")) {
            localStorage.removeItem(STORAGE_KEY);
            playerData = {
                coins: 1000,
                unlockedUnits: ['little'],
                unitLevels: { 'little': 1 },
                selectedDeck: ['little'],
                maxStageCleared: 0
            };
            saveData();
            loadData();
            alert("データをリセットしました。 (Data reset complete.)");
        }
    });

    // Gacha Logic - Helper
    function executeGacha(poolType) {
        // Weighted Random Selection
        const unitKeys = Object.keys(UNIT_TYPES);
        let weightedPool = [];

        unitKeys.forEach(key => {
            const unit = UNIT_TYPES[key];
            let weight = 0;

            if (poolType === 'normal') {
                if (unit.rarity === 'common') weight = 60;
                else if (unit.rarity === 'rare') weight = 30;
                else if (unit.rarity === 'epic') weight = 9;
                else if (unit.rarity === 'legendary') weight = 1;
            } else if (poolType === 'rare') {
                if (unit.rarity === 'common') weight = 0; // No common
                else if (unit.rarity === 'rare') weight = 10;
                else if (unit.rarity === 'epic') weight = 60;
                else if (unit.rarity === 'legendary') weight = 30; // High chance for legendary
            }

            for(let i=0; i<weight; i++) weightedPool.push(key);
        });

        if (weightedPool.length === 0) return null; // Should not happen

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
        }

        saveData();
    }

    // Normal Gacha Listener
    document.getElementById('pull-gacha-btn').addEventListener('click', () => {
        if (playerData.normalTickets < 1) {
            document.getElementById('gacha-message').textContent = "チケットが足りません！";
            return;
        }
        playerData.normalTickets--;
        executeGacha('normal');
    });

    // Rare Gacha Listener
    const rareGachaBtn = document.getElementById('pull-rare-gacha-btn');
    if (rareGachaBtn) {
        rareGachaBtn.addEventListener('click', () => {
            if (playerData.rareTickets < 1) {
                document.getElementById('gacha-message').textContent = "レアチケットが足りません！";
                return;
            }
            playerData.rareTickets--;
            executeGacha('rare');
        });
    }

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

    // System Buttons
    const upgradeWorkerBtn = document.getElementById('upgrade-worker-btn');
    if (upgradeWorkerBtn) upgradeWorkerBtn.addEventListener('click', upgradeWorker);

    const fireCannonBtn = document.getElementById('fire-cannon-btn');
    if (fireCannonBtn) fireCannonBtn.addEventListener('click', fireCannon);

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

        document.getElementById('team-count').textContent = `${playerData.selectedDeck.length} / 10`;
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
            if (playerData.selectedDeck.length < 10) {
                playerData.selectedDeck.push(key);
            } else {
                // Already at limit
                alert("10匹までしか選べません！(Max 10 units)");
            }
        }
        saveData();
    }

    // --- Game Logic ---

    // Game State
    let gameLoopId;
    let gameState = {
        money: 0,
        maxMoney: 1000,
        workerLevel: 1,
        cannonCharge: 0,
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
            maxMoney: 1000, // Initial Cap
            workerLevel: 1,
            cannonCharge: 0,
            stage: stageId,
            units: [],
            playerBaseHp: 1000,
            enemyBaseHp: 1000 * Math.pow(1.2, stageId),
            lastMoneyUpdate: Date.now(),
            gameOver: false,
            startTime: Date.now(),
            enemySpawnTimer: Date.now()
        };

        updateSystemButtons();

        // Clear Lane
        lane.innerHTML = '';

        // Apply Rainbow Road Theme
        const battleField = document.getElementById('battle-field');
        if (stageId > 50) {
            battleField.classList.add('rainbow-road');
        } else {
            battleField.classList.remove('rainbow-road');
        }

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
        if (now - gameState.lastMoneyUpdate > 30) {
            // Calculate rate based on Worker Level
            // Base: 1000. Each level adds 500.
            const income = 1000 + (gameState.workerLevel - 1) * 500 + (gameState.stage * 100);

            if (gameState.money < gameState.maxMoney) {
                gameState.money += income;
                if (gameState.money > gameState.maxMoney) gameState.money = gameState.maxMoney;
            }

            // Cannon Charge
            if (gameState.cannonCharge < 100) {
                gameState.cannonCharge += 0.5; // Charge up
                if (gameState.cannonCharge > 100) gameState.cannonCharge = 100;
                updateCannonUI();
            }

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
        let level = 1;

        // Apply Level Bonus for Player
        if (side === 'player') {
            level = playerData.unitLevels[type] || 1;
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
            element: createUnitElement(type, side, level)
        };

        gameState.units.push(unit);
        lane.appendChild(unit.element);
        updateUnitPosition(unit);
    }

    function createUnitElement(type, side, level = 1) {
        const el = document.createElement('div');
        el.classList.add('unit', side);
        el.setAttribute('data-type', type);
        el.textContent = UNIT_TYPES[type].icon;

        if (side === 'player' && level > 10) {
            el.classList.add('unit-evolved');
        }

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
            // Award Coins
            const rewardCoins = 1000 * gameState.stage;
            playerData.coins += rewardCoins;

            // Award Tickets
            let rewardMsg = `\n${rewardCoins} コイン獲得！`;

            // Normal Ticket for every clear
            playerData.normalTickets++;
            rewardMsg += `\nガチャチケット x1 GET!`;

            // Rare Ticket for Boss Stages (Every 5 stages)
            if (gameState.stage % 5 === 0) {
                playerData.rareTickets++;
                rewardMsg += `\nレアチケット x1 GET!`;
            }

            // Unlock next stage
            if (gameState.stage > playerData.maxStageCleared) {
                playerData.maxStageCleared = gameState.stage;
            }

            saveData();
            updateStageButtons();
            message += rewardMsg;
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
        moneyDisplay.textContent = `${Math.floor(gameState.money)} / ${gameState.maxMoney}`;
        updateSystemButtons();
    }

    function updateCannonUI() {
        const btn = document.getElementById('fire-cannon-btn');
        if (btn) {
            const charge = Math.floor(gameState.cannonCharge);
            btn.textContent = `くまじゅう\n${charge}%`;
            // Visual feedback
            btn.style.background = `linear-gradient(to right, #99ff99 ${charge}%, #eee ${charge}%)`;

            if (charge >= 100) {
                btn.classList.add('ready');
                btn.disabled = false;
            } else {
                btn.classList.remove('ready');
                btn.disabled = true;
            }
        }
    }

    function updateSystemButtons() {
        // Worker Upgrade Button
        const workerBtn = document.getElementById('upgrade-worker-btn');
        if (workerBtn) {
            const nextLevel = gameState.workerLevel + 1;
            const cost = nextLevel * 500; // Example scaling
            workerBtn.innerHTML = `働きネコ Lv.${gameState.workerLevel}<br>UP: ¥${cost}`;

            if (gameState.money >= cost && gameState.workerLevel < 8) { // Max level 8
                workerBtn.disabled = false;
                workerBtn.style.opacity = '1';
            } else {
                workerBtn.disabled = true;
                workerBtn.style.opacity = '0.6';
                if (gameState.workerLevel >= 8) {
                    workerBtn.innerHTML = `働きネコ<br>MAX`;
                }
            }
        }
    }

    function upgradeWorker() {
        const nextLevel = gameState.workerLevel + 1;
        const cost = nextLevel * 500;

        if (gameState.workerLevel < 8 && gameState.money >= cost) {
            gameState.money -= cost;
            gameState.workerLevel++;
            gameState.maxMoney += 1000; // Increase cap
            updateMoneyUI();
        }
    }

    function fireCannon() {
        if (gameState.cannonCharge >= 100) {
            gameState.cannonCharge = 0;

            // Effect: Damage all enemies and push them back
            gameState.units.forEach(unit => {
                if (unit.side === 'enemy') {
                    unit.hp -= 500; // Base damage
                    unit.x += 100; // Push back
                    visualizeDamage(unit);
                }
            });

            // Visual Effect (Hadou Wave)
            const lane = document.getElementById('lane');
            if (lane) {
                const wave = document.createElement('div');
                wave.className = 'hadou-wave';
                wave.textContent = '🌊'; // Optional icon
                lane.appendChild(wave);

                // Cleanup after animation
                setTimeout(() => wave.remove(), 1000);
            }

            updateCannonUI();
        }
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
