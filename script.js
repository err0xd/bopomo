// 建立注音符號與示例詞彙的對應關係
const zhuyinExamples = {
    'ㄅ': { word: '爸爸', image: 'images/baba.jpg' },
    'ㄆ': { word: '泡泡', image: 'images/paopao.jpg' },
    'ㄇ': { word: '媽媽', image: 'images/mama.jpg' },
    // ... 其他注音符號的對應關係
};

// 建立音效快取物件
const audioCache = {};

// 聲調符號列表
const toneMarks = ['ˇ', 'ˋ', 'ˊ', '˙'];

// 預載入音效
function preloadAudios() {
    return new Promise((resolve, reject) => {
        const buttons = document.querySelectorAll('button');
        let loadedCount = 0;
        let totalCount = 0;
        
        // 計算需要載入的音效總數（排除聲調符號）
        buttons.forEach(button => {
            const sound = button.getAttribute('data-sound');
            if (!toneMarks.includes(sound)) {
                totalCount++;
            }
        });

        if (totalCount === 0) {
            resolve();
            return;
        }
        
        buttons.forEach(button => {
            const sound = button.getAttribute('data-sound');
            // 跳過聲調符號的音效載入
            if (toneMarks.includes(sound)) {
                return;
            }

            const audio = new Audio(`sounds/${sound}.mp3`);
            audio.preload = 'auto';
            
            audio.oncanplaythrough = () => {
                loadedCount++;
                updateLoadingProgress(loadedCount, totalCount);
                
                if (loadedCount === totalCount) {
                    hideLoadingMessage();
                    resolve();
                }
            };
            
            audio.onerror = () => {
                console.error(`Failed to load audio: ${sound}`);
                loadedCount++;
                if (loadedCount === totalCount) {
                    hideLoadingMessage();
                    resolve();
                }
            };
            
            audioCache[sound] = audio;
        });
    });
}

function updateLoadingProgress(loaded, total) {
    const progress = Math.floor((loaded / total) * 100);
    // 更新載入進度顯示
    document.getElementById('loading-message').textContent = 
        `載入中... ${progress}%`;
}

function hideLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
}

// 修改播放音效函數
function playSound(sound) {
    // 如果是聲調符號，直接返回不播放音效
    if (toneMarks.includes(sound)) {
        return;
    }

    if (audioCache[sound]) {
        // 如果音效正在播放，重置到開始位置
        audioCache[sound].currentTime = 0;
        audioCache[sound].play().catch(error => {
            console.log('播放失敗:', error);
        });
    }
}

// 修改初始化函數
function initAudio() {
    // 先預載入所有音效
    preloadAudios().then(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const sound = button.getAttribute('data-sound');
            button.addEventListener('click', () => {
                playSound(sound);
                showExample(sound);
            });
        });
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
