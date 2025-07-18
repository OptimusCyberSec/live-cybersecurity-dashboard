const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

class CyberSecurityServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.clients = new Set();
        this.attackMode = false;
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.startDataGeneration();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    setupRoutes() {
        // API Routes
        this.app.get('/api/status', (req, res) => {
            res.json({
                status: 'online',
                uptime: process.uptime(),
                attackMode: this.attackMode,
                connectedClients: this.clients.size,
                timestamp: new Date().toISOString()
            });
        });

        this.app.get('/api/stats', (req, res) => {
            res.json(this.generateStats());
        });

        this.app.get('/api/attacks', (req, res) => {
            res.json(this.generateAttackData());
        });

        this.app.post('/api/attack-mode', (req, res) => {
            this.attackMode = req.body.enabled || false;
            this.broadcastToClients({
                type: 'attack_mode_changed',
                enabled: this.attackMode
            });
            res.json({ success: true, attackMode: this.attackMode });
        });

        // Serve main page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            console.log('New WebSocket connection from:', req.socket.remoteAddress);
            this.clients.add(ws);

            // Send welcome message
            ws.send(JSON.stringify({
                type: 'connection_established',
                message: 'Connected to CyberWatch Security Server',
                timestamp: new Date().toISOString()
            }));

            // Handle messages from client
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleClientMessage(ws, data);
                } catch (error) {
                    console.error('Error parsing client message:', error);
                }
            });

            // Handle client disconnect
            ws.on('close', () => {
                console.log('Client disconnected');
                this.clients.delete(ws);
            });

            // Handle errors
            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                this.clients.delete(ws);
            });
        });
    }

    handleClientMessage(ws, data) {
        switch (data.type) {
            case 'attack_mode':
                this.attackMode = data.enabled;
                this.broadcastToClients({
                    type: 'attack_mode_changed',
                    enabled: this.attackMode
                });
                break;
            case 'ping':
                ws.send(JSON.stringify({
                    type: 'pong',
                    timestamp: new Date().toISOString()
                }));
                break;
            case 'client_connected':
                // Send initial data to new client
                ws.send(JSON.stringify({
                    type: 'initial_data',
                    stats: this.generateStats(),
                    attacks: this.generateAttackData()
                }));
                break;
        }
    }

    broadcastToClients(data) {
        const message = JSON.stringify(data);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    startDataGeneration() {
        // Generate attack events
        setInterval(() => {
            this.generateAttackEvent();
        }, this.attackMode ? 2000 : 5000);

        // Generate stats updates
        setInterval(() => {
            this.broadcastStats();
        }, 10000);

        // Generate chart data
        setInterval(() => {
            this.generateChartData();
        }, 3000);

        // Cleanup old data
        setInterval(() => {
            this.cleanupData();
        }, 60000);
    }

    generateAttackEvent() {
        const attackTypes = ['brute_force', 'ddos', 'malware', 'sql_injection', 'port_scan', 'intrusion'];
        const riskLevels = ['low', 'medium', 'high'];
        const countries = [
            { name: 'Russia', coords: [55.7558, 37.6176] },
            { name: 'China', coords: [39.9042, 116.4074] },
            { name: 'North Korea', coords: [39.0392, 125.7625] },
            { name: 'Iran', coords: [35.6892, 51.3890] },
            { name: 'Brazil', coords: [-15.7942, -47.8822] },
            { name: 'India', coords: [20.5937, 78.9629] },
            { name: 'Turkey', coords: [38.9637, 35.2433] },
            { name: 'Vietnam', coords: [14.0583, 108.2772] }
        ];

        const ips = [
            '192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.15',
            '198.51.100.8', '192.0.2.146', '203.0.113.73', '198.51.100.42',
            '172.16.254.1', '10.0.0.1', '192.168.0.1', '203.0.113.1'
        ];

        // Skip some events in normal mode
        if (!this.attackMode && Math.random() < 0.3) return;

        const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const ip = ips[Math.floor(Math.random() * ips.length)];
        let risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

        // Increase high-risk events in attack mode
        if (this.attackMode && Math.random() < 0.7) {
            risk = 'high';
        }

        const event = {
            title: `${this.formatAttackType(type)} Attack Detected`,
            details: `Source: ${ip} (${country.name})`,
            risk: risk,
            type: type,
            timestamp: new Date().toISOString()
        };

        const attacker = {
            ip: ip,
            country: country.name,
            type: type,
            attempts: Math.floor(Math.random() * 100) + 1,
            risk: risk
        };

        const location = {
            lat: country.coords[0] + (Math.random() - 0.5) * 10,
            lng: country.coords[1] + (Math.random() - 0.5) * 10,
            country: country.name,
            risk: risk,
            type: type
        };

        // Broadcast to all clients
        this.broadcastToClients({
            type: 'attack_event',
            event: event,
            attacker: attacker
        });

        this.broadcastToClients({
            type: 'map_update',
            location: location
        });
    }

    generateStats() {
        const baseThreats = this.attackMode ? 25 : 5;
        const baseBlocked = this.attackMode ? 150 : 30;
        
        return {
            activeThreats: Math.floor(Math.random() * baseThreats) + (this.attackMode ? 15 : 2),
            blockedIPs: Math.floor(Math.random() * baseBlocked) + (this.attackMode ? 75 : 15),
            countries: Math.floor(Math.random() * 20) + 8,
            uptime: Math.floor(process.uptime())
        };
    }

    broadcastStats() {
        this.broadcastToClients({
            type: 'stats_update',
            stats: this.generateStats()
        });
    }

    generateChartData() {
        const baseBlocked = this.attackMode ? 40 : 10;
        const baseAllowed = this.attackMode ? 20 : 60;
        
        const data = {
            blocked: Math.floor(Math.random() * baseBlocked) + (this.attackMode ? 20 : 5),
            allowed: Math.floor(Math.random() * baseAllowed) + (this.attackMode ? 10 : 30),
            timestamp: new Date().toISOString()
        };

        this.broadcastToClients({
            type: 'chart_data',
            data: data
        });
    }

    generateAttackData() {
        const attacks = [];
        const attackTypes = ['brute_force', 'ddos', 'malware', 'sql_injection', 'port_scan'];
        const countries = ['Russia', 'China', 'North Korea', 'Iran', 'Brazil', 'India'];
        const ips = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.15'];

        for (let i = 0; i < 10; i++) {
            attacks.push({
                ip: ips[Math.floor(Math.random() * ips.length)],
                country: countries[Math.floor(Math.random() * countries.length)],
                type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
                attempts: Math.floor(Math.random() * 100) + 1,
                risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
            });
        }

        return attacks;
    }

    formatAttackType(type) {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    cleanupData() {
        // Cleanup logic for old data
        console.log('Cleaning up old data...');
    }

    start(port = 3000) {
        this.server.listen(port, () => {
            console.log(`🔒 CyberWatch Security Server running on port ${port}`);
            console.log(`📊 Dashboard: http://localhost:${port}`);
            console.log(`🔌 WebSocket: ws://localhost:${port}`);
            console.log(`⚡ Attack Mode: ${this.attackMode ? 'ENABLED' : 'DISABLED'}`);
        });
    }
}

// Start the server
const server = new CyberSecurityServer();
server.start(process.env.PORT || 3000);