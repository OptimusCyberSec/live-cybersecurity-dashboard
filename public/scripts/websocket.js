// WebSocket Connection Manager
class WebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnected = false;
        
        this.init();
    }

    init() {
        this.connect();
    }

    connect() {
        try {
            // Use appropriate WebSocket URL based on environment
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const hostname = window.location.hostname;
            const wsUrl = `${protocol}//${hostname}:3000`;
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.onConnect();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                this.onDisconnect();
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;
            };

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.log('Max reconnection attempts reached. Switching to simulation mode.');
            this.startSimulationMode();
        }
    }

    onConnect() {
        // Send initial connection message
        this.send({
            type: 'client_connected',
            timestamp: new Date().toISOString()
        });
    }

    onDisconnect() {
        // Handle disconnection
        console.log('Connection lost. Attempting to reconnect...');
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    handleMessage(data) {
        // Pass message to dashboard
        if (window.dashboard) {
            window.dashboard.handleWebSocketMessage(data);
        }

        // Handle specific message types
        switch (data.type) {
            case 'ping':
                this.send({ type: 'pong', timestamp: new Date().toISOString() });
                break;
            case 'server_status':
                console.log('Server status:', data.status);
                break;
            default:
                // Let dashboard handle other message types
                break;
        }
    }

    startSimulationMode() {
        console.log('Starting simulation mode...');
        
        // Simulate WebSocket messages when connection fails
        setInterval(() => {
            this.simulateAttackEvent();
        }, 3000);

        setInterval(() => {
            this.simulateStatsUpdate();
        }, 10000);
    }

    simulateAttackEvent() {
        const attackTypes = ['brute_force', 'ddos', 'malware', 'sql_injection', 'port_scan', 'intrusion'];
        const riskLevels = ['low', 'medium', 'high'];
        const countries = ['Russia', 'China', 'North Korea', 'Iran', 'Brazil', 'India', 'Turkey', 'Vietnam'];
        const ips = [
            '192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.15',
            '198.51.100.8', '192.0.2.146', '203.0.113.73', '198.51.100.42'
        ];

        const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
        
        // Skip some events in normal mode
        if (!isAttackMode && Math.random() < 0.4) return;

        const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const ip = ips[Math.floor(Math.random() * ips.length)];
        let risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

        // Increase high-risk events in attack mode
        if (isAttackMode && Math.random() < 0.6) {
            risk = 'high';
        }

        const event = {
            title: `${this.formatAttackType(type)} Attack Detected`,
            details: `Source: ${ip} (${country})`,
            risk: risk,
            type: type,
            timestamp: new Date().toISOString()
        };

        const attacker = {
            ip: ip,
            country: country,
            type: type,
            attempts: Math.floor(Math.random() * 50) + 1,
            risk: risk
        };

        // Simulate WebSocket message
        this.handleMessage({
            type: 'attack_event',
            event: event,
            attacker: attacker
        });
    }

    simulateStatsUpdate() {
        const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
        
        const stats = {
            activeThreats: Math.floor(Math.random() * (isAttackMode ? 50 : 20)) + (isAttackMode ? 10 : 1),
            blockedIPs: Math.floor(Math.random() * (isAttackMode ? 200 : 100)) + (isAttackMode ? 50 : 10),
            countries: Math.floor(Math.random() * 25) + 5
        };

        this.handleMessage({
            type: 'stats_update',
            stats: stats
        });
    }

    formatAttackType(type) {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Public methods for external use
    isConnected() {
        return this.isConnected;
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    reconnect() {
        this.disconnect();
        this.reconnectAttempts = 0;
        setTimeout(() => this.connect(), 1000);
    }
}

// Initialize WebSocket manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wsManager = new WebSocketManager();
});