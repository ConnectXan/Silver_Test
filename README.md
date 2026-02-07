# PMSM Motor Testing System - Complete Demo Application

## 🏭 Professional Industrial Motor Testing Solution

A comprehensive desktop demo application for automated PMSM (Permanent Magnet Synchronous Motor) testing that simulates a complete factory testing station with IR (Insulation Resistance) and VFD (Variable Frequency Drive) No Load testing capabilities.

## ✨ Key Features

### 🔐 **Role-Based Access Control**
- **Operator Access**: Run tests, view reports, limited configuration
- **Supervisor Access**: Full system management, test limits, user management, complete history

### 🎯 **Automated Test Sequence**
1. **IR Test (Pre-Run)** - Insulation resistance measurement before motor operation
2. **VFD No Load Test** - Complete motor parameter monitoring under no-load conditions
3. **IR Test (Post-Run)** - Final insulation verification after motor operation

### 📊 **Real-Time Monitoring Dashboard**
- **Status Indicators**: Green/Red status for all system components
- **Live Parameters**: Voltage, Current, Power, Frequency, Insulation Resistance
- **Min/Max Tracking**: Automatic recording of parameter extremes
- **Professional UI**: Industrial-grade interface matching factory standards

### 📋 **Excel-Style Reporting**
- **Professional Format**: Matches industrial Excel templates exactly
- **Complete Data**: All test parameters, results, and settings
- **Export Options**: CSV (Excel-compatible), Print, PDF capability
- **Color-Coded Results**: Green for PASS, Red for FAIL

### 🎮 **Demo Functionality**
- **Demo PASS Test**: Guaranteed passing test with realistic parameters
- **Demo FAIL Test**: Controlled failure scenarios for demonstration
- **Status Toggle**: Simulate equipment connection issues
- **Sample Data**: 3 pre-loaded test records for immediate demonstration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm package manager
- Modern web browser (Chrome, Firefox, Edge)

### Installation & Launch

```bash
# 1. Install dependencies
npm install

# 2. Start desktop application (Electron)
npm start
# OR double-click: start.bat

# 3. Alternative: Start web version
npm run web
# OR double-click: start-web.bat
# Then open: http://localhost:3000
```

## 🔑 Demo Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Operator** | `user` | `pass` | Testing & Reports |
| **Supervisor** | `admin` | `admin` | Full System Access |

## 📖 User Guide

### For Operators

1. **Login** with operator credentials (user/pass)
2. **Select Motor Model** from dropdown (PMSM-1500, PMSM-3000, PMSM-5500)
3. **Enter Serial Number** or simulate QR scan
4. **Run Tests**:
   - Click "Demo PASS Test" for successful test
   - Click "Demo FAIL Test" for failure scenario
   - Or use "START TEST" for manual testing
5. **View Results** in real-time dashboard and reports

### For Supervisors

**All operator functions plus:**
- **Configure Test Limits**: IR test time, voltage/current/power ranges
- **User Management**: Add/remove operators (demo interface)
- **View Complete History**: All test records with detailed parameters
- **System Settings**: Modify all test parameters and thresholds

## 🎯 Demo Scenarios

### Scenario 1: Successful Test Demo
```
1. Login as operator (user/pass)
2. Select "PMSM-1500" model
3. Enter serial "DEMO001"
4. Click "Demo PASS Test"
5. Watch automated sequence (IR → VFD → IR)
6. View green PASS results
7. Go to Reports → Generate Report → Save as Excel
```

### Scenario 2: Failure Analysis Demo
```
1. Use same setup as above
2. Click "Demo FAIL Test"
3. Observe red FAIL indicators
4. Note specific failure reasons (low IR, high current, etc.)
5. Generate report showing failure analysis
```

### Scenario 3: System Status Demo
```
1. Click "STATUS" button to simulate equipment issues
2. Watch status indicators turn red
3. Demonstrate system monitoring capabilities
4. Status auto-restores after 5 seconds
```

## 📊 Technical Specifications

### Test Parameters Monitored
- **Insulation Resistance**: 0-2000 MΩ (configurable limits)
- **Voltage**: 180-260V range (configurable)
- **Current**: 0-15A (configurable maximum)
- **Power**: 0-5000W (calculated from V×I×PF)
- **Frequency**: 45-55Hz range (configurable)
- **Speed**: Calculated from frequency with motor slip

### Test Sequence Timing
- **IR Pre-Test**: 5 seconds (configurable 1-30s)
- **VFD No Load Test**: 12 seconds
- **IR Post-Test**: 5 seconds
- **Total Test Time**: ~22 seconds

### Report Generation
- **Excel Format**: Professional CSV export
- **Print Ready**: Optimized print layouts
- **Complete Data**: All parameters, limits, and results
- **Audit Trail**: Date, time, operator, serial numbers

## 🏗️ Project Structure

```
pmsm-motor-testing-demo/
├── src/
│   ├── main.js              # Electron main process
│   ├── index.html           # Main application UI
│   ├── web-main.js          # Web version compatibility
│   ├── js/
│   │   └── app.js          # Complete application logic
│   └── styles/
│       ├── main.css        # Core styles & layout
│       └── components.css  # UI components & report styles
├── package.json             # Dependencies & scripts
├── web-server.js           # Development web server
├── start.bat               # Windows desktop launcher
├── start-web.bat           # Windows web launcher
├── README.md               # This documentation
└── DEMO_GUIDE.md          # Detailed demo instructions
```

## 🔧 Customization

### Modifying Test Parameters
Edit `testSettings` object in `src/js/app.js`:
```javascript
let testSettings = {
    irTestTime: 5,                    // IR test duration (seconds)
    minInsulationResistance: 100,     // Minimum IR (MΩ)
    maxInsulationResistance: 1000,    // Maximum IR (MΩ)
    voltageMinLimit: 200,             // Minimum voltage (V)
    voltageMaxLimit: 240,             // Maximum voltage (V)
    // ... other parameters
};
```

### Adding Motor Models
Update dropdown in `src/index.html`:
```html
<select id="modelSelect">
    <option value="PMSM-1500">PMSM-1500</option>
    <option value="PMSM-3000">PMSM-3000</option>
    <option value="YOUR-MODEL">YOUR-MODEL</option>
</select>
```

### Styling Customization
Modify CSS variables in `src/styles/main.css`:
```css
:root {
    --primary-color: #2563eb;    /* Main brand color */
    --success-color: #16a34a;    /* Pass status color */
    --danger-color: #dc2626;     /* Fail status color */
}
```

## 🏭 Production Integration

### Hardware Integration Points
- **Megger Integration**: RS-485/Modbus communication
- **VFD Communication**: Ethernet/Modbus TCP
- **Sensor Inputs**: Analog/digital I/O modules
- **QR Scanner**: USB/Serial barcode readers
- **PLC Integration**: Industrial automation protocols

### Database Integration
- **SQL Server/MySQL**: Production data storage
- **MES Integration**: Manufacturing execution systems
- **ERP Connectivity**: Enterprise resource planning
- **Cloud Storage**: Remote data backup and analysis

## 📈 Performance & Scalability

### System Requirements
- **CPU**: Dual-core 2GHz minimum
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB for application, additional for data
- **Network**: Ethernet for multi-station deployment

### Multi-Station Deployment
- **Centralized Database**: Shared test data across stations
- **Remote Monitoring**: Supervisor oversight from office
- **Statistical Analysis**: Quality trends and SPC charts
- **Backup & Recovery**: Automated data protection

## 🛠️ Troubleshooting

### Common Issues
| Issue | Solution |
|-------|----------|
| Port 3000 in use | Change port in `web-server.js` |
| Electron won't start | Run `npm install` first |
| Missing dependencies | Ensure Node.js is installed |
| Test won't start | Check model and serial number fields |

### Performance Tips
- Close unnecessary applications for smooth animation
- Use Chrome/Edge for best web browser compatibility
- Enable hardware acceleration for better graphics
- Use full-screen mode for professional presentations

## 📞 Support & Documentation

### Demo Instructions
- See `DEMO_GUIDE.md` for detailed demonstration procedures
- Use provided credentials for immediate access
- Sample data included for instant functionality

### Technical Support
- Check console (F12) for JavaScript errors
- Verify all files are present and accessible
- Ensure proper file permissions for downloads

## 📄 License

MIT License - See LICENSE file for details.

## 🎯 Target Audience

- **Factory Managers**: Demonstrate automation benefits
- **Quality Engineers**: Show testing capabilities and reporting
- **Automation Specialists**: Technical implementation details
- **Clients & Stakeholders**: Professional system demonstration

---

**Note**: This is a demonstration application designed to showcase automated motor testing concepts. For production deployment, integrate with actual hardware controllers, measurement systems, and enterprise databases.

## 🚀 Ready to Demo!

The application is now complete with:
- ✅ Professional industrial interface
- ✅ Complete test automation simulation
- ✅ Excel-style reporting with export
- ✅ Role-based access control
- ✅ Sample data for immediate demonstration
- ✅ Comprehensive documentation

**Start your demonstration in under 30 seconds!**#   S i l v e r _ T e s t  
 