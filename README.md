# 🔒 CyberWatch - Live Cybersecurity Dashboard

A real-time cybersecurity monitoring dashboard that visualizes network threats, attack patterns, and security events with stunning visual effects and interactive features.

![Dashboard Preview](https://via.placeholder.com/800x400/0a0e1a/00d4ff?text=CyberWatch+Dashboard)

## 🚀 Features

### Real-Time Monitoring
- **Live Attack Feed**: Real-time stream of security events and threats
- **Interactive World Map**: Geographic visualization of attack origins with risk-based markers
- **Dynamic Charts**: Live firewall activity and threat analytics
- **Attack Mode Toggle**: Simulate high-intensity attack scenarios

### Visual Analytics
- **Threat Level Indicators**: Color-coded risk assessment system
- **Geographic Attack Mapping**: Leaflet.js powered world map with attack markers
- **Real-Time Charts**: Chart.js powered analytics with multiple timeframes
- **Responsive Design**: Optimized for desktop and mobile viewing

### Security Intelligence
- **Top Attackers Table**: Detailed breakdown of threat sources
- **Attack Type Classification**: Brute force, DDoS, malware, SQL injection detection
- **Risk Assessment**: Automated threat level calculation
- **Country-Based Analytics**: Geographic threat intelligence

## 🛠 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript | Core dashboard interface |
| **Visualization** | Chart.js, D3.js, Leaflet.js | Interactive charts and maps |
| **Backend** | Node.js, Express | API server and WebSocket handling |
| **Real-Time** | WebSocket | Live data streaming |
| **Styling** | CSS Grid, Flexbox | Responsive layout system |

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/live-cybersecurity-dashboard.git
cd live-cybersecurity-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at `http://localhost:3001` with the WebSocket server running on port `3000`.

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎮 Usage

### Dashboard Features

#### 1. **Attack Mode Toggle**
- Switch between normal and high-intensity attack simulation
- Increases threat frequency and severity
- Triggers visual alerts and notifications

#### 2. **Interactive Map**
- Click on attack markers for detailed information
- Color-coded risk levels (Red: High, Orange: Medium, Green: Low)
- Real-time attack origin tracking

#### 3. **Live Feed Controls**
- Pause/Resume attack feed
- Clear feed history
- Filter by attack type

#### 4. **Chart Analytics**
- Multiple timeframe views (1H, 6H, 24H)
- Firewall activity monitoring
- Blocked vs. allowed requests

### API Endpoints

```javascript
// Get server status
GET /api/status

// Get current statistics
GET /api/stats

// Get attack data
GET /api/attacks

// Toggle attack mode
POST /api/attack-mode
{
  "enabled": true
}
```

### WebSocket Events

```javascript
// Connection established
{
  "type": "connection_established",
  "message": "Connected to CyberWatch Security Server"
}

// New attack event
{
  "type": "attack_event",
  "event": {
    "title": "Brute Force Attack Detected",
    "details": "Source: 192.168.1.100 (Russia)",
    "risk": "high",
    "type": "brute_force"
  }
}

// Statistics update
{
  "type": "stats_update",
  "stats": {
    "activeThreats": 15,
    "blockedIPs": 127,
    "countries": 12
  }
}
```

## 🎨 Customization

### Color Scheme
The dashboard uses CSS custom properties for easy theming:

```css
:root {
    --primary-bg: #0a0e1a;
    --secondary-bg: #1a1f2e;
    --accent-color: #00d4ff;
    --danger-color: #ff4757;
    --warning-color: #ffa502;
    --success-color: #2ed573;
}
```

### Adding New Attack Types
1. Update the `attackTypes` array in `server/server.js`
2. Add corresponding icons in `dashboard.js`
3. Update the filter dropdown in `index.html`

### Custom Map Markers
Modify the `getRiskColor()` and `getRiskSize()` functions in `map.js` to customize marker appearance.

## 📊 Data Sources

### Simulated Data
The dashboard generates realistic cybersecurity data including:
- **IP Addresses**: RFC 1918 private ranges and documentation IPs
- **Geographic Data**: Major countries known for cyber activity
- **Attack Patterns**: Based on real-world threat intelligence
- **Timing**: Realistic attack frequency and clustering

### Real Data Integration
To connect real data sources:

1. **SIEM Integration**: Modify WebSocket handlers to accept external data
2. **Log Parsing**: Add log file monitoring in the server
3. **API Integration**: Connect to threat intelligence feeds
4. **Database**: Add persistent storage for historical data

## 🚀 Deployment

### Netlify (Frontend)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=public
```

### Heroku (Full Stack)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Development

### Project Structure
```
live-cybersecurity-dashboard/
├── public/
│   ├── index.html          # Main dashboard page
│   ├── styles/
│   │   └── main.css        # Dashboard styling
│   └── scripts/
│       ├── dashboard.js    # Main dashboard controller
│       ├── charts.js       # Chart management
│       ├── map.js          # Map visualization
│       └── websocket.js    # WebSocket client
├── server/
│   └── server.js           # Express server & WebSocket
├── package.json
└── README.md
```

### Adding New Features

1. **New Visualization**: Add to `public/scripts/` and include in `index.html`
2. **Server Endpoint**: Add routes in `server/server.js`
3. **WebSocket Event**: Update both client and server WebSocket handlers
4. **Styling**: Add CSS to `public/styles/main.css`

### Testing
```bash
# Run development server with hot reload
npm run dev

# Test WebSocket connection
wscat -c ws://localhost:3000

# Test API endpoints
curl http://localhost:3000/api/status
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** for beautiful, responsive charts
- **Leaflet.js** for interactive mapping capabilities
- **Font Awesome** for comprehensive icon library
- **CARTO** for dark theme map tiles
- **Cybersecurity Community** for threat intelligence insights

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/live-cybersecurity-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/live-cybersecurity-dashboard/discussions)
- **Email**: your.email@example.com

---

**⚠️ Disclaimer**: This dashboard is for educational and demonstration purposes. The attack data is simulated and should not be used for actual security monitoring without proper validation and real data sources.