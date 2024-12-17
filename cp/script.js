document.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementById('loading');
    
    // 历史数据
    const rawHistoricalData = `
040613212225 00
010207152429 12
040708172226 15
151620222329 14
020711212728 02
040910192226 03
031115212526 13
051117183031 10
020413161821 03
011115273033 01
`;

    // 处理数据
    function processData(data) {
        const lines = data.trim().split('\n');
        const redFreq = new Array(33).fill(0);
        const blueFreq = new Array(16).fill(0);
        
        lines.forEach(line => {
            // 处理红球
            for (let i = 0; i < 12; i += 2) {
                const num = parseInt(line.substr(i, 2));
                redFreq[num - 1]++;
            }
            // 处理蓝球
            const blueNum = parseInt(line.substr(13, 2));
            blueFreq[blueNum - 1]++;
        });
        
        return { redFreq, blueFreq };
    }

    // 创建球
    function createBalls() {
        const redContainer = document.getElementById('redBalls');
        const blueContainer = document.getElementById('blueBalls');
        
        // 创建红球
        for (let i = 1; i <= 33; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball red-ball';
            ball.textContent = String(i).padStart(2, '0');
            redContainer.appendChild(ball);
        }
        
        // 创建蓝球
        for (let i = 1; i <= 16; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball blue-ball';
            ball.textContent = String(i).padStart(2, '0');
            blueContainer.appendChild(ball);
        }
    }

    // 处理球点击
    function handleBallClick(e) {
        if (!e.target.classList.contains('ball')) return;
        
        if (e.target.classList.contains('red-ball')) {
            const selected = document.querySelectorAll('.red-ball.selected');
            if (!e.target.classList.contains('selected') && selected.length >= 6) {
                alert('最多只能选择6个红球！');
                return;
            }
        } else {
            document.querySelectorAll('.blue-ball.selected')
                .forEach(ball => ball.classList.remove('selected'));
        }
        
        e.target.classList.toggle('selected');
        updateSelectedNumbers();
    }

    // 更新已选号码显示
    function updateSelectedNumbers() {
        const selectedRed = Array.from(document.querySelectorAll('.red-ball.selected'))
            .map(ball => ball.textContent)
            .sort()
            .join(', ');
            
        const selectedBlue = Array.from(document.querySelectorAll('.blue-ball.selected'))
            .map(ball => ball.textContent)
            .join(', ');
            
        document.getElementById('selectedRed').textContent = selectedRed || '未选择';
        document.getElementById('selectedBlue').textContent = selectedBlue || '未选择';
        
        // 更新主显示区
        updateMainDisplay();
    }

    // 机选号码
    function randomSelect(freq) {
        const { redFreq, blueFreq } = freq;
        
        // 清空当前选择
        document.querySelectorAll('.selected').forEach(ball => ball.classList.remove('selected'));
        
        // 选择红球
        const redBalls = document.querySelectorAll('.red-ball');
        const redIndexes = new Set();
        while (redIndexes.size < 6) {
            const idx = Math.floor(Math.random() * 33);
            if (redFreq[idx] > 0) redIndexes.add(idx);
        }
        redIndexes.forEach(idx => redBalls[idx].classList.add('selected'));
        
        // 选择蓝球
        const blueBalls = document.querySelectorAll('.blue-ball');
        const blueIdx = Math.floor(Math.random() * 16);
        blueBalls[blueIdx].classList.add('selected');
        
        updateSelectedNumbers();
    }

    // 初始化
    try {
        // 处理数据
        const freq = processData(rawHistoricalData);
        
        // 创建球
        createBalls();
        
        // 添加事件监听
        document.getElementById('redBalls').addEventListener('click', handleBallClick);
        document.getElementById('blueBalls').addEventListener('click', handleBallClick);
        document.getElementById('randomSelect').addEventListener('click', () => randomSelect(freq));
        document.getElementById('clearSelect').addEventListener('click', () => {
            document.querySelectorAll('.selected').forEach(ball => ball.classList.remove('selected'));
            updateSelectedNumbers();
        });
        
        // 隐藏加载提示
        loading.style.display = 'none';
        
    } catch (error) {
        console.error('初始化失败:', error);
        loading.querySelector('.loading-text').textContent = '加载失败，请刷新页面重试';
    }

    // 在已有代码中添加以下函数
    function updateMainDisplay() {
        const mainRedBalls = document.getElementById('mainRedBalls');
        const mainBlueBall = document.getElementById('mainBlueBall');
        
        // 清空现有显示
        mainRedBalls.innerHTML = '';
        mainBlueBall.innerHTML = '';
        
        // 获取选中的红球
        const selectedReds = Array.from(document.querySelectorAll('.red-ball.selected'))
            .map(ball => ball.textContent)
            .sort((a, b) => parseInt(a) - parseInt(b));
        
        // 获取选中的蓝球
        const selectedBlue = Array.from(document.querySelectorAll('.blue-ball.selected'))
            .map(ball => ball.textContent)[0];
        
        // 创建并显示红球
        selectedReds.forEach(num => {
            const ball = document.createElement('div');
            ball.className = 'main-ball main-red';
            ball.textContent = num;
            mainRedBalls.appendChild(ball);
        });
        
        // 创建并显示蓝球
        if (selectedBlue) {
            const ball = document.createElement('div');
            ball.className = 'main-ball main-blue';
            ball.textContent = selectedBlue;
            mainBlueBall.appendChild(ball);
        }
    }
});