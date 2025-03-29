// 建立注音符號與示例詞彙的對應關係
const zhuyinExamples = {
    'ㄅ': { word: '爸爸', image: 'images/baba.jpg' },
    'ㄆ': { word: '泡泡', image: 'images/paopao.jpg' },
    'ㄇ': { word: '媽媽', image: 'images/mama.jpg' },
    // ... 其他注音符號的對應關係
};

// 初始化音效
function initAudio() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const sound = button.getAttribute('data-sound');
        button.addEventListener('click', () => {
            playSound(sound);
            showExample(sound);
        });
    });
}

// 播放音效
function playSound(sound) {
    const audio = new Audio(`sounds/${sound}.mp3`);
    audio.play().catch(error => {
        console.log('播放失敗:', error);
    });
}

// 顯示示例圖片
function showExample(sound) {
    const imageDisplay = document.getElementById('image-display');
    const example = zhuyinExamples[sound];
    
    if (example) {
        imageDisplay.innerHTML = `
            <img src="${example.image}" alt="${example.word}" title="${example.word}">
        `;
    } else {
        imageDisplay.innerHTML = '';
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', initAudio); 