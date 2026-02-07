// Web version - simplified main.js for browser testing
// This file provides fallback functionality when Electron APIs are not available

// Mock Electron IPC for web version
if (typeof require === 'undefined') {
    window.mockElectronAPI = {
        saveTestRecord: async (testData) => {
            console.log('Mock: Saving test record:', testData);
            // Store in localStorage for demo
            const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
            history.unshift({
                ...testData,
                id: Date.now(),
                date: testData.startTime.toISOString()
            });
            localStorage.setItem('testHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
            return { success: true, id: Date.now() };
        },
        
        getTestHistory: async () => {
            console.log('Mock: Loading test history');
            const stored = localStorage.getItem('testHistory');
            if (stored) {
                return JSON.parse(stored);
            }
            
            // Generate initial mock data
            const history = [];
            for (let i = 0; i < 10; i++) {
                history.push({
                    id: Date.now() - i * 86400000,
                    serialNumber: `MTR${String(1000 + i).padStart(4, '0')}`,
                    date: new Date(Date.now() - i * 86400000).toISOString(),
                    result: Math.random() > 0.2 ? 'PASS' : 'FAIL',
                    voltage: (220 + Math.random() * 20).toFixed(1),
                    current: (5 + Math.random() * 2).toFixed(2),
                    power: (1.1 + Math.random() * 0.3).toFixed(2),
                    frequency: (50 + Math.random() * 2).toFixed(1),
                    insulationPre: (500 + Math.random() * 100).toFixed(0),
                    insulationPost: (480 + Math.random() * 100).toFixed(0)
                });
            }
            localStorage.setItem('testHistory', JSON.stringify(history));
            return history;
        }
    };
}