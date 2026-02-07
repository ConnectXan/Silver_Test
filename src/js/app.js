// Application State
let currentUser = null;
let testInProgress = false;
let testData = {};
let testResults = []; // Store test results without dummy data
let masterData = []; // Store imported master data
let batchTestInProgress = false;
let statistics = {
    totalProduction: 0,
    beforeIR: { pass: 0, fail: 0 },
    noLoad: { pass: 0, fail: 0 },
    afterIR: { pass: 0, fail: 0 }
};

// Status indicators state
let statusStates = {
    megger: true,
    startButton: true,
    emergency: true,
    vfd: true,
    vfdEmergency: true
    
};

// Demo test settings
let demoTestType = 'pass'; // 'pass' or 'fail'

// Test settings
let testSettings = {
    irTestTime: 5,
    minInsulationResistance: 100,
    maxInsulationResistance: 1000,
    voltageMinLimit: 200,
    voltageMaxLimit: 240,
    currentMinLimit: 0,
    currentMaxLimit: 8,
    powerMinLimit: 0,
    powerMaxLimit: 2000,
    frequencyMinLimit: 49,
    frequencyMaxLimit: 51
};

// Test tracking variables
let currentTestValues = {
    voltage: { current: 0, min: 999, max: 0 },
    current: { current: 0, min: 999, max: 0 },
    power: { current: 0, min: 999, max: 0 },
    frequency: { current: 0, min: 999, max: 0 },
    insulationPre: 0,
    insulationPost: 0
};

// DOM Elements (will be initialized after DOM loads)
let loginScreen, dashboardScreen, loginBtn, logoutBtn, startTestBtn, stopTestBtn, resetBtn, modelSelect, serialInput;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements after DOM is loaded
    loginScreen = document.getElementById('loginScreen');
    dashboardScreen = document.getElementById('dashboardScreen');
    loginBtn = document.getElementById('loginBtn');
    logoutBtn = document.getElementById('logoutBtn');
    startTestBtn = document.getElementById('startTestBtn');
    stopTestBtn = document.getElementById('stopTestBtn');
    resetBtn = document.getElementById('resetBtn');
    modelSelect = document.getElementById('modelSelect');
    serialInput = document.getElementById('serialInput');
    
    console.log('DOM loaded, elements initialized'); // Debug log
    console.log('Login button:', loginBtn); // Debug log
    
    initializeApp();
    setupEventListeners();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadSettings();
    updateStatisticsDisplay();
    updateStatusIndicators();
});

function initializeApp() {
    showScreen('login');
    resetAllDisplays();
    clearTestResultsTable();
    updateStatusIndicators();
    initializeDummyData();
}

function initializeDummyData() {
    // Add 3 dummy test records for demonstration
    const dummyTests = [
        {
            serialNumber: 'MTR2024001',
            modelNumber: 'PMSM-1500',
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000),
            operator: 'demo_operator',
            results: {
                beforeIR: 'PASS',
                noLoad: 'PASS',
                afterIR: 'PASS',
                final: 'PASS'
            },
            testValues: {
                insulationPre: 520,
                insulationPost: 485,
                voltage: { current: 220.5, min: 218.2, max: 222.8 },
                current: { current: 4.85, min: 0.1, max: 4.92 },
                power: { current: 1048, min: 15, max: 1065 },
                frequency: { current: 50.1, min: 49.8, max: 50.3 }
            }
        },
        {
            serialNumber: 'MTR2024002',
            modelNumber: 'PMSM-3000',
            startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30000),
            operator: 'demo_operator',
            results: {
                beforeIR: 'FAIL',
                noLoad: 'PASS',
                afterIR: 'PASS',
                final: 'FAIL'
            },
            testValues: {
                insulationPre: 85, // Below minimum
                insulationPost: 450,
                voltage: { current: 219.8, min: 217.5, max: 221.2 },
                current: { current: 6.25, min: 0.2, max: 6.38 },
                power: { current: 1342, min: 25, max: 1358 },
                frequency: { current: 49.9, min: 49.7, max: 50.2 }
            }
        },
        {
            serialNumber: 'MTR2024003',
            modelNumber: 'PMSM-1500',
            startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 30000),
            operator: 'demo_supervisor',
            results: {
                beforeIR: 'PASS',
                noLoad: 'PASS',
                afterIR: 'PASS',
                final: 'PASS'
            },
            testValues: {
                insulationPre: 465,
                insulationPost: 442,
                voltage: { current: 221.2, min: 219.1, max: 223.5 },
                current: { current: 4.72, min: 0.15, max: 4.88 },
                power: { current: 1025, min: 18, max: 1042 },
                frequency: { current: 50.0, min: 49.8, max: 50.2 }
            }
        }
    ];

    // Add dummy tests to testResults array
    testResults = [...dummyTests];
    
    // Update statistics based on dummy data
    statistics.totalProduction = dummyTests.length;
    dummyTests.forEach(test => {
        if (test.results.beforeIR === 'PASS') statistics.beforeIR.pass++;
        else statistics.beforeIR.fail++;
        
        if (test.results.afterIR === 'PASS') statistics.afterIR.pass++;
        else statistics.afterIR.fail++;
        
        if (test.results.noLoad === 'FAIL') statistics.noLoad.fail++;
    });
    
    updateStatisticsDisplay();
    
    // Populate dashboard table with dummy data
    populateDashboardTableWithDummyData();
}

function setupEventListeners() {
    console.log('Setting up event listeners'); // Debug log
    
    // Login
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
        console.log('Login button listener added'); // Debug log
    } else {
        console.error('Login button not found!');
    }
    
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Model and serial inputs
    if (modelSelect) {
        modelSelect.addEventListener('change', validateTestInputs);
    }
    if (serialInput) {
        serialInput.addEventListener('input', validateTestInputs);
    }
    
    // Control buttons
    if (startTestBtn) {
        startTestBtn.addEventListener('click', startDashboardTest);
    }
    if (stopTestBtn) {
        stopTestBtn.addEventListener('click', stopTest);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSystem);
    }
    
    // Report buttons (check if they exist)
    const generateBtn = document.getElementById('generateReportBtn');
    const saveBtn = document.getElementById('saveReportBtn');
    const printBtn = document.getElementById('printReportBtn');
    const exportBtn = document.getElementById('exportPdfBtn');
    const clearBtn = document.getElementById('clearReportBtn');
    
    if (generateBtn) generateBtn.addEventListener('click', generateExcelReport);
    if (saveBtn) saveBtn.addEventListener('click', saveExcelReport);
    if (printBtn) printBtn.addEventListener('click', printExcelReport);
    if (exportBtn) exportBtn.addEventListener('click', exportPdfReport);
    if (clearBtn) clearBtn.addEventListener('click', clearExcelReport);
    
    // Settings inputs
    setupSettingsListeners();
}

function setupSettingsListeners() {
    const settingsInputs = [
        'minIRLimit', 'maxIRLimit', 'testTimeLimit',
        'minVoltageLimit', 'maxVoltageLimit', 'minCurrentLimit', 'maxCurrentLimit',
        'minPowerLimit', 'maxPowerLimit', 'minFreqLimit', 'maxFreqLimit'
    ];
    
    settingsInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateTestSettings);
        }
    });
    
    // Password change button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handlePasswordChange);
    }
}

function updateTestSettings() {
    testSettings.minInsulationResistance = parseInt(document.getElementById('minIRLimit').value) || 100;
    testSettings.maxInsulationResistance = parseInt(document.getElementById('maxIRLimit').value) || 1000;
    testSettings.irTestTime = parseInt(document.getElementById('testTimeLimit').value) || 5;
    testSettings.voltageMinLimit = parseFloat(document.getElementById('minVoltageLimit').value) || 200;
    testSettings.voltageMaxLimit = parseFloat(document.getElementById('maxVoltageLimit').value) || 240;
    testSettings.currentMinLimit = parseFloat(document.getElementById('minCurrentLimit').value) || 0;
    testSettings.currentMaxLimit = parseFloat(document.getElementById('maxCurrentLimit').value) || 8;
    testSettings.powerMinLimit = parseFloat(document.getElementById('minPowerLimit').value) || 0;
    testSettings.powerMaxLimit = parseFloat(document.getElementById('maxPowerLimit').value) || 2000;
    testSettings.frequencyMinLimit = parseFloat(document.getElementById('minFreqLimit').value) || 49;
    testSettings.frequencyMaxLimit = parseFloat(document.getElementById('maxFreqLimit').value) || 51;
    
    // Save to localStorage
    localStorage.setItem('testSettings', JSON.stringify(testSettings));
}

function updateStatusIndicators() {
    const statusElements = [
        { id: 'meggerStatusCircle', state: statusStates.megger },
        { id: 'startButtonStatusCircle', state: statusStates.startButton },
        { id: 'emergencyStatusCircle', state: statusStates.emergency },
        { id: 'vfdStatusCircle', state: statusStates.vfd },
        { id: 'vfdEmergencyStatusCircle', state: statusStates.vfdEmergency }
    ];
    
    statusElements.forEach(({ id, state }) => {
        const element = document.getElementById(id);
        if (element) {
            element.className = `status-compact-circle ${state ? 'connected' : 'disconnected'}`;
        }
    });
}

// Demo Test Functions
function runDemoTest(testType) {
    if (testInProgress) {
        alert('Test already in progress. Please wait for completion or stop the current test.');
        return;
    }
    
    const model = modelSelect.value;
    const serial = serialInput.value.trim();
    
    if (!model || !serial) {
        alert('Please select a model and enter a serial number before running demo test.');
        return;
    }
    
    demoTestType = testType;
    alert(`Starting ${testType.toUpperCase()} demo test. Watch the parameters and results update.`);
    startDashboardTest();
}

function toggleStatusDemo() {
    // Randomly toggle some status indicators for demo
    const statusKeys = Object.keys(statusStates);
    const randomKey = statusKeys[Math.floor(Math.random() * statusKeys.length)];
    
    statusStates[randomKey] = !statusStates[randomKey];
    updateStatusIndicators();
    
    const statusName = randomKey.replace(/([A-Z])/g, ' $1').toLowerCase();
    const newState = statusStates[randomKey] ? 'CONNECTED' : 'DISCONNECTED';
    
    alert(`${statusName.toUpperCase()} status changed to: ${newState}`);
    
    // Auto-restore after 5 seconds for demo
    setTimeout(() => {
        statusStates[randomKey] = true;
        updateStatusIndicators();
    }, 5000);
}

function handleLogin() {
    console.log('Login button clicked'); // Debug log
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', { username }); // Debug log (don't log password)
    
    // Get stored credentials or use defaults
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Initialize default users if not exists
    if (Object.keys(users).length === 0) {
        users = {
            'user': { password: 'pass', role: 'operator' },
            'admin': { password: 'admin', role: 'supervisor' }
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    if (users[username] && users[username].password === password) {
        console.log('Login successful'); // Debug log
        
        // Role is automatically determined from stored user data
        currentUser = {
            username,
            role: users[username].role
        };
        
        // Update UI based on role
        document.body.className = currentUser.role;
        const userRoleElement = document.getElementById('userRole');
        if (userRoleElement) {
            userRoleElement.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        }
        
        showScreen('dashboard');
        
        if (currentUser.role === 'supervisor') {
            loadTestHistory();
        }
    } else {
        console.log('Login failed'); // Debug log
        alert('Invalid credentials. Try:\nOperator: user / pass\nSupervisor: admin / admin');
    }
}

function handleLogout() {
    currentUser = null;
    testInProgress = false;
    document.body.className = '';
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Reset dashboard inputs
    modelSelect.value = '';
    serialInput.value = '';
    
    resetAllDisplays();
    showScreen('login');
}

function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const statusElement = document.getElementById('passwordChangeStatus');
    
    // Clear previous status
    statusElement.textContent = '';
    statusElement.className = 'password-status';
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        statusElement.textContent = 'All fields are required.';
        statusElement.className = 'password-status error';
        return;
    }
    
    if (newPassword.length < 4) {
        statusElement.textContent = 'New password must be at least 4 characters long.';
        statusElement.className = 'password-status error';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        statusElement.textContent = 'New password and confirmation do not match.';
        statusElement.className = 'password-status error';
        return;
    }
    
    // Get stored credentials
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Initialize default users if not exists
    if (Object.keys(users).length === 0) {
        users = {
            'user': { password: 'pass', role: 'operator' },
            'admin': { password: 'admin', role: 'supervisor' }
        };
    }
    
    // Verify current password
    if (!currentUser || !users[currentUser.username] || users[currentUser.username].password !== currentPassword) {
        statusElement.textContent = 'Current password is incorrect.';
        statusElement.className = 'password-status error';
        return;
    }
    
    // Update password
    users[currentUser.username].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Show success message
    statusElement.textContent = 'Password changed successfully!';
    statusElement.className = 'password-status success';
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = 'password-status';
    }, 3000);
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    if (screenName === 'login') {
        loginScreen.classList.add('active');
    } else if (screenName === 'dashboard') {
        dashboardScreen.classList.add('active');
    }
}

function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function validateTestInputs() {
    const model = modelSelect.value;
    const serial = serialInput.value.trim();
    
    startTestBtn.disabled = !model || !serial || testInProgress;
}

function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-GB');
    const timeString = now.toLocaleTimeString('en-GB');
    
    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTimeDisplay');
    const clockElement = document.getElementById('currentTime');
    
    if (dateElement) dateElement.textContent = dateString;
    if (timeElement) timeElement.textContent = timeString;
    if (clockElement) clockElement.textContent = now.toLocaleString();
}

// Main Test Execution Logic
async function startDashboardTest() {
    if (testInProgress) return;
    
    testInProgress = true;
    startTestBtn.disabled = true;
    
    const model = modelSelect.value;
    const serial = serialInput.value.trim();
    
    testData = {
        serialNumber: serial,
        modelNumber: model,
        startTime: new Date(),
        operator: currentUser.username,
        steps: []
    };
    
    // Reset tracking values
    resetTrackingValues();
    resetAllDisplays();
    
    try {
        // Step 1: IR Test (Pre-Run)
        await runDashboardTestStep('Before IR Test', async () => {
            await simulateIRTest('pre');
        });
        
        // Step 2: No Load Test (VFD Run)
        await runDashboardTestStep('No Load Test', async () => {
            await simulateNoLoadTest();
        });
        
        // Step 3: IR Test (Post-Run)
        await runDashboardTestStep('After IR Test', async () => {
            await simulateIRTest('post');
        });
        
        // Evaluate final results
        const results = evaluateAllTestResults();
        testData.results = results;
        testData.endTime = new Date();
        
        // Update displays
        updateFinalResults(results);
        
        // Add to test results table
        addTestResultToTable(testData);
        
        // Update statistics
        updateStatistics(results);
        
        // Save test record
        await saveTestRecord(testData);
        
    } catch (error) {
        console.error('Test failed:', error);
        const failResults = { beforeIR: 'FAIL', noLoad: 'FAIL', afterIR: 'FAIL', final: 'FAIL' };
        updateFinalResults(failResults);
        addTestResultToTable({ ...testData, results: failResults, error: error.message });
        updateStatistics(failResults);
    }
    
    testInProgress = false;
    startTestBtn.disabled = false;
}

async function runDashboardTestStep(stepName, testFunction) {
    const stepData = {
        name: stepName,
        startTime: new Date(),
        values: {}
    };
    
    try {
        await testFunction();
        stepData.endTime = new Date();
        stepData.result = 'PASS';
    } catch (error) {
        stepData.endTime = new Date();
        stepData.result = 'FAIL';
        stepData.error = error.message;
        throw error;
    }
    
    testData.steps.push(stepData);
}

// Simulation Functions
async function simulateIRTest(phase) {
    const duration = testSettings.irTestTime * 1000;
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                clearInterval(interval);
                
                // Final insulation value based on demo test type
                let finalValue;
                if (demoTestType === 'fail') {
                    // Force failure for demo
                    finalValue = phase === 'pre' ? 50 : 45; // Below minimum limit
                } else {
                    // Normal pass values
                    const baseValue = phase === 'pre' ? 520 : 480;
                    finalValue = baseValue + (Math.random() - 0.5) * 100;
                }
                
                updateDashboardParameter('insulationDisplay', finalValue.toFixed(0));
                
                // Store the value
                if (phase === 'pre') {
                    currentTestValues.insulationPre = finalValue;
                    updateIRResult('beforeIRResult', finalValue);
                } else {
                    currentTestValues.insulationPost = finalValue;
                    updateIRResult('afterIRResult', finalValue);
                }
                
                // Check against limits
                if (finalValue < testSettings.minInsulationResistance || 
                    finalValue > testSettings.maxInsulationResistance) {
                    reject(new Error(`Insulation resistance out of range: ${finalValue.toFixed(0)} MΩ`));
                } else {
                    resolve();
                }
            } else {
                // Simulate changing insulation values during test
                const baseValue = phase === 'pre' ? 520 : 480;
                const currentValue = baseValue + Math.sin(progress * Math.PI * 4) * 100 + (Math.random() - 0.5) * 50;
                updateDashboardParameter('insulationDisplay', Math.max(0, currentValue).toFixed(0));
            }
        }, 200);
    });
}

async function simulateNoLoadTest() {
    const duration = 12000; // 12 seconds
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                clearInterval(interval);
                
                // Final validation
                const results = validateNoLoadParameters();
                if (!results.valid) {
                    reject(new Error(results.error));
                } else {
                    resolve();
                }
            } else {
                // Simulate VFD motor run parameters
                simulateVFDParameters(progress);
            }
        }, 300);
    });
}

function simulateVFDParameters(progress) {
    // Base values
    let baseVoltage = 220;
    let baseCurrent = 4.8;
    let baseFrequency = 50;
    
    // Modify values for demo fail test
    if (demoTestType === 'fail') {
        baseVoltage = 180; // Below minimum limit
        baseCurrent = 10;  // Above maximum limit
        baseFrequency = 45; // Below minimum limit
    }
    
    // Voltage: stable around base with minor variations
    const voltage = baseVoltage + Math.sin(progress * Math.PI * 3) * 5 + (Math.random() - 0.5) * 3;
    
    // Current: ramp up then stabilize
    const rampProgress = Math.min(progress * 2, 1);
    const current = baseCurrent * rampProgress + Math.sin(progress * Math.PI * 8) * 0.4 + (Math.random() - 0.5) * 0.3;
    
    // Power: calculated from motor characteristics
    const power = (voltage * Math.max(0, current) * 0.82); // Power factor ~0.82
    
    // Frequency: stable around base
    const frequency = baseFrequency + (Math.random() - 0.5) * 0.5;
    
    // Update displays and track min/max
    updateParameterWithMinMax('voltage', voltage);
    updateParameterWithMinMax('current', Math.max(0, current));
    updateParameterWithMinMax('power', Math.max(0, power));
    updateParameterWithMinMax('frequency', frequency);
}

function updateParameterWithMinMax(paramName, value) {
    const roundedValue = parseFloat(value.toFixed(2));
    
    // Update current value
    currentTestValues[paramName].current = roundedValue;
    
    // Update min/max tracking
    if (roundedValue < currentTestValues[paramName].min) {
        currentTestValues[paramName].min = roundedValue;
    }
    if (roundedValue > currentTestValues[paramName].max) {
        currentTestValues[paramName].max = roundedValue;
    }
    
    // Update dashboard display
    const displayValue = paramName === 'power' ? roundedValue.toFixed(0) : roundedValue.toFixed(2);
    updateDashboardParameter(`${paramName}Display`, displayValue);
}

function updateDashboardParameter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateIRResult(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        const valueElement = element.querySelector('.result-value');
        const statusElement = element.querySelector('.result-status');
        
        if (valueElement) valueElement.textContent = value.toFixed(0);
        
        if (statusElement) {
            const isPass = value >= testSettings.minInsulationResistance && value <= testSettings.maxInsulationResistance;
            statusElement.textContent = isPass ? 'PASS' : 'FAIL';
            statusElement.className = `result-status ${isPass ? 'pass' : 'fail'}`;
        }
    }
}

function validateNoLoadParameters() {
    const voltage = currentTestValues.voltage.current;
    const current = currentTestValues.current.current;
    const power = currentTestValues.power.current;
    const frequency = currentTestValues.frequency.current;
    
    if (voltage < testSettings.voltageMinLimit || voltage > testSettings.voltageMaxLimit) {
        return { valid: false, error: `Voltage out of range: ${voltage.toFixed(1)}V` };
    }
    
    if (current < testSettings.currentMinLimit || current > testSettings.currentMaxLimit) {
        return { valid: false, error: `Current out of range: ${current.toFixed(2)}A` };
    }
    
    if (power < testSettings.powerMinLimit || power > testSettings.powerMaxLimit) {
        return { valid: false, error: `Power out of range: ${power.toFixed(0)}W` };
    }
    
    if (frequency < testSettings.frequencyMinLimit || frequency > testSettings.frequencyMaxLimit) {
        return { valid: false, error: `Frequency out of range: ${frequency.toFixed(1)}Hz` };
    }
    
    return { valid: true };
}

function evaluateAllTestResults() {
    // Check IR test results
    const irPrePass = currentTestValues.insulationPre >= testSettings.minInsulationResistance && 
                      currentTestValues.insulationPre <= testSettings.maxInsulationResistance;
    const irPostPass = currentTestValues.insulationPost >= testSettings.minInsulationResistance && 
                       currentTestValues.insulationPost <= testSettings.maxInsulationResistance;
    
    // Check no-load test results
    const noLoadValidation = validateNoLoadParameters();
    
    const beforeIR = irPrePass ? 'PASS' : 'FAIL';
    const afterIR = irPostPass ? 'PASS' : 'FAIL';
    const noLoad = noLoadValidation.valid ? 'PASS' : 'FAIL';
    const final = (beforeIR === 'PASS' && afterIR === 'PASS' && noLoad === 'PASS') ? 'PASS' : 'FAIL';
    
    return { beforeIR, afterIR, noLoad, final };
}

function updateFinalResults(results) {
    // Update final result displays
    updateFinalResultBox('finalVoltageResult', currentTestValues.voltage.current, results.noLoad);
    updateFinalResultBox('finalCurrentResult', currentTestValues.current.current, results.noLoad);
    updateFinalResultBox('finalPowerResult', currentTestValues.power.current, results.noLoad);
    updateFinalResultBox('finalFreqResult', currentTestValues.frequency.current, results.noLoad);
    
    // Update overall result
    const overallElement = document.getElementById('overallResult');
    if (overallElement) {
        overallElement.textContent = results.final;
        overallElement.className = `overall-result-box ${results.final.toLowerCase()}`;
    }
}

function updateFinalResultBox(elementId, value, status) {
    const element = document.getElementById(elementId);
    if (element) {
        const valueElement = element.querySelector('.final-result-value');
        const statusElement = element.querySelector('.final-result-status');
        
        if (valueElement) {
            const displayValue = elementId.includes('Power') ? value.toFixed(0) : value.toFixed(2);
            valueElement.textContent = displayValue;
        }
        
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `final-result-status ${status.toLowerCase()}`;
        }
    }
}

function addTestResultToTable(testData) {
    const tbody = document.getElementById('testResultsTableBody');
    if (!tbody) return;
    
    const results = testData.results;
    const row = document.createElement('tr');
    
    const serialNumber = testData.serialNumber || '---';
    const date = testData.startTime ? testData.startTime.toLocaleDateString('en-GB') : '---';
    const time = testData.startTime ? testData.startTime.toLocaleTimeString('en-GB') : '---';
    
    row.innerHTML = `
        <td>${testResults.length + 1}</td>
        <td>${date}</td>
        <td>${time}</td>
        <td>${serialNumber}</td>
        <td>${currentTestValues.insulationPre.toFixed(0)}</td>
        <td class="result-${results.beforeIR.toLowerCase()}">${results.beforeIR}</td>
        <td>${currentTestValues.voltage.current.toFixed(1)}</td>
        <td>${currentTestValues.current.current.toFixed(2)}</td>
        <td>${currentTestValues.power.current.toFixed(0)}</td>
        <td>${currentTestValues.frequency.current.toFixed(1)}</td>
        <td class="result-${results.noLoad.toLowerCase()}">${results.noLoad}</td>
        <td>${currentTestValues.insulationPost.toFixed(0)}</td>
        <td class="result-${results.afterIR.toLowerCase()}">${results.afterIR}</td>
        <td class="result-${results.final.toLowerCase()}">${results.final}</td>
    `;
    
    tbody.appendChild(row);
    
    // Store test values with the test data
    testData.testValues = {
        insulationPre: currentTestValues.insulationPre,
        insulationPost: currentTestValues.insulationPost,
        voltage: { ...currentTestValues.voltage },
        current: { ...currentTestValues.current },
        power: { ...currentTestValues.power },
        frequency: { ...currentTestValues.frequency }
    };
    
    testResults.push(testData);
}

function updateStatistics(results) {
    statistics.totalProduction++;
    
    if (results.beforeIR === 'PASS') statistics.beforeIR.pass++;
    else statistics.beforeIR.fail++;
    
    if (results.afterIR === 'PASS') statistics.afterIR.pass++;
    else statistics.afterIR.fail++;
    
    if (results.noLoad === 'FAIL') statistics.noLoad.fail++;
    
    updateStatisticsDisplay();
}

function updateStatisticsDisplay() {
    const total = statistics.totalProduction;
    
    document.getElementById('totalProduction').textContent = total;
    
    // Before IR Test
    document.getElementById('beforePassQty').textContent = statistics.beforeIR.pass;
    document.getElementById('beforeFailQty').textContent = statistics.beforeIR.fail;
    document.getElementById('beforePassPercent').textContent = total > 0 ? ((statistics.beforeIR.pass / total) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('beforeFailPercent').textContent = total > 0 ? ((statistics.beforeIR.fail / total) * 100).toFixed(1) + '%' : '0%';
    
    // No Load Test
    document.getElementById('noLoadFailQty').textContent = statistics.noLoad.fail;
    document.getElementById('noLoadFailPercent').textContent = total > 0 ? ((statistics.noLoad.fail / total) * 100).toFixed(1) + '%' : '0%';
    
    // After IR Test
    document.getElementById('afterPassQty').textContent = statistics.afterIR.pass;
    document.getElementById('afterFailQty').textContent = statistics.afterIR.fail;
    document.getElementById('afterPassPercent').textContent = total > 0 ? ((statistics.afterIR.pass / total) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('afterFailPercent').textContent = total > 0 ? ((statistics.afterIR.fail / total) * 100).toFixed(1) + '%' : '0%';
}

function stopTest() {
    testInProgress = false;
    startTestBtn.disabled = false;
    alert('Test stopped by user');
}

function resetSystem() {
    testInProgress = false;
    startTestBtn.disabled = true;
    
    // Reset inputs
    modelSelect.value = '';
    serialInput.value = '';
    
    // Reset displays
    resetAllDisplays();
    
    // Clear table
    clearTestResultsTable();
    
    // Reset statistics
    statistics = {
        totalProduction: 0,
        beforeIR: { pass: 0, fail: 0 },
        noLoad: { pass: 0, fail: 0 },
        afterIR: { pass: 0, fail: 0 }
    };
    updateStatisticsDisplay();
    
    testResults = [];
    
    alert('System reset complete');
}

function resetTrackingValues() {
    currentTestValues = {
        voltage: { current: 0, min: 999, max: 0 },
        current: { current: 0, min: 999, max: 0 },
        power: { current: 0, min: 999, max: 0 },
        frequency: { current: 0, min: 999, max: 0 },
        insulationPre: 0,
        insulationPost: 0
    };
}

function resetAllDisplays() {
    // Reset real-time data displays
    const displays = ['insulationDisplay', 'voltageDisplay', 'currentDisplay', 'powerDisplay', 'frequencyDisplay'];
    displays.forEach(id => {
        updateDashboardParameter(id, '---');
    });
    
    // Reset IR result displays
    resetIRResultDisplay('beforeIRResult');
    resetIRResultDisplay('afterIRResult');
    
    // Reset final results
    resetFinalResultDisplay('finalVoltageResult');
    resetFinalResultDisplay('finalCurrentResult');
    resetFinalResultDisplay('finalPowerResult');
    resetFinalResultDisplay('finalFreqResult');
    
    // Reset overall result
    const overallElement = document.getElementById('overallResult');
    if (overallElement) {
        overallElement.textContent = '---';
        overallElement.className = 'overall-result-box';
    }
}

function resetIRResultDisplay(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const valueElement = element.querySelector('.result-value');
        const statusElement = element.querySelector('.result-status');
        
        if (valueElement) valueElement.textContent = '---';
        if (statusElement) {
            statusElement.textContent = '---';
            statusElement.className = 'result-status';
        }
    }
}

function resetFinalResultDisplay(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const valueElement = element.querySelector('.final-result-value');
        const statusElement = element.querySelector('.final-result-status');
        
        if (valueElement) valueElement.textContent = '---';
        if (statusElement) {
            statusElement.textContent = '---';
            statusElement.className = 'final-result-status';
        }
    }
}

function clearTestResultsTable() {
    const tbody = document.getElementById('testResultsTableBody');
    if (tbody) {
        tbody.innerHTML = '';
    }
}

// Settings Management
function loadSettings() {
    const saved = localStorage.getItem('testSettings');
    if (saved) {
        testSettings = { ...testSettings, ...JSON.parse(saved) };
        updateSettingsUI();
    }
}

function updateSettingsUI() {
    document.getElementById('minIRLimit').value = testSettings.minInsulationResistance;
    document.getElementById('maxIRLimit').value = testSettings.maxInsulationResistance;
    document.getElementById('testTimeLimit').value = testSettings.irTestTime;
    document.getElementById('minVoltageLimit').value = testSettings.voltageMinLimit;
    document.getElementById('maxVoltageLimit').value = testSettings.voltageMaxLimit;
    document.getElementById('minCurrentLimit').value = testSettings.currentMinLimit;
    document.getElementById('maxCurrentLimit').value = testSettings.currentMaxLimit;
    document.getElementById('minPowerLimit').value = testSettings.powerMinLimit;
    document.getElementById('maxPowerLimit').value = testSettings.powerMaxLimit;
    document.getElementById('minFreqLimit').value = testSettings.frequencyMinLimit;
    document.getElementById('maxFreqLimit').value = testSettings.frequencyMaxLimit;
}

// Main Test Execution Logic
async function startIRAndNoLoadTest() {
    if (testInProgress) return;
    
    testInProgress = true;
    startTestBtn.disabled = true;
    
    // Initialize test data
    testData = {
        modelNumber: modelNumberInput.value.trim(),
        serialNumber: serialNumberInput.value.trim(),
        phase: phaseSelect.value,
        direction: directionSelect.value,
        startTime: new Date(),
        operator: currentUser.username,
        steps: []
    };
    
    // Reset tracking values
    resetTrackingValues();
    resetAllDisplays();
    
    updateTestStatus('running', 'Initializing IR & No Load Test Sequence...');
    
    try {
        // Step 1: IR Test (Pre-Run)
        await runTestStep('Insulation Resistance Test - Pre Run', async () => {
            await simulateIRTest('pre');
        });
        
        // Step 2: No Load Test (VFD Run)
        await runTestStep('No Load Test (VFD Run)', async () => {
            await simulateNoLoadTest();
        });
        
        // Step 3: IR Test (Post-Run)
        await runTestStep('Insulation Resistance Test - Post Run', async () => {
            await simulateIRTest('post');
        });
        
        // Evaluate final results
        const results = evaluateAllTestResults();
        testData.results = results;
        testData.endTime = new Date();
        
        // Update final status
        const finalResult = results.finalResult;
        updateTestStatus(finalResult.toLowerCase(), `Test Complete: ${finalResult}`);
        
        // Update result displays
        updateResultDisplays(results);
        
        // Generate and show report
        generateDetailedTestReport();
        
        // Save test record
        await saveTestRecord(testData);
        
    } catch (error) {
        updateTestStatus('fail', 'Test Failed: ' + error.message);
        testData.result = 'FAIL';
        testData.error = error.message;
        updateResultDisplays({ finalResult: 'FAIL', irTest: 'FAIL', noLoadTest: 'FAIL' });
    }
    
    testInProgress = false;
    startTestBtn.disabled = false;
    
    // Hide progress after 3 seconds
    setTimeout(() => {
        document.getElementById('testProgress').style.display = 'none';
    }, 3000);
}

async function runTestStep(stepName, testFunction) {
    updateCurrentStep(stepName);
    
    const stepData = {
        name: stepName,
        startTime: new Date(),
        values: {}
    };
    
    try {
        await testFunction();
        stepData.endTime = new Date();
        stepData.result = 'PASS';
    } catch (error) {
        stepData.endTime = new Date();
        stepData.result = 'FAIL';
        stepData.error = error.message;
        throw error;
    }
    
    testData.steps.push(stepData);
}

function updateTestStatus(status, message) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const progress = document.getElementById('testProgress');
    
    indicator.className = `status-indicator ${status}`;
    statusText.textContent = message;
    
    if (status === 'running') {
        progress.style.display = 'block';
    }
}

function updateCurrentStep(step) {
    document.getElementById('currentStep').textContent = step;
    
    // Update progress based on step
    const steps = [
        'Insulation Resistance Test - Pre Run',
        'No Load Test (VFD Run)', 
        'Insulation Resistance Test - Post Run'
    ];
    const currentIndex = steps.indexOf(step);
    const progress = ((currentIndex + 1) / steps.length) * 100;
    
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Simulation Functions
async function simulateIRTest(phase) {
    const duration = testSettings.irTestTime * 1000; // Convert to milliseconds
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                clearInterval(interval);
                
                // Final insulation value
                const baseValue = phase === 'pre' ? 520 : 480;
                const finalValue = baseValue + (Math.random() - 0.5) * 200;
                
                updateParameter('insulationValue', finalValue.toFixed(0));
                
                // Store the value
                if (phase === 'pre') {
                    currentTestValues.insulationPre = finalValue;
                } else {
                    currentTestValues.insulationPost = finalValue;
                }
                
                // Check against limits
                if (finalValue < testSettings.minInsulationResistance || 
                    finalValue > testSettings.maxInsulationResistance) {
                    updateIRResult('FAIL');
                    reject(new Error(`Insulation resistance out of range: ${finalValue.toFixed(0)} MΩ`));
                } else {
                    updateIRResult('PASS');
                    resolve();
                }
            } else {
                // Simulate changing insulation values during test
                const baseValue = phase === 'pre' ? 520 : 480;
                const currentValue = baseValue + Math.sin(progress * Math.PI * 4) * 100 + (Math.random() - 0.5) * 50;
                updateParameter('insulationValue', Math.max(0, currentValue).toFixed(0));
            }
        }, 200);
    });
}

async function simulateNoLoadTest() {
    const duration = 12000; // 12 seconds for no-load test
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                clearInterval(interval);
                
                // Final validation
                const results = validateNoLoadParameters();
                if (!results.valid) {
                    reject(new Error(results.error));
                } else {
                    resolve();
                }
            } else {
                // Simulate VFD motor run parameters
                simulateVFDParameters(progress);
            }
        }, 300);
    });
}

function simulateVFDParameters(progress) {
    // Voltage: stable around 220V with minor variations
    const baseVoltage = 220;
    const voltage = baseVoltage + Math.sin(progress * Math.PI * 3) * 8 + (Math.random() - 0.5) * 5;
    
    // Current: ramp up then stabilize
    const rampProgress = Math.min(progress * 2, 1);
    const baseCurrent = 4.8;
    const current = baseCurrent * rampProgress + Math.sin(progress * Math.PI * 8) * 0.4 + (Math.random() - 0.5) * 0.3;
    
    // Power: calculated from motor characteristics
    const power = (voltage * Math.max(0, current) * 0.82); // Power factor ~0.82
    
    // Frequency: stable at 50Hz
    const frequency = 50 + (Math.random() - 0.5) * 0.8;
    
    // Speed: calculated from frequency (assuming 4-pole motor)
    const speed = (frequency * 60 / 2) * 0.95; // 5% slip
    
    // Update displays and track min/max
    updateParameterWithMinMax('voltage', voltage);
    updateParameterWithMinMax('current', Math.max(0, current));
    updateParameterWithMinMax('power', Math.max(0, power));
    updateParameterWithMinMax('frequency', frequency);
    updateParameterWithMinMax('speed', Math.max(0, speed));
}

function updateParameterWithMinMax(paramName, value) {
    const roundedValue = parseFloat(value.toFixed(2));
    
    // Update current value
    currentTestValues[paramName].current = roundedValue;
    
    // Update min/max tracking
    if (roundedValue < currentTestValues[paramName].min) {
        currentTestValues[paramName].min = roundedValue;
    }
    if (roundedValue > currentTestValues[paramName].max) {
        currentTestValues[paramName].max = roundedValue;
    }
    
    // Update display
    const units = {
        voltage: 'V',
        current: 'A', 
        power: 'W',
        frequency: 'Hz',
        speed: 'RPM'
    };
    
    updateParameter(`${paramName}Value`, roundedValue.toFixed(paramName === 'power' ? 0 : 2));
    updateParameter(`${paramName}Min`, currentTestValues[paramName].min.toFixed(paramName === 'power' ? 0 : 2));
    updateParameter(`${paramName}Max`, currentTestValues[paramName].max.toFixed(paramName === 'power' ? 0 : 2));
}

function updateParameter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateIRResult(result) {
    const element = document.getElementById('irResult');
    if (element) {
        element.textContent = result;
        element.className = `test-result ${result.toLowerCase()}`;
    }
}

function validateNoLoadParameters() {
    const voltage = currentTestValues.voltage.current;
    const current = currentTestValues.current.current;
    const power = currentTestValues.power.current;
    const frequency = currentTestValues.frequency.current;
    const speed = currentTestValues.speed.current;
    
    if (voltage < testSettings.voltageMinLimit || voltage > testSettings.voltageMaxLimit) {
        return { valid: false, error: `Voltage out of range: ${voltage.toFixed(1)}V` };
    }
    
    if (current > testSettings.currentMaxLimit) {
        return { valid: false, error: `Current too high: ${current.toFixed(2)}A` };
    }
    
    if (power > testSettings.powerMaxLimit) {
        return { valid: false, error: `Power too high: ${power.toFixed(0)}W` };
    }
    
    if (frequency < testSettings.frequencyMinLimit || frequency > testSettings.frequencyMaxLimit) {
        return { valid: false, error: `Frequency out of range: ${frequency.toFixed(1)}Hz` };
    }
    
    if (speed < testSettings.speedMinLimit || speed > testSettings.speedMaxLimit) {
        return { valid: false, error: `Speed out of range: ${speed.toFixed(0)}RPM` };
    }
    
    return { valid: true };
}

function evaluateAllTestResults() {
    // Check IR test results
    const irPrePass = currentTestValues.insulationPre >= testSettings.minInsulationResistance && 
                      currentTestValues.insulationPre <= testSettings.maxInsulationResistance;
    const irPostPass = currentTestValues.insulationPost >= testSettings.minInsulationResistance && 
                       currentTestValues.insulationPost <= testSettings.maxInsulationResistance;
    const irTestResult = irPrePass && irPostPass ? 'PASS' : 'FAIL';
    
    // Check no-load test results
    const noLoadValidation = validateNoLoadParameters();
    const noLoadTestResult = noLoadValidation.valid ? 'PASS' : 'FAIL';
    
    // Final result
    const finalResult = (irTestResult === 'PASS' && noLoadTestResult === 'PASS') ? 'PASS' : 'FAIL';
    
    return {
        irTest: irTestResult,
        noLoadTest: noLoadTestResult,
        finalResult: finalResult
    };
}

function updateResultDisplays(results) {
    updateResultBadge('irTestResult', results.irTest);
    updateResultBadge('noLoadTestResult', results.noLoadTest);
    updateResultBadge('finalResult', results.finalResult);
}

function updateResultBadge(elementId, result) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = result;
        element.className = `result-badge ${result.toLowerCase()}`;
    }
}

function resetTrackingValues() {
    currentTestValues = {
        voltage: { current: 0, min: 999, max: 0 },
        current: { current: 0, min: 999, max: 0 },
        power: { current: 0, min: 999, max: 0 },
        frequency: { current: 0, min: 999, max: 0 },
        speed: { current: 0, min: 999, max: 0 },
        insulationPre: 0,
        insulationPost: 0
    };
}

function resetAllDisplays() {
    // Reset parameter displays
    const params = [
        'insulationValue', 'voltageValue', 'currentValue', 'powerValue', 
        'frequencyValue', 'speedValue', 'voltageMin', 'voltageMax',
        'currentMin', 'currentMax', 'powerMin', 'powerMax',
        'frequencyMin', 'frequencyMax', 'speedMin', 'speedMax'
    ];
    
    params.forEach(param => {
        updateParameter(param, '---');
    });
    
    // Reset result displays
    updateResultBadge('irTestResult', '---');
    updateResultBadge('noLoadTestResult', '---');
    updateResultBadge('finalResult', '---');
    
    // Reset IR result
    const irResult = document.getElementById('irResult');
    if (irResult) {
        irResult.textContent = '---';
        irResult.className = 'test-result';
    }
}

// Report Generation
function generateDetailedTestReport() {
    const reportContent = document.getElementById('reportContent');
    const downloadBtn = document.getElementById('downloadReportBtn');
    const printBtn = document.getElementById('printReportBtn');
    
    // Update report header information
    document.getElementById('reportModelNumber').textContent = testData.modelNumber;
    document.getElementById('reportPhase').textContent = testData.phase;
    document.getElementById('reportDirection').textContent = testData.direction;
    document.getElementById('reportSerialNumber').textContent = testData.serialNumber;
    document.getElementById('reportDateTime').textContent = testData.startTime.toLocaleString();
    
    const results = testData.results;
    
    const html = `
        <div class="report-section">
            <h3>Insulation Resistance Test Results</h3>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Test Phase</th>
                            <th>Measured Value (MΩ)</th>
                            <th>Min Limit (MΩ)</th>
                            <th>Max Limit (MΩ)</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Pre-Run</td>
                            <td>${currentTestValues.insulationPre.toFixed(0)}</td>
                            <td>${testSettings.minInsulationResistance}</td>
                            <td>${testSettings.maxInsulationResistance}</td>
                            <td><span class="result-${results.irTest.toLowerCase()}">${results.irTest}</span></td>
                        </tr>
                        <tr>
                            <td>Post-Run</td>
                            <td>${currentTestValues.insulationPost.toFixed(0)}</td>
                            <td>${testSettings.minInsulationResistance}</td>
                            <td>${testSettings.maxInsulationResistance}</td>
                            <td><span class="result-${results.irTest.toLowerCase()}">${results.irTest}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h3>No Load Test Results (VFD Run)</h3>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Min Value</th>
                            <th>Max Value</th>
                            <th>Final Value</th>
                            <th>Unit</th>
                            <th>Limit Check</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Voltage</td>
                            <td>${currentTestValues.voltage.min.toFixed(1)}</td>
                            <td>${currentTestValues.voltage.max.toFixed(1)}</td>
                            <td>${currentTestValues.voltage.current.toFixed(1)}</td>
                            <td>V</td>
                            <td>${testSettings.voltageMinLimit}-${testSettings.voltageMaxLimit}V</td>
                        </tr>
                        <tr>
                            <td>Current</td>
                            <td>${currentTestValues.current.min.toFixed(2)}</td>
                            <td>${currentTestValues.current.max.toFixed(2)}</td>
                            <td>${currentTestValues.current.current.toFixed(2)}</td>
                            <td>A</td>
                            <td>Max ${testSettings.currentMaxLimit}A</td>
                        </tr>
                        <tr>
                            <td>Power</td>
                            <td>${currentTestValues.power.min.toFixed(0)}</td>
                            <td>${currentTestValues.power.max.toFixed(0)}</td>
                            <td>${currentTestValues.power.current.toFixed(0)}</td>
                            <td>W</td>
                            <td>Max ${testSettings.powerMaxLimit}W</td>
                        </tr>
                        <tr>
                            <td>Frequency</td>
                            <td>${currentTestValues.frequency.min.toFixed(1)}</td>
                            <td>${currentTestValues.frequency.max.toFixed(1)}</td>
                            <td>${currentTestValues.frequency.current.toFixed(1)}</td>
                            <td>Hz</td>
                            <td>${testSettings.frequencyMinLimit}-${testSettings.frequencyMaxLimit}Hz</td>
                        </tr>
                        <tr>
                            <td>Speed</td>
                            <td>${currentTestValues.speed.min.toFixed(0)}</td>
                            <td>${currentTestValues.speed.max.toFixed(0)}</td>
                            <td>${currentTestValues.speed.current.toFixed(0)}</td>
                            <td>RPM</td>
                            <td>${testSettings.speedMinLimit}-${testSettings.speedMaxLimit}RPM</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Test Summary</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <label>IR Test Result:</label>
                    <span class="result-${results.irTest.toLowerCase()}">${results.irTest}</span>
                </div>
                <div class="summary-item">
                    <label>No Load Test Result:</label>
                    <span class="result-${results.noLoadTest.toLowerCase()}">${results.noLoadTest}</span>
                </div>
                <div class="summary-item final-summary">
                    <label>FINAL RESULT:</label>
                    <span class="result-${results.finalResult.toLowerCase()}">${results.finalResult}</span>
                </div>
            </div>
        </div>
        
        <div class="report-footer">
            <p><strong>Test Duration:</strong> ${Math.round((testData.endTime - testData.startTime) / 1000)} seconds</p>
            <p><strong>Operator:</strong> ${testData.operator}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    reportContent.innerHTML = html;
    downloadBtn.disabled = false;
    printBtn.disabled = false;
    
    // Switch to reports tab
    switchTab('reports');
}

function downloadReport() {
    alert('Demo: Test report would be downloaded as PDF in a real system.');
}

function printReport() {
    alert('Demo: Test report would be sent to printer in a real system.');
}

// Settings Management
function loadSettings() {
    // Load settings from localStorage or use defaults
    const saved = localStorage.getItem('testSettings');
    if (saved) {
        testSettings = { ...testSettings, ...JSON.parse(saved) };
        updateSettingsUI();
    }
}

function saveSettings() {
    // Get values from UI
    testSettings.irTestTime = parseInt(document.getElementById('irTestTime').value);
    testSettings.minInsulationResistance = parseInt(document.getElementById('minInsulationResistance').value);
    testSettings.maxInsulationResistance = parseInt(document.getElementById('maxInsulationResistance').value);
    testSettings.voltageMinLimit = parseFloat(document.getElementById('voltageMinLimit').value);
    testSettings.voltageMaxLimit = parseFloat(document.getElementById('voltageMaxLimit').value);
    testSettings.currentMaxLimit = parseFloat(document.getElementById('currentMaxLimit').value);
    testSettings.powerMaxLimit = parseInt(document.getElementById('powerMaxLimit').value);
    testSettings.frequencyMinLimit = parseFloat(document.getElementById('frequencyMinLimit').value);
    testSettings.frequencyMaxLimit = parseFloat(document.getElementById('frequencyMaxLimit').value);
    testSettings.speedMinLimit = parseInt(document.getElementById('speedMinLimit').value);
    testSettings.speedMaxLimit = parseInt(document.getElementById('speedMaxLimit').value);
    
    // Save to localStorage
    localStorage.setItem('testSettings', JSON.stringify(testSettings));
    
    alert('Test settings saved successfully!');
}

function updateSettingsUI() {
    document.getElementById('irTestTime').value = testSettings.irTestTime;
    document.getElementById('minInsulationResistance').value = testSettings.minInsulationResistance;
    document.getElementById('maxInsulationResistance').value = testSettings.maxInsulationResistance;
    document.getElementById('voltageMinLimit').value = testSettings.voltageMinLimit;
    document.getElementById('voltageMaxLimit').value = testSettings.voltageMaxLimit;
    document.getElementById('currentMaxLimit').value = testSettings.currentMaxLimit;
    document.getElementById('powerMaxLimit').value = testSettings.powerMaxLimit;
    document.getElementById('frequencyMinLimit').value = testSettings.frequencyMinLimit;
    document.getElementById('frequencyMaxLimit').value = testSettings.frequencyMaxLimit;
    document.getElementById('speedMinLimit').value = testSettings.speedMinLimit;
    document.getElementById('speedMaxLimit').value = testSettings.speedMaxLimit;
}

// Data Management
async function saveTestRecord(data) {
    try {
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            await ipcRenderer.invoke('save-test-record', data);
        } else if (window.mockElectronAPI) {
            await window.mockElectronAPI.saveTestRecord(data);
        }
        console.log('Test record saved:', data);
    } catch (error) {
        console.error('Error saving test record:', error);
    }
}

async function loadTestHistory() {
    try {
        let history = [];
        
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            history = await ipcRenderer.invoke('get-test-history');
        } else if (window.mockElectronAPI) {
            history = await window.mockElectronAPI.getTestHistory();
        } else {
            // Fallback for web version
            history = generateMockHistory();
        }
        
        displayTestHistory(history);
    } catch (error) {
        console.error('Error loading test history:', error);
    }
}

function displayTestHistory(history) {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = history.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.serialNumber}</td>
            <td>${record.modelNumber || 'N/A'}</td>
            <td><span class="result-${record.result.toLowerCase()}">${record.result}</span></td>
            <td>${record.voltage}V</td>
            <td>${record.current}A</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="viewReport('${record.id}')">
                    View Report
                </button>
            </td>
        </tr>
    `).join('');
}

function generateMockHistory() {
    const history = [];
    const models = ['PMSM-1500', 'PMSM-3000', 'PMSM-5500'];
    
    for (let i = 0; i < 15; i++) {
        history.push({
            id: Date.now() - i * 86400000,
            serialNumber: `MTR${String(2024000 + i).padStart(7, '0')}`,
            modelNumber: models[i % models.length],
            date: new Date(Date.now() - i * 86400000).toISOString(),
            result: Math.random() > 0.15 ? 'PASS' : 'FAIL',
            voltage: (220 + Math.random() * 20).toFixed(1),
            current: (4 + Math.random() * 2).toFixed(2),
            power: (800 + Math.random() * 400).toFixed(0),
            frequency: (50 + Math.random() * 1).toFixed(1),
            speed: (1450 + Math.random() * 100).toFixed(0),
            insulationPre: (400 + Math.random() * 200).toFixed(0),
            insulationPost: (380 + Math.random() * 200).toFixed(0)
        });
    }
    return history;
}

function viewReport(recordId) {
    alert(`Demo: Would display detailed IR & No Load test report for record ${recordId}`);
}
// Data Management
async function saveTestRecord(data) {
    try {
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            await ipcRenderer.invoke('save-test-record', data);
        } else if (window.mockElectronAPI) {
            await window.mockElectronAPI.saveTestRecord(data);
        }
        console.log('Test record saved:', data);
    } catch (error) {
        console.error('Error saving test record:', error);
    }
}

async function loadTestHistory() {
    try {
        let history = [];
        
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            history = await ipcRenderer.invoke('get-test-history');
        } else if (window.mockElectronAPI) {
            history = await window.mockElectronAPI.getTestHistory();
        } else {
            // No dummy data - start with empty history
            history = [];
        }
        
        displayTestHistory(history);
    } catch (error) {
        console.error('Error loading test history:', error);
    }
}

function displayTestHistory(history) {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = history.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.serialNumber}</td>
            <td>${record.modelNumber || 'N/A'}</td>
            <td><span class="result-${record.result.toLowerCase()}">${record.result}</span></td>
            <td>${record.voltage}V</td>
            <td>${record.current}A</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="viewReport('${record.id}')">
                    View Report
                </button>
            </td>
        </tr>
    `).join('');
}

function viewReport(recordId) {
    alert(`Demo: Would display detailed IR & No Load test report for record ${recordId}`);
}

// Report Generation Functions (for compatibility)
function downloadReport() {
    alert('Demo: Test report would be downloaded as PDF in a real system.');
}

function printReport() {
    alert('Demo: Test report would be sent to printer in a real system.');
}

function saveSettings() {
    updateTestSettings();
    alert('Test settings saved successfully!');
}
// Make demo functions globally available for HTML onclick handlers
window.runDemoTest = runDemoTest;
window.toggleStatusDemo = toggleStatusDemo;
// Excel Report Generation Functions
function generateExcelReport() {
    if (testResults.length === 0) {
        updateReportStatus('No test data available. Please run some tests first.', 'error');
        return;
    }
    
    // Update report header information
    updateReportHeader();
    
    // Generate report table
    generateReportTable();
    
    // Enable action buttons
    document.getElementById('saveReportBtn').disabled = false;
    document.getElementById('printReportBtn').disabled = false;
    document.getElementById('exportPdfBtn').disabled = false;
    
    updateReportStatus(`Report generated successfully with ${testResults.length} test records.`, 'success');
    
    // Switch to reports tab
    switchTab('reports');
}

function updateReportHeader() {
    // Update date
    document.getElementById('reportDate').textContent = new Date().toLocaleDateString('en-GB');
    
    // Update model information (use last test data)
    const lastTest = testResults[testResults.length - 1];
    if (lastTest) {
        document.getElementById('reportModelValue').textContent = lastTest.modelNumber || '---';
        document.getElementById('reportPhaseValue').textContent = '3 Phase'; // Default
        document.getElementById('reportDirectionValue').textContent = 'CW'; // Default
    }
    
    // Update test limits
    document.getElementById('reportIRTime').textContent = testSettings.irTestTime;
    document.getElementById('reportMinIR').textContent = testSettings.minInsulationResistance;
    document.getElementById('reportMinVolt').textContent = testSettings.voltageMinLimit;
    document.getElementById('reportMaxVolt').textContent = testSettings.voltageMaxLimit;
    document.getElementById('reportMinCurr').textContent = testSettings.currentMinLimit;
    document.getElementById('reportMaxCurr').textContent = testSettings.currentMaxLimit;
    document.getElementById('reportMinPower').textContent = testSettings.powerMinLimit;
    document.getElementById('reportMaxPower').textContent = testSettings.powerMaxLimit;
    document.getElementById('reportMinFreq').textContent = testSettings.frequencyMinLimit;
    document.getElementById('reportMaxFreq').textContent = testSettings.frequencyMaxLimit;
    document.getElementById('reportMinIRAfter').textContent = testSettings.minInsulationResistance;
}

function generateReportTable() {
    const tbody = document.getElementById('reportExcelTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    testResults.forEach((test, index) => {
        const row = document.createElement('tr');
        const results = test.results;
        const values = test.testValues || currentTestValues; // Use test values or current values
        
        // Calculate RPM from frequency (assuming 4-pole motor)
        const rpm = values.frequency ? (values.frequency.current * 60 / 2 * 0.95).toFixed(0) : '---';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${test.startTime ? test.startTime.toLocaleDateString('en-GB') : '---'}</td>
            <td>${test.startTime ? test.startTime.toLocaleTimeString('en-GB') : '---'}</td>
            <td>${test.serialNumber || '---'}</td>
            <td class="final-result-${results.final.toLowerCase()}">${results.final}</td>
            <td>${values.insulationPre ? values.insulationPre.toFixed(0) : '---'}</td>
            <td class="result-${results.beforeIR.toLowerCase()}">${results.beforeIR}</td>
            <td>${values.voltage ? values.voltage.current.toFixed(1) : '---'}</td>
            <td>${values.current ? values.current.current.toFixed(2) : '---'}</td>
            <td>${values.power ? values.power.current.toFixed(0) : '---'}</td>
            <td>${values.frequency ? values.frequency.current.toFixed(1) : '---'}</td>
            <td>${rpm}</td>
            <td>CW</td>
            <td class="result-${results.noLoad.toLowerCase()}">${results.noLoad}</td>
            <td>${values.insulationPost ? values.insulationPost.toFixed(0) : '---'}</td>
            <td class="result-${results.afterIR.toLowerCase()}">${results.afterIR}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add empty rows to match Excel format (up to 25 rows)
    const emptyRowsNeeded = Math.max(0, 25 - testResults.length);
    for (let i = 0; i < emptyRowsNeeded; i++) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td>${testResults.length + i + 1}</td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        `;
        tbody.appendChild(emptyRow);
    }
}

function saveExcelReport() {
    // Simulate Excel file generation
    const reportData = generateReportData();
    
    // Create CSV content (Excel-compatible)
    let csvContent = generateCSVContent(reportData);
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `IR_NoLoad_Test_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        updateReportStatus('Report saved as CSV file (Excel-compatible).', 'success');
    } else {
        updateReportStatus('File download not supported in this browser.', 'error');
    }
}

function generateReportData() {
    return {
        header: {
            company: 'Silver Consumer Electricals Limited',
            title: 'Insulation Resistance & No load Routine Test Reports',
            docNo: 'IR-NL-001',
            rev: '01',
            date: new Date().toLocaleDateString('en-GB')
        },
        testSettings: testSettings,
        testResults: testResults.map((test, index) => {
            const values = test.testValues || currentTestValues;
            return {
                srNo: index + 1,
                date: test.startTime ? test.startTime.toLocaleDateString('en-GB') : '',
                time: test.startTime ? test.startTime.toLocaleTimeString('en-GB') : '',
                serialNumber: test.serialNumber || '',
                finalResult: test.results.final,
                insulationPre: values.insulationPre ? values.insulationPre.toFixed(0) : '',
                beforeIRResult: test.results.beforeIR,
                voltage: values.voltage ? values.voltage.current.toFixed(1) : '',
                current: values.current ? values.current.current.toFixed(2) : '',
                power: values.power ? values.power.current.toFixed(0) : '',
                frequency: values.frequency ? values.frequency.current.toFixed(1) : '',
                rpm: values.frequency ? (values.frequency.current * 60 / 2 * 0.95).toFixed(0) : '',
                direction: 'CW',
                noLoadResult: test.results.noLoad,
                insulationPost: values.insulationPost ? values.insulationPost.toFixed(0) : '',
                afterIRResult: test.results.afterIR
            };
        })
    };
}

function generateCSVContent(reportData) {
    let csv = '';
    
    // Header
    csv += `${reportData.header.company}\n`;
    csv += `${reportData.header.title}\n`;
    csv += `Doc No: ${reportData.header.docNo}, Rev: ${reportData.header.rev}, Date: ${reportData.header.date}\n\n`;
    
    // Test Settings
    csv += `Test Settings\n`;
    csv += `IR Test Time (sec): ${reportData.testSettings.irTestTime}\n`;
    csv += `Min Insulation Resistance (MΩ): ${reportData.testSettings.minInsulationResistance}\n`;
    csv += `Voltage Range (V): ${reportData.testSettings.voltageMinLimit} - ${reportData.testSettings.voltageMaxLimit}\n`;
    csv += `Current Range (A): ${reportData.testSettings.currentMinLimit} - ${reportData.testSettings.currentMaxLimit}\n\n`;
    
    // Table Headers
    csv += 'Sr No,Date,Time,Serial No,Final Result,Insulation Pre (MΩ),Before IR Result,Voltage (V),Current (A),Power (W),Frequency (Hz),RPM,Direction,No Load Result,Insulation Post (MΩ),After IR Result\n';
    
    // Test Data
    reportData.testResults.forEach(test => {
        csv += `${test.srNo},${test.date},${test.time},${test.serialNumber},${test.finalResult},${test.insulationPre},${test.beforeIRResult},${test.voltage},${test.current},${test.power},${test.frequency},${test.rpm},${test.direction},${test.noLoadResult},${test.insulationPost},${test.afterIRResult}\n`;
    });
    
    return csv;
}

function printExcelReport() {
    // Hide non-printable elements
    const elementsToHide = document.querySelectorAll('.report-actions, .report-status, .main-nav, .app-header');
    elementsToHide.forEach(el => el.style.display = 'none');
    
    // Print
    window.print();
    
    // Restore elements
    setTimeout(() => {
        elementsToHide.forEach(el => el.style.display = '');
        updateReportStatus('Report sent to printer.', 'success');
    }, 1000);
}

function exportPdfReport() {
    // Simulate PDF export
    updateReportStatus('PDF export functionality would be implemented with a PDF library in production.', 'error');
    
    // In production, you would use libraries like jsPDF or Puppeteer
    // For demo purposes, we'll show what would happen
    setTimeout(() => {
        updateReportStatus('Demo: PDF would be generated and downloaded in a real system.', 'success');
    }, 2000);
}

function clearExcelReport() {
    if (confirm('Are you sure you want to clear the report? This will remove all test data.')) {
        // Clear test results
        testResults = [];
        
        // Clear table
        const tbody = document.getElementById('reportExcelTableBody');
        if (tbody) {
            tbody.innerHTML = '';
        }
        
        // Reset statistics
        statistics = {
            totalProduction: 0,
            beforeIR: { pass: 0, fail: 0 },
            noLoad: { pass: 0, fail: 0 },
            afterIR: { pass: 0, fail: 0 }
        };
        updateStatisticsDisplay();
        
        // Clear dashboard table
        clearTestResultsTable();
        
        // Disable action buttons
        document.getElementById('saveReportBtn').disabled = true;
        document.getElementById('printReportBtn').disabled = true;
        document.getElementById('exportPdfBtn').disabled = true;
        
        updateReportStatus('Report cleared. All test data has been removed.', 'success');
    }
}

function updateReportStatus(message, type = 'info') {
    const statusElement = document.getElementById('reportStatus');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `report-status ${type}`;
    }
}

// Update existing report generation to work with new system
function generateDetailedTestReport() {
    // This function is called after each test
    // We'll just update the status to indicate a new test is available
    updateReportStatus(`New test completed. ${testResults.length} tests available for report generation.`, 'info');
}
function populateDashboardTableWithDummyData() {
    const tbody = document.getElementById('testResultsTableBody');
    if (!tbody) return;
    
    testResults.forEach((test, index) => {
        const row = document.createElement('tr');
        const results = test.results;
        const values = test.testValues;
        
        // Calculate RPM from frequency (assuming 4-pole motor)
        const rpm = values.frequency ? (values.frequency.current * 60 / 2 * 0.95).toFixed(0) : '---';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${test.startTime.toLocaleDateString('en-GB')}</td>
            <td>${test.startTime.toLocaleTimeString('en-GB')}</td>
            <td>${test.serialNumber}</td>
            <td>${values.insulationPre.toFixed(0)}</td>
            <td class="result-${results.beforeIR.toLowerCase()}">${results.beforeIR}</td>
            <td>${values.voltage.current.toFixed(1)}</td>
            <td>${values.current.current.toFixed(2)}</td>
            <td>${values.power.current.toFixed(0)}</td>
            <td>${values.frequency.current.toFixed(1)}</td>
            <td class="result-${results.noLoad.toLowerCase()}">${results.noLoad}</td>
            <td>${values.insulationPost.toFixed(0)}</td>
            <td class="result-${results.afterIR.toLowerCase()}">${results.afterIR}</td>
            <td class="result-${results.final.toLowerCase()}">${results.final}</td>
        `;
        
        tbody.appendChild(row);
    });
}
// Import Data Functions
function handleFileSelection() {
    const fileInput = document.getElementById('masterDataFile');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (fileInput.files.length > 0) {
        uploadBtn.textContent = 'Process File';
        updateImportStatus(`File selected: ${fileInput.files[0].name}`, 'info');
    } else {
        uploadBtn.textContent = 'Upload';
        updateImportStatus('No file selected.', 'error');
    }
}

function handleFileUpload() {
    const fileInput = document.getElementById('masterDataFile');
    
    if (fileInput.files.length === 0) {
        updateImportStatus('Please select a file first.', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const fileName = file.name.toLowerCase();
    
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx')) {
        updateImportStatus('Please select a CSV or Excel file.', 'error');
        return;
    }
    
    // Simulate file processing for demo
    updateImportStatus('Processing file...', 'info');
    
    setTimeout(() => {
        updateImportStatus('Demo: File processing would be implemented in production.', 'success');
    }, 2000);
}

function updateImportStatus(message, type = 'info') {
    // This function would update import status display
    console.log(`Import Status (${type}): ${message}`);
}