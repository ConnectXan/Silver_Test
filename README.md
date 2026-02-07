# PMSM Motor Testing System – Demo Application

## Overview

This project is a desktop demonstration application that simulates an automated **Permanent Magnet Synchronous Motor (PMSM)** testing station. It replicates an industrial workflow including insulation resistance testing, no-load VFD testing, real-time monitoring, and professional reporting.

The application is intended for **demonstrations, prototyping, client presentations, and system design validation**, not direct production deployment.

---

## Key Features

### Role-Based Access Control

* **Operator**: Run tests, view reports, limited system configuration
* **Supervisor**: Full control including settings, user management, and history access

### Automated Test Sequence

1. Pre-run insulation resistance (IR) test
2. VFD no-load operational test
3. Post-run IR verification

This sequence reflects typical industrial motor quality validation procedures.

### Real-Time Monitoring

* Live voltage, current, power, frequency, and insulation resistance
* Status indicators for connected equipment
* Automatic min/max parameter tracking
* Industrial-style monitoring interface

### Reporting and Export

* Excel-compatible CSV export
* Print-ready formatted reports
* Color-coded PASS/FAIL indicators
* Complete parameter logging with timestamps

### Demonstration Utilities

* Guaranteed PASS test simulation
* Controlled FAIL scenarios
* Equipment status simulation
* Preloaded sample test data

---

## Installation and Startup

### Requirements

* Node.js version 16 or higher
* npm package manager
* Modern browser (Chrome, Edge, Firefox recommended)

### Setup

Install dependencies:

```
npm install
```

Run desktop Electron version:

```
npm start
```

Run web version:

```
npm run web
```

Then open:

```
http://localhost:3000
```

---

## Demo Credentials

| Role       | Username | Password |
| ---------- | -------- | -------- |
| Operator   | user     | pass     |
| Supervisor | admin    | admin    |

---

## Typical Demo Workflow

### Successful Test Demonstration

1. Log in as operator
2. Select a motor model
3. Enter a serial number
4. Run the PASS demo test
5. Review real-time dashboard
6. Generate export report

### Failure Scenario Demonstration

1. Use FAIL demo option
2. Observe parameter violations
3. Review failure indicators
4. Export diagnostic report

### System Status Simulation

* Toggle equipment status to demonstrate monitoring behavior
* Indicators automatically reset after simulation

---

## Technical Specifications

### Parameters Monitored

* Insulation resistance
* Voltage
* Current
* Power
* Frequency
* Motor speed (calculated)

### Test Timing

* IR pre-test: configurable (default 5s)
* VFD no-load test: ~12s
* IR post-test: configurable (default 5s)

Total simulated test duration: approximately 20–25 seconds.

---

## Project Structure

```
pmsm-motor-testing-demo/
├── src/
│   ├── main.js
│   ├── index.html
│   ├── web-main.js
│   ├── js/app.js
│   └── styles/
│       ├── main.css
│       └── components.css
├── web-server.js
├── package.json
├── start.bat
├── start-web.bat
├── README.md
└── DEMO_GUIDE.md
```

---

## Customization

### Test Limits

Edit configuration in:

```
src/js/app.js
```

Modify parameters such as insulation resistance limits, voltage range, current thresholds, and timing.

### Motor Models

Update the model selection list in:

```
src/index.html
```

### Visual Styling

Adjust CSS variables in:

```
src/styles/main.css
```

---

## Production Integration Guidance

This demo can be extended for industrial deployment with:

* PLC or industrial controller integration
* VFD communication via Modbus or Ethernet
* IR tester (Megger) communication interfaces
* Barcode/QR scanner integration
* Centralized SQL or cloud database storage
* MES or ERP connectivity

---

## Performance Requirements

Minimum:

* Dual-core CPU
* 4 GB RAM
* 1 GB storage

Recommended:

* 8 GB RAM
* Dedicated Ethernet for multi-station setups

---

## Troubleshooting

| Issue                 | Resolution                      |
| --------------------- | ------------------------------- |
| Electron not starting | Run `npm install` first         |
| Port conflict         | Change port in `web-server.js`  |
| Missing modules       | Verify Node.js installation     |
| Tests not starting    | Confirm model and serial inputs |

---

## Intended Audience

* Factory automation teams
* Quality assurance engineers
* System integrators
* Clients evaluating automated motor testing solutions

---

## License

MIT License.

---

## Important Note

This software simulates industrial testing workflows. Production deployment requires hardware integration, validation, safety compliance, and enterprise data infrastructure.
