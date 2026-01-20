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
        'little': { name: 'こぐま', cost: 50, hp: 50, attack: 10, speed: 2, cooldown: 1000, icon: '🧸', id: 1, rarity: 'common', abilities: {} },
        'pillar': { name: '柱グマ', cost: 150, hp: 150, attack: 30, speed: 1.5, cooldown: 2000, icon: '🗿', id: 2, rarity: 'common', abilities: {} },
        'big': { name: 'おオグマ', cost: 250, hp: 400, attack: 80, speed: 1, cooldown: 4000, icon: '🐻', id: 3, rarity: 'common', abilities: {} },
        'max': { name: '最大おおぐま', cost: 500, hp: 1000, attack: 200, speed: 0.5, cooldown: 8000, icon: '👹', id: 4, rarity: 'rare', abilities: { kbChance: 0.2 } },
        'ninja': { name: '忍者グマ', cost: 1000, hp: 600, attack: 150, speed: 4, cooldown: 3000, icon: '🥷', id: 5, rarity: 'rare', abilities: { massiveVs: ['black'] } },
        'magic': { name: '魔法グマ', cost: 2500, hp: 800, attack: 300, speed: 1, cooldown: 5000, icon: '🧙', id: 6, rarity: 'rare', abilities: { slow: 0.3 } },
        'mecha': { name: 'メカグマ', cost: 5000, hp: 3000, attack: 500, speed: 0.8, cooldown: 10000, icon: '🤖', id: 7, rarity: 'epic', abilities: { strongVs: ['alien'] } },
        'galaxy': { name: '銀河グマ', cost: 25000, hp: 10000, attack: 2000, speed: 2, cooldown: 15000, icon: '🌌', id: 8, rarity: 'legendary', abilities: { massiveVs: ['alien'] } },
        'universe': { name: '宇宙グマ', cost: 50000, hp: 20000, attack: 5000, speed: 3, cooldown: 20000, icon: '🪐', id: 9, rarity: 'legendary' },
        'dimension': { name: '次元グマ', cost: 250000, hp: 50000, attack: 10000, speed: 4, cooldown: 25000, icon: '🌀', id: 10, rarity: 'legendary' },
        'god': { name: '神グマ', cost: 500000, hp: 100000, attack: 50000, speed: 1, cooldown: 30000, icon: '⚡', id: 11, rarity: 'legendary' },
        'infinity': { name: '無限グマ', cost: 2500000, hp: 500000, attack: 100000, speed: 5, cooldown: 40000, icon: '♾️', id: 12, rarity: 'legendary' },
        'fire': { name: '炎グマ', cost: 750, hp: 400, attack: 120, speed: 3, cooldown: 2500, icon: '🔥', id: 13, rarity: 'rare', abilities: { strongVs: ['red'] } },
        'ice': { name: '氷グマ', cost: 750, hp: 600, attack: 80, speed: 1.5, cooldown: 2500, icon: '🧊', id: 14, rarity: 'rare', abilities: { freeze: 0.2 } },
        'thunder': { name: '雷グマ', cost: 1250, hp: 500, attack: 150, speed: 5, cooldown: 3000, icon: '⚡', id: 15, rarity: 'rare', abilities: { slow: 0.4 } },
        'knight': { name: '騎士グマ', cost: 1500, hp: 1500, attack: 100, speed: 1, cooldown: 3500, icon: '🛡️', id: 16, rarity: 'rare', abilities: { tank: true } },
        'king': { name: '王様グマ', cost: 10000, hp: 5000, attack: 800, speed: 1.2, cooldown: 10000, icon: '👑', id: 17, rarity: 'epic', abilities: {} },
        'angel': { name: '天使グマ', cost: 3000, hp: 800, attack: 200, speed: 2, cooldown: 4000, icon: '👼', id: 18, rarity: 'rare', abilities: { strongVs: ['black'] } },
        'devil': { name: '悪魔グマ', cost: 4000, hp: 1200, attack: 400, speed: 3, cooldown: 4500, icon: '😈', id: 19, rarity: 'rare', abilities: {} },
        'robot': { name: 'ロボグマ', cost: 6000, hp: 4000, attack: 300, speed: 0.5, cooldown: 8000, icon: '🦾', id: 20, rarity: 'epic', abilities: { toughVs: ['metal'] } },
        'samurai': { name: '侍グマ', cost: 8000, hp: 2000, attack: 1000, speed: 4, cooldown: 5000, icon: '⚔️', id: 21, rarity: 'epic', abilities: { critical: 0.15 } },
        'craft': { name: '攻撃クラフト', cost: 12000, hp: 3000, attack: 1500, speed: 5, cooldown: 6000, icon: '✈️', id: 22, rarity: 'epic', abilities: { massiveVs: ['floating'] } },
        'dragon': { name: 'ドラゴングマ', cost: 15000, hp: 8000, attack: 2000, speed: 2, cooldown: 12000, icon: '🐉', id: 23, rarity: 'epic', abilities: { strongVs: ['red', 'black'] } },
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
        // Battle Cats Parody Units (Bear Mark)
        'neko_kuma': { name: 'ネコグマ', cost: 75, hp: 100, attack: 20, speed: 3, cooldown: 500, icon: '🐱', id: 201, rarity: 'rare', kb: 3 },
        'tank_kuma': { name: 'タンクネコグマ', cost: 150, hp: 400, attack: 5, speed: 1.5, cooldown: 500, icon: '🐱', id: 202, rarity: 'rare', kb: 1 },
        'battle_kuma': { name: 'バトルネコグマ', cost: 300, hp: 200, attack: 80, speed: 3, cooldown: 600, icon: '🐱', id: 203, rarity: 'rare', kb: 3 },
        'kimokawa_kuma': { name: 'キモネコグマ', cost: 400, hp: 250, attack: 250, speed: 2, cooldown: 800, icon: '🦵', id: 204, rarity: 'rare' },
        'ushi_kuma': { name: 'ウシネコグマ', cost: 500, hp: 300, attack: 50, speed: 10, cooldown: 400, icon: '🐮', id: 205, rarity: 'rare' },
        'tori_kuma': { name: 'トリネコグマ', cost: 550, hp: 150, attack: 200, speed: 3, cooldown: 600, icon: '🐦', id: 206, rarity: 'rare' },
        'sakana_kuma': { name: 'サカナネコグマ', cost: 800, hp: 500, attack: 250, speed: 3, cooldown: 900, icon: '🐟', id: 207, rarity: 'rare', abilities: { strongVs: ['red'] } },
        'tokage_kuma': { name: 'トカゲネコグマ', cost: 1000, hp: 400, attack: 600, speed: 2, cooldown: 1200, icon: '🦎', id: 208, rarity: 'rare', abilities: {} },
        'kyojin_kuma': { name: '巨神ネコグマ', cost: 1300, hp: 2000, attack: 1000, speed: 1.5, cooldown: 1500, icon: '👹', id: 209, rarity: 'rare', abilities: { kbChance: 0.3 } },
        // Weak but High HP (Meatshields)
        'tofu_kuma': { name: '豆腐グマ', cost: 10, hp: 2000, attack: 1, speed: 1, cooldown: 200, icon: '⬜', id: 301, rarity: 'common', abilities: {} },
        'jelly_kuma': { name: 'ゼリーグマ', cost: 20, hp: 1500, attack: 2, speed: 2, cooldown: 250, icon: '🍮', id: 302, rarity: 'common', abilities: {} },
        'paper_kuma': { name: '紙グマ', cost: 5, hp: 500, attack: 1, speed: 3, cooldown: 100, icon: '📄', id: 303, rarity: 'common', abilities: {} },

        // --- Enemy Only Units (Traits) ---
        'red_bear': { name: '赤グマ', hp: 800, attack: 50, speed: 2, icon: '👺', traits: ['red'] },
        'black_bear': { name: '黒グマ', hp: 400, attack: 300, speed: 6, icon: '🕶️', traits: ['black'] },
        'float_bear': { name: '浮遊グマ', hp: 600, attack: 80, speed: 3, icon: '🚁', traits: ['floating'] },
        'metal_bear': { name: 'メタルグマ敵', hp: 30, attack: 50, speed: 2, icon: '⚙️', traits: ['metal'] }, // Low HP but hard to kill
        'angel_bear': { name: '天使グマ敵', hp: 1000, attack: 100, speed: 2, icon: '👼', traits: ['angel'] },
        'alien_bear': { name: 'エイリアングマ敵', hp: 1500, attack: 200, speed: 2, icon: '👽', traits: ['alien'] },
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
        maxStageCleared: 0, // Track progression
        // New Power Up Levels (Default 1)
        baseHpLevel: 1,
        workerRateLevel: 1,
        cannonPowerLevel: 1,
        walletLevel: 1,
        researchLevel: 1,
        accountingLevel: 1,
        rareOrbs: 0, // Item for leveling up any unit
        catFood: 0, // Premium Currency
        treasures: {} // Stage ID -> Level (0:None, 1:Bronze, 2:Silver, 3:Gold)
    };

    // Treasure Sets Configuration
    const TREASURE_SETS = [
        { name: '甲信越の宝石', stages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], effect: 'worker', desc: '働きネコの効率アップ' },
        { name: '中国・四国', stages: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], effect: 'wallet', desc: 'お財布の容量アップ' },
        { name: '九州・沖縄', stages: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], effect: 'unit_attack', desc: 'キャラの攻撃力アップ' },
        { name: '北海道・東北', stages: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], effect: 'unit_hp', desc: 'キャラの体力アップ' },
        { name: '関東・東海', stages: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50], effect: 'cannon', desc: 'にゃんこ砲攻撃力アップ' },
        { name: '未来編 1章', stages: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60], effect: 'exp', desc: 'クリア経験値(コイン)アップ' },
        { name: '未来編 2章', stages: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70], effect: 'energy', desc: '統率力(未実装)アップ' },
        { name: '未来編 3章', stages: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80], effect: 'cooldown', desc: '生産スピードアップ' },
        { name: '宇宙編', stages: [81, 82, 83, 84, 85, 86, 87, 88, 89, 90], effect: 'all', desc: '全能力超アップ' },
        { name: 'レジェンド', stages: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100], effect: 'special', desc: '謎の力' }
    ];

    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with default to handle new fields
                playerData = { ...playerData, ...parsed };

                // Backwards compatibility defaults
                if (!playerData.unitLevels) {
                    playerData.unitLevels = {};
                    playerData.unlockedUnits.forEach(u => playerData.unitLevels[u] = 1);
                }
                if (playerData.normalTickets === undefined) playerData.normalTickets = 5;
                if (playerData.rareTickets === undefined) playerData.rareTickets = 1;

                // Power Ups
                if (!playerData.baseHpLevel) playerData.baseHpLevel = 1;
                if (!playerData.workerRateLevel) playerData.workerRateLevel = 1;
                if (!playerData.cannonPowerLevel) playerData.cannonPowerLevel = 1;
                if (!playerData.walletLevel) playerData.walletLevel = 1;
                if (!playerData.researchLevel) playerData.researchLevel = 1;
                if (!playerData.accountingLevel) playerData.accountingLevel = 1;
                if (playerData.rareOrbs === undefined) playerData.rareOrbs = 0;
                if (playerData.catFood === undefined) playerData.catFood = 0;
                if (!playerData.treasures) playerData.treasures = {};

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

        const orbEl = document.getElementById('player-orbs');
        if (orbEl) orbEl.textContent = playerData.rareOrbs;

        const catFoodEl = document.getElementById('player-cat-food');
        if (catFoodEl) catFoodEl.textContent = playerData.catFood;

        // User Rank Calculation
        let rank = 0;
        if (playerData.unitLevels) {
            Object.values(playerData.unitLevels).forEach(lvl => rank += lvl);
        }
        // Also add power up levels
        rank += (playerData.baseHpLevel || 1);
        rank += (playerData.workerRateLevel || 1);
        rank += (playerData.cannonPowerLevel || 1);
        rank += (playerData.walletLevel || 1);
        rank += (playerData.researchLevel || 1);
        rank += (playerData.accountingLevel || 1);

        const rankEl = document.getElementById('user-rank');
        if (rankEl) rankEl.textContent = rank;
    }

    // --- Treasure Bonus Logic ---
    function getTreasureMultiplier(effectType) {
        let totalBonus = 0;

        TREASURE_SETS.forEach(set => {
            if (set.effect === effectType || set.effect === 'all') {
                let collectedScore = 0;
                let maxScore = set.stages.length * 3; // 3 points per Gold

                set.stages.forEach(stId => {
                    collectedScore += (playerData.treasures[stId] || 0);
                });

                // Each set gives max 100% bonus (multiplier +1.0) if fully Gold
                // So (30 / 30) * 1.0 = +100%
                if (maxScore > 0) {
                    totalBonus += (collectedScore / maxScore);
                }
            }
        });

        return 1 + totalBonus; // Base 100% + Bonus
    }

    // --- Screens ---
    const introScreen = document.getElementById('intro-screen');
    const mainMenuScreen = document.getElementById('main-menu-screen');
    const gachaScreen = document.getElementById('gacha-screen');
    const zukanScreen = document.getElementById('zukan-screen');
    const teamSelectScreen = document.getElementById('team-select-screen');
    const powerUpScreen = document.getElementById('powerup-screen');
    const treasureScreen = document.getElementById('treasure-screen');
    const exchangeScreen = document.getElementById('exchange-screen');
    const globalHeader = document.getElementById('global-header');

    // --- Event Listeners ---

    // Intro Skip
    if (introScreen) {
        introScreen.addEventListener('click', () => {
            introScreen.style.display = 'none';
            mainMenuScreen.style.display = 'flex';
        });

        // Auto skip after animation (approx)
        setTimeout(() => {
            if (introScreen.style.display !== 'none') {
                introScreen.style.display = 'none';
                mainMenuScreen.style.display = 'flex';
            }
        }, 20000);
    }

    // Main Menu Navigation
    document.getElementById('menu-start-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        stageSelectScreen.style.display = 'flex';
    });

    document.getElementById('menu-exchange-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        exchangeScreen.style.display = 'flex';
    });

    document.getElementById('back-to-menu-from-exchange-btn').addEventListener('click', () => {
        exchangeScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    // Exchange Logic
    document.getElementById('ex-normal-btn').addEventListener('click', () => {
        if (playerData.normalTickets >= 1) {
            if (confirm("通常チケット1枚を 10,000 XP に交換しますか？")) {
                playerData.normalTickets--;
                playerData.coins += 10000;
                saveData();
                alert("交換しました！");
            }
        } else {
            alert("チケットが足りません！");
        }
    });

    document.getElementById('ex-rare-btn').addEventListener('click', () => {
        if (playerData.rareTickets >= 1) {
            if (confirm("レアチケット1枚を 50,000 XP に交換しますか？")) {
                playerData.rareTickets--;
                playerData.coins += 50000;
                saveData();
                alert("交換しました！");
            }
        } else {
            alert("チケットが足りません！");
        }
    });

    document.getElementById('ex-orb-btn').addEventListener('click', () => {
        if (playerData.rareOrbs >= 1) {
            if (confirm("レア玉1個を 100,000 XP に交換しますか？")) {
                playerData.rareOrbs--;
                playerData.coins += 100000;
                saveData();
                alert("交換しました！");
            }
        } else {
            alert("レア玉が足りません！");
        }
    });

    document.getElementById('menu-powerup-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        powerUpScreen.style.display = 'flex';
        renderPowerUps();
    });

    document.getElementById('menu-treasure-btn').addEventListener('click', () => {
        mainMenuScreen.style.display = 'none';
        treasureScreen.style.display = 'flex';
        renderTreasures();
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

    document.getElementById('back-to-menu-from-powerup-btn').addEventListener('click', () => {
        powerUpScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    document.getElementById('back-to-menu-from-treasure-btn').addEventListener('click', () => {
        treasureScreen.style.display = 'none';
        mainMenuScreen.style.display = 'flex';
    });

    // Treasure Render Logic
    function renderTreasures() {
        const container = document.getElementById('treasure-list');
        container.innerHTML = '';

        TREASURE_SETS.forEach(set => {
            let collectedScore = 0;
            let maxScore = set.stages.length * 3;
            let collectedCount = 0;

            const iconsDiv = document.createElement('div');
            iconsDiv.className = 'treasure-icons';

            set.stages.forEach(stId => {
                const level = playerData.treasures[stId] || 0;
                collectedScore += level;
                if (level > 0) collectedCount++;

                const icon = document.createElement('div');
                icon.className = 'treasure-icon';
                if (level === 3) { icon.classList.add('gold'); icon.textContent = '🏆'; }
                else if (level === 2) { icon.classList.add('silver'); icon.textContent = '🥈'; }
                else if (level === 1) { icon.classList.add('bronze'); icon.textContent = '🥉'; }
                else { icon.textContent = '?'; }
                iconsDiv.appendChild(icon);
            });

            const rate = Math.floor((collectedScore / maxScore) * 100);

            const setDiv = document.createElement('div');
            setDiv.className = 'treasure-set';
            setDiv.innerHTML = `
                <div class="treasure-set-header">
                    <div class="treasure-set-name">${set.name}</div>
                    <div class="treasure-set-rate">発動率: ${rate}%</div>
                </div>
                <div class="treasure-set-desc">${set.desc}</div>
            `;
            setDiv.appendChild(iconsDiv);
            container.appendChild(setDiv);
        });
    }

    // Power Up Screen Logic
    function renderPowerUps() {
        const list = document.getElementById('powerup-list');
        list.innerHTML = '';

        const upgrades = [
            { id: 'baseHp', name: 'お城の体力 (Base HP)', level: playerData.baseHpLevel, desc: '+1000 HP / Lv' },
            { id: 'workerRate', name: '働きネコ効率 (Income Speed)', level: playerData.workerRateLevel, desc: '+10% Speed / Lv' },
            { id: 'cannonPower', name: 'くまじゅう攻撃力 (Cannon Atk)', level: playerData.cannonPowerLevel, desc: '+500 Atk / Lv' },
            { id: 'wallet', name: '働きネコお財布 (Wallet Cap)', level: playerData.walletLevel, desc: '+500 Max Money / Lv' },
            { id: 'research', name: '研究力 (Research)', level: playerData.researchLevel, desc: 'Cooldown -5% / Lv' },
            { id: 'accounting', name: '会計力 (Accounting)', level: playerData.accountingLevel, desc: 'Enemy Kill Bonus +20% / Lv' }
        ];

        upgrades.forEach(up => {
            const item = document.createElement('div');
            item.className = 'powerup-item';

            const cost = up.level * 2000;

            item.innerHTML = `
                <div class="powerup-icon">💪</div>
                <div class="powerup-info">
                    <div class="powerup-name">${up.name} Lv.${up.level}</div>
                    <div class="powerup-desc">${up.desc}</div>
                </div>
                <button class="powerup-buy-btn" data-id="${up.id}" data-cost="${cost}">
                    UP<br>¥${cost}
                </button>
            `;

            list.appendChild(item);
        });

        // Add Event Listeners
        document.querySelectorAll('.powerup-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const cost = parseInt(btn.getAttribute('data-cost'));

                if (playerData.coins >= cost) {
                    if (confirm(`${cost}コインでレベルアップしますか？`)) {
                        playerData.coins -= cost;

                        // Update Data
                        if (id === 'baseHp') playerData.baseHpLevel++;
                        else if (id === 'workerRate') playerData.workerRateLevel++;
                        else if (id === 'cannonPower') playerData.cannonPowerLevel++;
                        else if (id === 'wallet') playerData.walletLevel++;
                        else if (id === 'research') playerData.researchLevel++;
                        else if (id === 'accounting') playerData.accountingLevel++;

                        saveData();
                        updateGlobalCoinsUI();
                        renderPowerUps(); // Re-render to update level/cost
                    }
                } else {
                    alert("コインが足りません！");
                }
            });
        });
    }

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
        // Animation Start
        const capsuleContainer = document.getElementById('gacha-capsule-container');
        const capsule = document.getElementById('gacha-capsule');

        // Reset Visuals
        document.getElementById('gacha-result').textContent = '?';
        document.getElementById('gacha-message').textContent = 'ガチャ中...';
        document.querySelector('.gacha-controls').style.display = 'none'; // Hide buttons

        capsuleContainer.style.display = 'flex';
        // Reset Animation hack
        capsule.style.animation = 'none';
        capsule.offsetHeight; /* trigger reflow */
        capsule.style.animation = null;

        // Wait for animation (2s total: 1s roll, 1s shake/open)
        setTimeout(() => {
            capsuleContainer.style.display = 'none';
            document.querySelector('.gacha-controls').style.display = 'flex';

            // Logic
            finalizeGacha(poolType);
        }, 2200);
    }

    function finalizeGacha(poolType) {
        // Rare Orb Chance
        let orbChance = 0.01; // 1% for Normal
        if (poolType === 'rare') orbChance = 0.10; // 10% for Rare

        if (Math.random() < orbChance) {
            // Drop Orb
            playerData.rareOrbs++;
            document.getElementById('gacha-result').textContent = '🔮';
            document.getElementById('gacha-message').textContent = `レア玉ゲット！ (Rare Orb!) どのキャラもレベルアップ可能！`;
            saveData();
            return;
        }

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

        // XP Value calculation (approx)
        const sellValue = unit.rarity === 'legendary' ? 1000000 :
                          unit.rarity === 'epic' ? 200000 :
                          unit.rarity === 'rare' ? 50000 : 10000;

        if (!playerData.unlockedUnits.includes(randomKey)) {
            playerData.unlockedUnits.push(randomKey);
            playerData.unitLevels[randomKey] = 1;
            document.getElementById('gacha-message').textContent = `NEW! ${unit.name} をゲット！ (Lv.1)`;
        } else {
            // Duplicate
            // Ask User: Use (Level Up) or Exchange (XP)?
            // Since `confirm` is blocking, we use it.
            // But we already showed the result.
            // In a real app, this would be a modal. For now, simple logic:

            // Auto level up default, but maybe toggle?
            // User requested "Change into money".
            // Let's assume automatic level up is still "Standard" unless we add a setting.
            // BUT, let's add a prompt for Duplicates if it's Rare or higher?
            // To keep it simple and consistent with "More Battle Cats", let's just Stick to Level Up + Exchange System (manual selling of tickets).
            // However, showing the "XP Value" is nice info.

            if (!playerData.unitLevels[randomKey]) playerData.unitLevels[randomKey] = 1;
            playerData.unitLevels[randomKey]++;
            const newLevel = playerData.unitLevels[randomKey];
            document.getElementById('gacha-message').textContent = `${unit.name} かぶり！ レベルアップ！ (Lv.${newLevel})\n(売却価値: ${sellValue} XP)`;
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

    // --- Map System ---
    const mapContainer = document.getElementById('map-container');
    const stageListContainer = document.getElementById('stage-list-container');
    const stageListContent = document.getElementById('stage-list-content');
    const regionTitle = document.getElementById('region-title');
    const backToMapBtn = document.getElementById('back-to-map-btn');

    const REGIONS = [
        { id: 'kyushu', name: '九州・沖縄', stages: [1,2,3,4,5,6,7], cssClass: 'region-kyushu' }, // 7
        { id: 'shikoku', name: '四国', stages: [8,9,10,11], cssClass: 'region-shikoku' }, // 4
        { id: 'chugoku', name: '中国', stages: [12,13,14,15,16], cssClass: 'region-chugoku' }, // 5
        { id: 'kansai', name: '近畿', stages: [17,18,19,20,21,22,23], cssClass: 'region-kansai' }, // 7
        { id: 'chubu', name: '中部', stages: [24,25,26,27,28,29,30,31,32], cssClass: 'region-chubu' }, // 9
        { id: 'kanto', name: '関東', stages: [33,34,35,36,37,38,39], cssClass: 'region-kanto' }, // 7
        { id: 'tohoku', name: '東北', stages: [40,41,42,43,44,45], cssClass: 'region-tohoku' }, // 6
        { id: 'hokkaido', name: '北海道', stages: [46,47,48], cssClass: 'region-hokkaido' }, // 3
        // Special Regions
        { id: 'future', name: '未来編 (Future)', stages: [49,50,51,52,53,54,55,56,57,58,59,60], cssClass: 'region-future' },
        { id: 'legend', name: 'レジェンド (Legend)', stages: Array.from({length: 40}, (_, i) => i + 61), cssClass: 'region-legend' }
    ];

    function initMap() {
        mapContainer.innerHTML = '';
        REGIONS.forEach(region => {
            const el = document.createElement('div');
            el.className = `map-region ${region.cssClass}`;
            el.textContent = region.name;
            el.addEventListener('click', () => openRegion(region));
            mapContainer.appendChild(el);
        });
    }

    function openRegion(region) {
        mapContainer.style.display = 'none';
        stageListContainer.style.display = 'flex';
        regionTitle.textContent = region.name;
        renderStageList(region.stages);
    }

    function renderStageList(stageIds) {
        stageListContent.innerHTML = '';
        stageIds.forEach(stageId => {
            if (stageId > 100) return; // Cap at 100

            // Generate Stage Name
            let name = `ステージ ${stageId}`;
            // Simple lookup for predefined names if you have them, else generic
            // Reusing existing names logic would require a map, but we can just use generic + number

            const btn = document.createElement('button');
            btn.className = 'stage-btn';
            btn.textContent = name;
            btn.setAttribute('data-stage', stageId);

            // Locking Logic
            if (stageId > playerData.maxStageCleared + 1) {
                btn.disabled = true;
                btn.classList.add('locked');
                btn.textContent += ' (Locked)';
            }

            btn.addEventListener('click', () => {
                startGame(stageId, name);
            });

            stageListContent.appendChild(btn);
        });
    }

    backToMapBtn.addEventListener('click', () => {
        stageListContainer.style.display = 'none';
        mapContainer.style.display = 'flex';
    });

    backToSelectBtn.addEventListener('click', () => {
        stopGame();
        gameScreen.style.display = 'none';
        stageSelectScreen.style.display = 'flex';
        // Go back to map view by default?
        // Keep current state (stage list or map)
    });

    // Initialize Map on Load
    initMap();

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

        // Baby Boom Logic: Cost 0, No Cooldown
        let finalCost = cost;
        if (gameState.babyBoomActive) finalCost = 0;

        if (gameState.money >= finalCost && !gameState.gameOver && !btn.disabled) {
            gameState.money -= finalCost;
            spawnUnit(type, 'player');
            updateMoneyUI();

            // Check Baby Boom: If active, return immediately (no cooldown)
            if (gameState.babyBoomActive) return;

            // Calculate Cooldown with Research
            // Base cooldown reduced by 5% per research level
            let speedMult = 1 + ((playerData.researchLevel || 1) - 1) * 0.1;

            // Treasure Bonus
            speedMult *= getTreasureMultiplier('cooldown');

            const cooldownTime = UNIT_TYPES[type].cooldown / speedMult;

            // Simple cooldown visual (disable button temporarily)
            btn.disabled = true;

            // Visual Overlay Animation (Top Down reveal)
            const overlay = btn.querySelector('.cooldown-overlay');
            if (overlay) {
                // Set to full height (blocking)
                overlay.style.height = '100%';
                overlay.style.transition = 'none';

                // Force reflow
                overlay.offsetHeight;

                // Animate to 0 height (revealing)
                overlay.style.transition = `height ${cooldownTime}ms linear`;
                overlay.style.height = '0%';
            }

            setTimeout(() => {
                if (btn) {
                    btn.disabled = false;
                    if (overlay) overlay.style.transition = 'none'; // Reset
                }
            }, cooldownTime);
        }
    });

    // Zukan & Upgrade Render
    function renderZukan() {
        const grid = document.getElementById('zukan-grid');
        grid.innerHTML = '';

        // Add Upgrade Instructions
        const header = document.createElement('div');
        header.style.gridColumn = '1 / -1';
        header.style.textAlign = 'center';
        header.style.marginBottom = '10px';
        header.innerHTML = '<p>キャラをタップしてコインでレベルアップ！ (Tap to Upgrade)</p>';
        grid.appendChild(header);

        Object.keys(UNIT_TYPES).forEach(key => {
            const unit = UNIT_TYPES[key];
            const isUnlocked = playerData.unlockedUnits.includes(key);
            const level = playerData.unitLevels[key] || 1;

            const item = document.createElement('div');
            item.className = 'zukan-item';
            if (!isUnlocked) {
                item.classList.add('locked');
                item.innerHTML = `
                    <div class="zukan-icon">?</div>
                    <div class="zukan-name">???</div>
                `;
            } else {
                item.innerHTML = `
                    <div class="zukan-icon">${unit.icon}</div>
                    <div class="zukan-name">${unit.name}</div>
                    <div class="zukan-cost">Lv.${level}</div>
                `;
                // Add Click Event for Upgrade
                item.addEventListener('click', () => openUpgradeModal(key));
            }
            grid.appendChild(item);
        });
    }

    function openUpgradeModal(unitKey) {
        const unit = UNIT_TYPES[unitKey];
        const level = playerData.unitLevels[unitKey] || 1;
        const upgradeCost = Math.floor(unit.cost * level * 0.5) + 100;

        // Use custom modal logic with standard prompts for now,
        // but offering two choices is hard with just confirm().
        // We will prompt sequentially or check logic.

        // Let's use a simpler approach: Ask which method to use via prompt
        // or just use confirm for Coins, and if declined/failed, ask for Orb?
        // Better: Custom HTML modal would be ideal, but keeping it simple with Prompt loop.

        let choice = prompt(`
${unit.icon} ${unit.name} (Lv.${level})
HP: ${unit.hp + (level-1)*100} / ATK: ${unit.attack + (level-1)*100}

1. コインで強化 (Coins): ${upgradeCost} Coin
2. レア玉で強化 (Rare Orb): 1 Orb (持: ${playerData.rareOrbs})

番号を入力してください (Enter 1 or 2):
`);

        if (choice === '1') {
            if (playerData.coins >= upgradeCost) {
                playerData.coins -= upgradeCost;
                playerData.unitLevels[unitKey]++;
                saveData();
                renderZukan();
                updateGlobalCoinsUI();
                alert(`コインを使ってレベルアップ！ Lv.${playerData.unitLevels[unitKey]}`);
            } else {
                alert("コインが足りません！");
            }
        } else if (choice === '2') {
            if (playerData.rareOrbs >= 1) {
                playerData.rareOrbs--;
                playerData.unitLevels[unitKey]++;
                saveData();
                renderZukan();
                updateGlobalCoinsUI();
                alert(`レア玉を使ってレベルアップ！ Lv.${playerData.unitLevels[unitKey]}`);
            } else {
                alert("レア玉が足りません！");
            }
        }
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
        enemySpawnTimer: 0,
        babyBoomActive: false,
        speedUp: false,
        sniper: false,
        sniperLastShot: 0
    };

    function startGame(stageId, stageName) {
        // Reset State
        const hpMult = getTreasureMultiplier('unit_hp');
        const baseHp = (1000 + ((playerData.baseHpLevel - 1) * 1000)) * hpMult;

        const walletMult = getTreasureMultiplier('wallet');
        const baseMaxMoney = (1000 + ((playerData.walletLevel - 1) * 500)) * walletMult;

        gameState = {
            money: 0,
            maxMoney: baseMaxMoney,
            workerLevel: 1,
            cannonCharge: 0,
            stage: stageId,
            units: [],
            playerBaseHp: baseHp,
            enemyBaseHp: 1000 * Math.pow(1.2, stageId),
            lastMoneyUpdate: Date.now(),
            gameOver: false,
            startTime: Date.now(),
            enemySpawnTimer: Date.now(),
            babyBoomActive: false,
            speedUp: false,
            sniper: false,
            sniperLastShot: 0
        };

        updateSystemButtons();
        updateItemButtons();
        setGameSpeed(false); // Reset speed

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

        // Ensure 10 slots (Battle Cats has fixed slots, blank if empty)
        for (let i = 0; i < 10; i++) {
            if (i < deck.length) {
                const key = deck[i];
                const unit = UNIT_TYPES[key];
                const btn = document.createElement('button');
                btn.className = 'summon-btn';
                btn.setAttribute('data-cost', unit.cost);
                btn.setAttribute('data-type', key);

                // HTML Structure for New UI
                btn.innerHTML = `
                    <div class="cooldown-overlay"></div>
                    <div class="btn-icon">${unit.icon}</div>
                    <div class="btn-cost">${unit.cost}円</div>
                `;
                controlsDiv.appendChild(btn);
            } else {
                // Empty Slot
                const empty = document.createElement('div');
                empty.className = 'summon-btn empty';
                empty.style.backgroundColor = '#5d4037';
                empty.style.borderColor = '#3e2723';
                controlsDiv.appendChild(empty);
            }
        }

        // Update UI
        stageSelectScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        if (globalHeader) globalHeader.style.display = 'none'; // Hide global header in battle
        backToSelectBtn.style.display = 'block'; // Show back button
        currentStageTitle.textContent = stageName;
        updateMoneyUI();
        updateBaseHpUI();

        // Battle Start Animation
        const startText = document.getElementById('battle-start-text');
        if (startText) {
            startText.classList.remove('animate-start');
            void startText.offsetWidth; // Trigger reflow
            startText.classList.add('animate-start');
        }

        // Start Loop
        if (gameLoopId) clearInterval(gameLoopId);
        gameLoopId = setInterval(gameLoop, FRAME_TIME);
    }

    function stopGame() {
        clearInterval(gameLoopId);
        if (globalHeader) globalHeader.style.display = 'flex'; // Show global header again
        backToSelectBtn.style.display = 'none'; // Hide back button
    }

    function gameLoop() {
        if (gameState.gameOver) return;

        const now = Date.now();

        // 1. Money Accumulation (Passive income)
        const workerMult = getTreasureMultiplier('worker');
        const incomeInterval = Math.max(5, 30 - ((playerData.workerRateLevel - 1) * 2));

        if (now - gameState.lastMoneyUpdate > incomeInterval) {
            // Base: 1000. Each level adds 500.
            let income = 1000 + (gameState.workerLevel - 1) * 500 + (gameState.stage * 100);
            income *= workerMult; // Treasure Bonus

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

        // 7. Sniper Logic
        if (gameState.sniper && now - gameState.sniperLastShot > 5000) {
            handleSniperShot(now);
        }

        // 8. Update Buttons State
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

            // --- Traited Enemy Invasions ---
            const stage = gameState.stage;
            const rand = Math.random();

            // Red Enemies (Early-Mid)
            if (stage >= 5 && stage <= 25 && rand < 0.3) enemyType = 'red_bear';

            // Floating Enemies (Mid)
            if (stage >= 15 && stage <= 35 && rand < 0.3) enemyType = 'float_bear';

            // Black Enemies (XP Stages/Mid-Late)
            if (stage >= 25 && stage <= 50 && rand < 0.25) enemyType = 'black_bear';

            // Metal Enemies (Special)
            if (stage >= 30 && rand < 0.15) enemyType = 'metal_bear';

            // Angel Enemies (Late)
            if (stage >= 40 && rand < 0.2) enemyType = 'angel_bear';

            // Alien Enemies (Future/End)
            if (stage >= 50 && rand < 0.25) enemyType = 'alien_bear';

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

            // Treasure Bonuses
            const hpMult = getTreasureMultiplier('unit_hp');
            const atkMult = getTreasureMultiplier('unit_attack');

            hp *= hpMult;
            attack *= atkMult;
        }

        // Scale Enemy Stats
        if (side === 'enemy') {
            // Stronger Enemies: Exponential Scaling
            // 1.15^Stage
            const multiplier = Math.pow(1.15, gameState.stage);
            hp *= multiplier;
            attack *= multiplier;
        } else if (side === 'player' && type === 'little') {
            // Player's Little Bear is overpowered (100 Billion) - Level bonus adds on top but is negligible
            hp = 100000000000;
            attack = 100000000000;
        }

        const kbCount = stats.kb || 3;

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
            // Knockback Logic
            kbThreshold: hp / kbCount,
            currentKbDamage: 0,
            isInvincible: false,
            // Visual
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
            if (unit.isInvincible) return; // Don't move if being knocked back
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
        if (unit.isFighting) {
            unit.element.classList.add('fighting');
        } else {
            unit.element.classList.remove('fighting');
        }
    }

    function triggerKnockback(unit) {
        if (unit.isInvincible) return;

        unit.isInvincible = true;
        unit.currentKbDamage = 0; // Reset threshold tracker

        // Push Back
        const pushDist = 100;
        if (unit.side === 'player') {
            unit.x -= pushDist;
            if (unit.x < PLAYER_BASE_X) unit.x = PLAYER_BASE_X;
        } else {
            unit.x += pushDist;
            if (unit.x > ENEMY_BASE_X) unit.x = ENEMY_BASE_X;
        }

        updateUnitPosition(unit);

        // Visual
        unit.element.classList.add('knockback');

        // Recovery
        setTimeout(() => {
            unit.isInvincible = false;
            if (unit.element) unit.element.classList.remove('knockback');
        }, 500); // 0.5s stun/invincibility
    }

    function resolveCombat() {
        // Reset fighting state
        gameState.units.forEach(u => u.isFighting = false);

        // Check Unit vs Unit
        for (let i = 0; i < gameState.units.length; i++) {
            const u1 = gameState.units[i];

            // Skip if stunned
            if (u1.isInvincible) continue;

            // Check collision with opposing units
            for (let j = 0; j < gameState.units.length; j++) {
                if (i === j) continue;
                const u2 = gameState.units[j];

                if (u1.side !== u2.side && !u2.isInvincible) {
                    // Check distance
                    const dist = Math.abs(u1.x - u2.x);
                    if (dist < 40) { // Collision threshold
                        u1.isFighting = true;
                        // Attack
                        if (!u1.lastAttack || Date.now() - u1.lastAttack > 1000) {
                            // --- Combat Logic with Traits & Abilities ---
                            let damage = u1.attack;
                            const u1Stats = UNIT_TYPES[u1.type];
                            const u2Stats = UNIT_TYPES[u2.type];
                            const abilities = u1Stats.abilities || {};
                            const traits = u2Stats.traits || [];

                            let isCritical = false;

                            // Check Traits
                            if (traits.length > 0) {
                                // Strong Vs
                                if (abilities.strongVs && traits.some(t => abilities.strongVs.includes(t))) {
                                    damage *= 1.5;
                                }
                                // Massive Damage
                                if (abilities.massiveVs && traits.some(t => abilities.massiveVs.includes(t))) {
                                    damage *= 3;
                                }
                                // Tough Vs (Defense) - Handled when u2 attacks u1, but here u1 attacks u2.
                                // If u2 has toughVs u1's trait... but u1 has no trait yet (Player units don't typically have color traits in Battle Cats, enemies do).
                                // Assuming Player units attack Enemy units with traits.
                            }

                            // Critical
                            if (abilities.critical) {
                                if (Math.random() < abilities.critical) {
                                    damage *= 2;
                                    isCritical = true;
                                }
                            }

                            // Metal Trait Logic (Takes 1 damage unless Critical)
                            if (traits.includes('metal')) {
                                if (isCritical) {
                                    // Critical on Metal: Massive damage or just raw damage ignoring 1 limit?
                                    // Battle Cats: Crit deals full damage (x2) to metal. Non-crit deals 1.
                                    // damage is already x2.
                                } else {
                                    damage = 1;
                                }
                            }

                            // Apply Damage
                            u2.hp -= damage;
                            u2.currentKbDamage += damage;

                            u1.lastAttack = Date.now();

                            // Attack Animation
                            if (u1.element) {
                                u1.element.classList.add('attacking');
                                setTimeout(() => {
                                    if (u1.element) u1.element.classList.remove('attacking');
                                }, 300);
                            }

                            // Visuals
                            spawnParticles(u2.x, 20 + 20, isCritical ? 'blood' : 'dust', 5); // Realistic Hit FX

                            if (isCritical) {
                                visualizeCritical(u2);
                            } else {
                                visualizeDamage(u2);
                            }

                            // Check Knockback
                            if (u2.currentKbDamage >= u2.kbThreshold) {
                                triggerKnockback(u2);
                            }

                            // Ability Procs (Freeze, Slow, KB)
                            if (traits.length > 0) { // Most effects target traits
                                // KB Proc
                                if (abilities.kbChance && traits.some(t => abilities.strongVs?.includes(t) || abilities.massiveVs?.includes(t) || true)) { // Usually specific to trait, but simplified here to all or based on logic
                                    // Simplify: If unit has kbChance, it applies generally or to counters.
                                    // Let's say generic for now unless restricted.
                                    if (Math.random() < abilities.kbChance) {
                                        triggerKnockback(u2);
                                    }
                                }
                                // Slow/Freeze could be added here (modifying speed/isInvincible)
                            }

                            // Fire Effect for Little Bear
                            if (u1.type === 'little') {
                                createFireEffect(u2.x, 20 + 25);
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
        // 1. Accounting Bonus (Money on Kill)
        if (unit.side === 'enemy') {
            const baseReward = 50;
            const multiplier = 1 + ((playerData.accountingLevel - 1) * 0.2);
            const reward = Math.floor(baseReward * multiplier);

            // Add directly to money, respecting cap
            if (gameState.money < gameState.maxMoney) {
                gameState.money += reward;
                if (gameState.money > gameState.maxMoney) gameState.money = gameState.maxMoney;
                updateMoneyUI();
            }
        }

        // 2. Deal 100 Damage to nearby enemies (Death Blast)
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

        // 3. Visuals - Become Angel
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

        const resultOverlay = document.getElementById('result-overlay');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultOkBtn = document.getElementById('result-ok-btn');

        let message = "";

        if (isWin) {
            resultTitle.textContent = "完全勝利 (Victory!)";
            resultTitle.style.color = "gold";

            // Award Coins
            let rewardCoins = 1000 * gameState.stage;

            // Treasure XP Bonus
            rewardCoins *= getTreasureMultiplier('exp');
            rewardCoins = Math.floor(rewardCoins);

            playerData.coins += rewardCoins;

            // Award Tickets
            let rewardMsg = `${rewardCoins} コイン獲得！`;

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

            // Small chance to find Cat Food
            if (Math.random() < 0.3) {
                playerData.catFood += 2;
                rewardMsg += `\nネコ缶 x2 GET!`;
            }

            // Treasure Drop Logic
            const treasureRoll = Math.random();
            let treasureLevel = 0;
            let treasureName = '';

            // Chances: Gold 10%, Silver 20%, Bronze 30% -> Total 60% drop?
            if (treasureRoll < 0.15) { treasureLevel = 3; treasureName = '最高のお宝 (Gold)'; }
            else if (treasureRoll < 0.40) { treasureLevel = 2; treasureName = '普通のお宝 (Silver)'; }
            else if (treasureRoll < 0.70) { treasureLevel = 1; treasureName = '粗悪なお宝 (Bronze)'; }

            if (treasureLevel > 0) {
                const currentT = playerData.treasures[gameState.stage] || 0;
                if (treasureLevel > currentT) {
                    playerData.treasures[gameState.stage] = treasureLevel;
                    rewardMsg += `\n✨ ${treasureName} を発見！！`;
                } else {
                    rewardMsg += `\n(お宝発見...でも持ってるやつより質が低い)`;
                }
            }

            saveData();
            updateStageButtons();
            message = rewardMsg;

        } else {
            resultTitle.textContent = "敗北... (Defeat)";
            resultTitle.style.color = "#ff4444";
            message = "力が足りない... 出直そう。";
        }

        resultMessage.textContent = message;
        resultOverlay.style.display = 'flex';

        // One-time listener for closing
        resultOkBtn.onclick = () => {
            resultOverlay.style.display = 'none';
            gameScreen.style.display = 'none';
            stageSelectScreen.style.display = 'flex';
        };
    }

    // Initialize
    loadData();

    // --- UI Updates ---

    function updateStageButtons() {
        // Since stage buttons are dynamically rendered in the region list,
        // we can just re-render the current list if visible, or do nothing.
        // The locking logic is handled in renderStageList.
        // However, if we finish a stage and return to the list, we want to update it.
        if (stageListContainer.style.display === 'flex') {
            // Find which region is open?
            // Simplified: Just re-click the region?
            // Actually, we can just leave it. The next time renderStageList is called it updates.
            // But immediate update:
            const buttons = document.querySelectorAll('#stage-list-content .stage-btn');
            buttons.forEach(btn => {
                const stage = parseInt(btn.getAttribute('data-stage'));
                if (stage > playerData.maxStageCleared + 1) {
                    btn.disabled = true;
                    btn.classList.add('locked');
                } else {
                    btn.disabled = false;
                    btn.classList.remove('locked');
                    // Remove "Locked" text if present
                    if (btn.textContent.includes('(Locked)')) {
                        btn.textContent = btn.textContent.replace(' (Locked)', '');
                    }
                }
            });
        }
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
            let cannonDmg = 500 + ((playerData.cannonPowerLevel - 1) * 500);

            // Treasure
            cannonDmg *= getTreasureMultiplier('cannon');

            gameState.units.forEach(unit => {
                if (unit.side === 'enemy') {
                    unit.hp -= cannonDmg; // Base damage
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
        // Flash red
        unit.element.style.filter = 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)';
        setTimeout(() => {
            if (unit.element) unit.element.style.filter = 'none';
        }, 200);
    }

    function visualizeCritical(unit) {
        // Flash yellow/bright
        unit.element.style.filter = 'brightness(2) sepia(1) hue-rotate(50deg) saturate(5)';

        // Floating Text
        const critText = document.createElement('div');
        critText.className = 'critical-hit';
        critText.textContent = 'CRITICAL!';
        critText.style.left = unit.x + 'px';
        critText.style.bottom = '100px';
        lane.appendChild(critText);

        setTimeout(() => {
            if (unit.element) unit.element.style.filter = 'none';
            critText.remove();
        }, 500);
    }

    function visualizeBaseDamage(side) {
        const base = document.getElementById(side + '-base');
        const container = document.getElementById('game-container');

        // Shake Screen on Base Hit
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);

        base.style.transform = side === 'enemy' ? 'scaleX(-1) scale(1.1)' : 'scale(1.1)';
        setTimeout(() => {
            base.style.transform = side === 'enemy' ? 'scaleX(-1)' : 'scale(1)';
        }, 100);

        // Particles
        const x = side === 'player' ? 50 : 750;
        spawnParticles(x, 100, 'dust', 10);
    }

    function spawnParticles(x, y, type, count) {
        for(let i=0; i<count; i++) {
            const p = document.createElement('div');
            p.className = `particle ${type}`;
            p.style.left = x + 'px';
            p.style.bottom = y + 'px';

            // Random Velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            document.getElementById('lane').appendChild(p); // Add to lane to move with parallax if implemented, or just lane coordinate system

            // Animate
            let life = 1.0;
            let currentX = x;
            let currentY = y;
            let currentVy = vy;

            const animateParticle = () => {
                life -= 0.05;
                if (life <= 0) {
                    p.remove();
                    return;
                }

                currentX += vx;
                currentY += currentVy;
                currentVy -= 0.5; // Gravity

                // Floor collision (lane bottom is 0 relative to bottom)
                if (currentY < 0) currentY = 0;

                p.style.left = currentX + 'px';
                p.style.bottom = currentY + 'px';
                p.style.opacity = life;

                requestAnimationFrame(animateParticle);
            };
            requestAnimationFrame(animateParticle);
        }
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

    function handleSniperShot(now) {
        // Find closest enemy to player base
        let target = null;
        let minX = Infinity;

        gameState.units.forEach(u => {
            if (u.side === 'enemy' && !u.isInvincible && u.x < minX) {
                minX = u.x;
                target = u;
            }
        });

        if (target) {
            gameState.sniperLastShot = now;

            // Damage and KB
            target.hp -= Math.max(100, target.maxHp * 0.05); // 5% HP or 100 dmg
            visualizeDamage(target);
            triggerKnockback(target);

            // Visual Effect (Target Mark)
            const mark = document.createElement('div');
            mark.className = 'sniper-mark';
            mark.textContent = '🎯';
            mark.style.left = target.x + 'px';
            mark.style.bottom = '80px';
            lane.appendChild(mark);

            setTimeout(() => mark.remove(), 500);
        }
    }

    // --- God System ---
    const godButton = document.getElementById('god-button');
    const godMenuOverlay = document.getElementById('god-menu-overlay');
    const closeGodMenuBtn = document.getElementById('close-god-menu-btn');

    if (godButton) {
        godButton.addEventListener('click', () => {
            godMenuOverlay.style.display = 'flex';
        });
    }

    if (closeGodMenuBtn) {
        closeGodMenuBtn.addEventListener('click', () => {
            godMenuOverlay.style.display = 'none';
        });
    }

    // Battle Items
    const speedBtn = document.getElementById('item-speed-btn');
    const sniperBtn = document.getElementById('item-sniper-btn');

    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            gameState.speedUp = !gameState.speedUp;
            updateItemButtons();
            setGameSpeed(gameState.speedUp);
        });
    }

    if (sniperBtn) {
        sniperBtn.addEventListener('click', () => {
            gameState.sniper = !gameState.sniper;
            updateItemButtons();
        });
    }

    function updateItemButtons() {
        if (gameState.speedUp) speedBtn.classList.add('active');
        else speedBtn.classList.remove('active');

        if (gameState.sniper) sniperBtn.classList.add('active');
        else sniperBtn.classList.remove('active');
    }

    function setGameSpeed(isFast) {
        if (gameLoopId) clearInterval(gameLoopId);
        const delay = isFast ? FRAME_TIME / 2 : FRAME_TIME;
        gameLoopId = setInterval(gameLoop, delay);
    }

    // God Abilities
    document.getElementById('god-thunder-btn').addEventListener('click', () => {
        useGodAbility('thunder', 20);
    });

    document.getElementById('god-babyboom-btn').addEventListener('click', () => {
        useGodAbility('babyboom', 50);
    });

    document.getElementById('god-heal-btn').addEventListener('click', () => {
        useGodAbility('heal', 10);
    });

    function useGodAbility(ability, cost) {
        // Debug: Allow using money instead of CatFood for testing if CatFood is 0
        // But for "Real" game logic, use CatFood.
        // Let's implement Cat Food check.

        if (playerData.catFood < cost) {
            alert("ネコ缶が足りません！ (Not enough Cat Food)");
            return;
        }

        if (confirm(`ネコ缶 ${cost}個を使いますか？`)) {
            playerData.catFood -= cost;
            saveData();
            godMenuOverlay.style.display = 'none';

            // Execute Effect
            if (ability === 'thunder') {
                // Damage all enemies significantly
                gameState.units.forEach(u => {
                    if (u.side === 'enemy') {
                        u.hp -= (u.maxHp * 0.5) + 10000; // 50% HP + 10000 Flat
                        visualizeDamage(u);
                        triggerKnockback(u);
                    }
                });
                alert("神の雷！ (God Thunder!)");
            } else if (ability === 'babyboom') {
                gameState.babyBoomActive = true;
                alert("ベビーラッシュ開始！ (Baby Boom Start!)");
                setTimeout(() => {
                    gameState.babyBoomActive = false;
                    alert("ベビーラッシュ終了 (Baby Boom End)");
                }, 10000); // 10 seconds
            } else if (ability === 'heal') {
                // Get Max HP
                const hpMult = getTreasureMultiplier('unit_hp');
                const maxBaseHp = (1000 + ((playerData.baseHpLevel - 1) * 1000)) * hpMult;
                gameState.playerBaseHp = maxBaseHp;
                updateBaseHpUI();
                alert("城が回復した！ (Base Healed!)");
            }
        }
    }

    // Expose for Debugging/Testing
    window.debugGame = {
        spawnUnit,
        get gameState() { return gameState; },
        playerData,
        UNIT_TYPES,
        useGodAbility,
        updateGlobalCoinsUI,
        visualizeBaseDamage,
        spawnParticles
    };
});
