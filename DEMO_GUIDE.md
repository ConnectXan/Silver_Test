# PMSM Motor Testing System - IR & VFD No Load Demo Guide

## Updated Application Overview

The application has been updated to strictly match the client's "IR With VFD No Load Routine Test Report" format, featuring:

- **Exact Test Sequence**: IR Pre-Run → VFD No Load Test → IR Post-Run
- **Complete Parameter Tracking**: All values with min/max monitoring
- **Professional Report Format**: Matches Excel routine test report layout
- **Configurable Test Settings**: IR test time, limits, and thresholds

## Quick Start Options

### Option 1: Desktop Application (Recommended)
```bash
# Install dependencies (first time only)
npm install

# Start desktop app
npm start
# OR double-click: start.bat
```

### Option 2: Web Browser Version
```bash
# Start web server
npm run web
# OR double-click: start-web.bat
# Then open: http://localhost:3000
```

## Demo Walkthrough

### 1. Login Screen
**Credentials Available:**
- **Operator**: `user` / `pass` (Limited access)
- **Supervisor**: `admin` / `admin` (Full access)

### 2. Operator Demo Flow

#### Step 1: Login as Operator
- Username: `user`
- Password: `pass`
- Role: Operator

#### Step 2: Motor Information Setup
**Required Fields:**
- **Model Number**: Enter motor model (e.g., `PMSM-1500-3P`)
- **Phase**: Select `1 Phase` or `3 Phase` (default: 3 Phase)
- **Direction**: Select `CW` or `CCW` (default: CW)
- **Motor Serial Number**: Enter or simulate QR scan (e.g., `MTR2024001`)

#### Step 3: Start IR & No Load Test
- Click **Start IR & No Load Test** (enabled when all fields filled)
- Watch the automated 3-step sequence

#### Step 4: Automated Test Sequence

**Step 1: Insulation Resistance Test - Pre Run** (~5 seconds)
- IR test time configurable in settings (default: 5 seconds)
- Watch insulation resistance values change dynamically
- Values should stabilize within 100-1000 MΩ range
- Real-time PASS/FAIL evaluation

**Step 2: No Load Test (VFD Run)** (~12 seconds)
- All parameters update in real-time with min/max tracking:
  - **Voltage**: ~220V ±10V (tracks min/max values)
  - **Current**: Ramps up to ~4.8A (tracks min/max values)
  - **Power**: Calculated from V×I×PF (~800-1200W)
  - **Frequency**: Stable at 50Hz ±0.5Hz
  - **Speed**: Calculated from frequency (~1450-1500 RPM)
- Each parameter shows current, minimum, and maximum values

**Step 3: Insulation Resistance Test - Post Run** (~5 seconds)
- Final insulation check after motor run
- Values should remain within acceptable range
- Comparison with pre-run values

#### Step 5: View Comprehensive Results
- **Real-time Result Display**: Shows PASS/FAIL for each test phase
- **Final Result**: Overall PASS/FAIL determination
- **Automatic Report Generation**: Complete test report with all parameters
- **Report Switch**: Automatically switches to Reports tab

### 3. Supervisor Demo Flow

#### Step 1: Login as Supervisor
- Username: `admin`
- Password: `admin`
- Role: Supervisor

#### Step 2: Explore Enhanced Features

**Settings Tab - IR Test Configuration:**
- **IR Test Time**: Adjustable from 1-30 seconds (default: 5)
- **Min Insulation Resistance**: Configurable limit (default: 100 MΩ)
- **Max Insulation Resistance**: Configurable limit (default: 1000 MΩ)

**Settings Tab - No Load Test Limits:**
- **Voltage Range**: Min/Max limits (default: 200-240V)
- **Current Max**: Maximum allowable current (default: 8A)
- **Power Max**: Maximum allowable power (default: 2000W)
- **Frequency Range**: Min/Max limits (default: 49-51Hz)
- **Speed Range**: Min/Max limits (default: 1400-1600 RPM)

**History Tab:**
- View complete test history with enhanced data
- All parameters tracked: V, A, W, Hz, RPM, IR values
- Filter and search capabilities
- Individual report viewing

**All Operator Features:**
- Complete access to testing functions
- Enhanced reporting and analysis tools

## Key Demo Points to Highlight

### 🎯 **Exact Client Format Compliance**
- **Report Title**: "Insulation Resistance & No Load Routine Test Report"
- **Parameter Layout**: Matches Excel format exactly
- **Test Sequence**: IR Pre → VFD No Load → IR Post
- **Min/Max Tracking**: All parameters monitored continuously

### 📊 **Enhanced Parameter Monitoring**
- **Real-Time Values**: Live updating during test
- **Min/Max Tracking**: Automatic recording of extremes
- **Multiple Units**: V, A, W, Hz, RPM, MΩ as specified
- **Limit Checking**: Automatic comparison against thresholds

### 🔧 **Configurable Test Settings**
- **IR Test Duration**: Adjustable test time
- **Flexible Limits**: All thresholds configurable
- **Motor Types**: Support for 1-phase and 3-phase
- **Direction Control**: CW/CCW motor testing

### 📋 **Professional Reporting**
- **Excel-Style Layout**: Matches client format exactly
- **Complete Parameter Table**: All values with limits
- **Test Summary**: Clear PASS/FAIL for each phase
- **Audit Trail**: Complete test documentation

### ⚡ **VFD Integration Simulation**
- **Realistic Parameters**: Motor characteristics simulation
- **Power Calculations**: V×I×PF with realistic power factor
- **Speed Calculation**: Based on frequency with slip
- **Dynamic Response**: Realistic ramp-up and stabilization

## Simulated Test Parameters

### IR Test Settings (Configurable)
- **Test Time**: 1-30 seconds (default: 5)
- **Min Resistance**: 1-999 MΩ (default: 100)
- **Max Resistance**: 100-2000 MΩ (default: 1000)

### VFD No Load Test Limits (Configurable)
- **Voltage**: 180-260V range (default: 200-240V)
- **Current**: 0-15A max (default: 8A max)
- **Power**: 0-5000W max (default: 2000W max)
- **Frequency**: 45-55Hz range (default: 49-51Hz)
- **Speed**: 1000-2000 RPM range (default: 1400-1600 RPM)

## Report Format Demonstration

### Header Information
- Report Title: "Insulation Resistance & No Load Routine Test Report"
- Model Number, Phase, Direction, Serial Number
- Date & Time, Operator information

### IR Test Results Table
| Test Phase | Measured Value (MΩ) | Min Limit (MΩ) | Max Limit (MΩ) | Result |
|------------|-------------------|----------------|----------------|---------|
| Pre-Run    | 520               | 100            | 1000           | PASS    |
| Post-Run   | 480               | 100            | 1000           | PASS    |

### No Load Test Results Table
| Parameter | Min Value | Max Value | Final Value | Unit | Limit Check |
|-----------|-----------|-----------|-------------|------|-------------|
| Voltage   | 218.5     | 225.2     | 220.1       | V    | 200-240V    |
| Current   | 0.0       | 4.85      | 4.82        | A    | Max 8A      |
| Power     | 0         | 1050      | 1048        | W    | Max 2000W   |
| Frequency | 49.8      | 50.2      | 50.0        | Hz   | 49-51Hz     |
| Speed     | 1445      | 1502      | 1500        | RPM  | 1400-1600   |

## Customization Examples

### Modifying IR Test Settings
```javascript
// In supervisor settings
testSettings.irTestTime = 10; // 10 seconds
testSettings.minInsulationResistance = 200; // 200 MΩ minimum
testSettings.maxInsulationResistance = 800; // 800 MΩ maximum
```

### Adjusting VFD Test Limits
```javascript
// No load test limits
testSettings.voltageMinLimit = 210; // 210V minimum
testSettings.voltageMaxLimit = 230; // 230V maximum
testSettings.currentMaxLimit = 6; // 6A maximum
testSettings.powerMaxLimit = 1500; // 1500W maximum
```

## Production Integration Points

### Hardware Interfaces
- **Megger Integration**: Real IR test equipment connection
- **VFD Communication**: Modbus/Ethernet to VFD controller
- **Sensor Inputs**: Voltage, current, power measurement devices
- **QR Scanner**: Barcode/QR code reading hardware
- **PLC Integration**: Factory automation system connection

### Data Management
- **Database Storage**: SQL Server/MySQL integration
- **MES Integration**: Manufacturing execution system connection
- **Report Export**: PDF generation and network storage
- **Audit Logging**: Complete traceability system

## Troubleshooting

### Common Demo Issues
- **Test Won't Start**: Ensure all motor information fields are filled
- **Parameters Not Updating**: Check browser console for JavaScript errors
- **Settings Not Saving**: Verify localStorage is enabled in browser
- **Report Not Generating**: Complete a full test sequence first

### Performance Optimization
- **Smooth Animation**: Close unnecessary browser tabs
- **Real-time Updates**: Use Chrome/Edge for best performance
- **Full Screen**: F11 for immersive demo experience

---

**Demo Duration**: 8-12 minutes per role
**Best Presentation**: Desktop application in full-screen mode
**Target Audience**: Quality engineers, test technicians, factory automation specialists
**Key Message**: Exact compliance with client test report format and procedures