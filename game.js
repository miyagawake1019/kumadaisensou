document.addEventListener('DOMContentLoaded', () => {
    const stageSelectScreen = document.getElementById('stage-select-screen');
    const gameScreen = document.getElementById('game-screen');
    const currentStageTitle = document.getElementById('current-stage-title');
    const backToSelectBtn = document.getElementById('back-to-select-btn');
    const stageButtons = document.querySelectorAll('.stage-btn');

    stageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stageId = btn.getAttribute('data-stage');
            const stageName = btn.textContent;
            startGame(stageId, stageName);
        });
    });

    backToSelectBtn.addEventListener('click', () => {
        returnToSelect();
    });

    function startGame(stageId, stageName) {
        stageSelectScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        currentStageTitle.textContent = stageName;
        console.log(`Starting Stage ${stageId}: ${stageName}`);
        // 将来的にここにゲームループ開始処理を入れる
    }

    function returnToSelect() {
        gameScreen.style.display = 'none';
        stageSelectScreen.style.display = 'flex';
        // 将来的にここにゲームループ停止処理を入れる
    }
});
