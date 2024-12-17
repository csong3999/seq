// 数据处理Worker
self.addEventListener('message', function(e) {
    const { rawData } = e.data;
    
    // 处理历史数据
    const historicalData = processRawData(rawData);
    const analysis = analyzeHistoricalData(historicalData);
    
    // 发送处理结果回主线程
    self.postMessage({ analysis });
});

function processRawData(rawData) {
    return rawData.split('\n')
        .filter(line => line.trim())
        .map(line => ({
            red: line.slice(0, 12),
            blue: line.slice(13, 15)
        }));
}

function analyzeHistoricalData(historicalData) {
    const redBallFrequency = Object.fromEntries(
        Array.from({length: 33}, (_, i) => 
            [String(i + 1).padStart(2, '0'), 0]
        )
    );
    
    const blueBallFrequency = Object.fromEntries(
        Array.from({length: 16}, (_, i) => 
            [String(i + 1).padStart(2, '0'), 0]
        )
    );
    
    historicalData.forEach(record => {
        for (let i = 0; i < 12; i += 2) {
            redBallFrequency[record.red.substr(i, 2)]++;
        }
        blueBallFrequency[record.blue]++;
    });
    
    return { redBallFrequency, blueBallFrequency };
} 