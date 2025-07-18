// Dashboard Main Controller
class CyberDashboard {
    constructor() {
        this.isAttackMode = false;
        this.isPaused = false;
        this.startTime = Date.now();
        this.stats = {
            activeThreats: 0,
            blockedIPs: 0,
            countries: new Set(),
            uptime: 0
        };
        this.attackers = new Map();
        this.feedItems = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startUptime();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Attack mode toggle
        const attackToggle = document.getElementById('attackMode');
        if (attackToggle) {
            attackToggle.addEventListener('change', (e) => {
                this.toggleAttackMode(e.target.checked);
            });
        }

        // Feed controls
        const pauseFeed = document.getElementById('pauseFeed');
        if (pauseFeed) {
            pauseFeed.addEventListener('click', () => {
                this.toggleFeedPause();
            });
        }

        const clearFeed = document.getElementById('clearFeed');
        if (clearFeed) {
            clearFeed.addEventListener('click', () => {
                this.clearFeed();
            });
        }

        // Chart timeframe controls
        document.querySelectorAll('[data-timeframe]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-timeframe]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartTimeframe(e.target.dataset.timeframe);
            });
        });

        // Attack type filter
        const attackTypeFilter = document.getElementById('attackTypeFilter');
        if (attackTypeFilter) {
            attackTypeFilter.addEventListener('change', (e) => {
                this.filterAttackers(e.target.value);
            });
        }

        // Modal close
        const closeModal = document.querySelector('.close');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                const modal = document.getElementById('alertModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('alertModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    toggleAttackMode(enabled) {
        this.isAttackMode = enabled;
        document.body.classList.toggle('attack-mode', enabled);
        
        const threatLevel = document.getElementById('levelValue');
        if (threatLevel) {
            if (enabled) {
                threatLevel.textContent = 'HIGH';
                threatLevel.className = 'level-value high';
                this.showAlert('High-intensity attack detected! All systems on high alert.');
            } else {
                threatLevel.textContent = 'LOW';
                threatLevel.className = 'level-value low';
            }
        }

        // Notify threat intelligence system
        if (window.threatIntelligence) {
            window.threatIntelligence.updateThreatLevel(enabled);
        }

        // Notify WebSocket about mode change
        if (window.wsManager && window.wsManager.ws && window.wsManager.ws.readyState === WebSocket.OPEN) {
            window.wsManager.ws.send(JSON.stringify({
                type: 'attack_mode',
                enabled: enabled
            }));
        }
    }

    toggleFeedPause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pauseFeed');
        if (btn) {
            if (this.isPaused) {
                btn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            }
        }
    }

    clearFeed() {
        this.feedItems = [];
        const feedContainer = document.getElementById('attackFeed');
        if (feedContainer) {
            feedContainer.innerHTML = '';
        }
    }

    startUptime() {
        setInterval(() => {
            const uptime = Date.now() - this.startTime;
            const hours = Math.floor(uptime / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
            
            const uptimeElement = document.getElementById('uptime');
            if (uptimeElement) {
                uptimeElement.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    loadInitialData() {
        // Simulate some initial data
        this.updateStats({
            activeThreats: Math.floor(Math.random() * 10) + 1,
            blockedIPs: Math.floor(Math.random() * 50) + 10,
            countries: Math.floor(Math.random() * 15) + 5
        });

        // Add some initial attackers
        this.addInitialAttackers();
    }

    addInitialAttackers() {
        const initialAttackers = [
            { ip: '192.168.1.100', country: 'Russia', type: 'brute_force', attempts: 45, risk: 'high' },
            { ip: '10.0.0.50', country: 'China', type: 'ddos', attempts: 32, risk: 'medium' },
            { ip: '172.16.0.25', country: 'North Korea', type: 'malware', attempts: 28, risk: 'high' },
            { ip: '203.0.113.15', country: 'Iran', type: 'sql_injection', attempts: 19, risk: 'medium' },
            { ip: '198.51.100.8', country: 'Brazil', type: 'brute_force', attempts: 12, risk: 'low' }
        ];

        initialAttackers.forEach(attacker => {
            this.addAttacker(attacker);
        });
    }

    updateStats(newStats) {
        if (newStats.activeThreats !== undefined) {
            this.stats.activeThreats = newStats.activeThreats;
            const element = document.getElementById('activeThreats');
            if (element) {
                element.textContent = this.stats.activeThreats;
            }
        }
        
        if (newStats.blockedIPs !== undefined) {
            this.stats.blockedIPs = newStats.blockedIPs;
            const element = document.getElementById('blockedIPs');
            if (element) {
                element.textContent = this.stats.blockedIPs;
            }
        }
        
        if (newStats.countries !== undefined) {
            const element = document.getElementById('countries');
            if (element) {
                element.textContent = newStats.countries;
            }
        }
    }

    addFeedItem(item) {
        if (this.isPaused) return;

        const feedContainer = document.getElementById('attackFeed');
        if (!feedContainer) return;

        const feedItem = document.createElement('div');
        feedItem.className = `feed-item ${item.risk}-risk`;
        
        const riskIcon = this.getRiskIcon(item.type);
        const timeStr = new Date(item.timestamp).toLocaleTimeString();
        
        feedItem.innerHTML = `
            <div class="feed-icon">
                <i class="${riskIcon}"></i>
            </div>
            <div class="feed-content">
                <div class="feed-title">${item.title}</div>
                <div class="feed-details">${item.details}</div>
            </div>
            <div class="feed-time">${timeStr}</div>
        `;

        feedContainer.insertBefore(feedItem, feedContainer.firstChild);
        
        // Keep only last 50 items
        while (feedContainer.children.length > 50) {
            feedContainer.removeChild(feedContainer.lastChild);
        }

        // Update stats
        this.stats.activeThreats++;
        this.updateStats({ activeThreats: this.stats.activeThreats });
    }

    getRiskIcon(type) {
        const icons = {
            'brute_force': 'fas fa-hammer',
            'ddos': 'fas fa-bolt',
            'malware': 'fas fa-virus',
            'sql_injection': 'fas fa-database',
            'port_scan': 'fas fa-search',
            'intrusion': 'fas fa-user-secret'
        };
        return icons[type] || 'fas fa-exclamation-triangle';
    }

    addAttacker(attacker) {
        this.attackers.set(attacker.ip, {
            ...attacker,
            lastSeen: new Date().toLocaleTimeString()
        });
        
        this.stats.countries.add(attacker.country);
        this.updateAttackersTable();
        this.updateStats({ countries: this.stats.countries.size });

        // Update threat intelligence analytics
        if (window.threatIntelligence) {
            window.threatIntelligence.updateAnalyticsFromDashboard({
                attackers: Array.from(this.attackers.values()),
                attackMode: this.isAttackMode
            });
        }
    }

    updateAttackersTable() {
        const tbody = document.getElementById('attackersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        // Sort attackers by attempts (descending)
        const sortedAttackers = Array.from(this.attackers.values())
            .sort((a, b) => b.attempts - a.attempts);

        sortedAttackers.forEach(attacker => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><code>${attacker.ip}</code></td>
                <td>${attacker.country}</td>
                <td>${this.formatAttackType(attacker.type)}</td>
                <td>${attacker.attempts}</td>
                <td>${attacker.lastSeen}</td>
                <td><span class="risk-badge ${attacker.risk}">${attacker.risk.toUpperCase()}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    formatAttackType(type) {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    filterAttackers(type) {
        const tbody = document.getElementById('attackersTableBody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const attackType = row.cells[2].textContent.toLowerCase().replace(' ', '_');
            if (type === 'all' || attackType === type) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    updateChartTimeframe(timeframe) {
        // This will be handled by charts.js
        if (window.chartManager) {
            window.chartManager.updateTimeframe(timeframe);
        }
    }

    showAlert(message) {
        const modal = document.getElementById('alertModal');
        const content = document.getElementById('alertContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color);"></i>
                <div>
                    <h4>Critical Security Alert</h4>
                    <p style="margin: 0.5rem 0; color: var(--secondary-text);">${message}</p>
                </div>
            </div>
            <div style="padding: 1rem; background: var(--accent-bg); border-radius: 4px; border-left: 3px solid var(--danger-color);">
                <strong>Recommended Actions:</strong>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li>Monitor all incoming connections</li>
                    <li>Review firewall rules</li>
                    <li>Check system logs for anomalies</li>
                    <li>Consider implementing additional security measures</li>
                </ul>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 10000);
    }

    // Method to be called from WebSocket
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'attack_event':
                this.addFeedItem(data.event);
                if (data.attacker) {
                    this.addAttacker(data.attacker);
                }
                break;
            case 'stats_update':
                this.updateStats(data.stats);
                break;
            case 'chart_data':
                if (window.chartManager) {
                    window.chartManager.addDataPoint(data.data);
                }
                break;
            case 'map_update':
                if (window.mapManager) {
                    window.mapManager.addAttack(data.location);
                }
                break;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new CyberDashboard();
});