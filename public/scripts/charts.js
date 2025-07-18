// Chart Management System
class ChartManager {
    constructor() {
        this.firewallChart = null;
        this.timeframe = '1h';
        this.dataPoints = [];
        this.maxDataPoints = 50;
        
        this.init();
    }

    init() {
        this.initializeFirewallChart();
        this.startDataGeneration();
    }

    initializeFirewallChart() {
        const ctx = document.getElementById('firewallChart').getContext('2d');
        if (!ctx) return;
        
        // Generate initial data
        const now = new Date();
        for (let i = this.maxDataPoints - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 60000)); // 1 minute intervals
            this.dataPoints.push({
                time: time,
                blocked: Math.floor(Math.random() * 20) + 5,
                allowed: Math.floor(Math.random() * 100) + 50
            });
        }

        this.firewallChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.dataPoints.map(point => 
                    point.time.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                ),
                datasets: [
                    {
                        label: 'Blocked Requests',
                        data: this.dataPoints.map(point => point.blocked),
                        borderColor: '#ff4757',
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Allowed Requests',
                        data: this.dataPoints.map(point => point.allowed),
                        borderColor: '#2ed573',
                        backgroundColor: 'rgba(46, 213, 115, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#b8c5d1',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(26, 31, 46, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#b8c5d1',
                        borderColor: '#3a4553',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(58, 69, 83, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b8c5d1',
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(58, 69, 83, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b8c5d1',
                            beginAtZero: true
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    startDataGeneration() {
        setInterval(() => {
            this.addDataPoint();
        }, 3000); // Add new data every 3 seconds
    }

    addDataPoint(customData = null) {
        const now = new Date();
        let blocked, allowed;

        if (customData) {
            blocked = customData.blocked;
            allowed = customData.allowed;
        } else {
            // Generate realistic data based on attack mode
            const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
            const baseBlocked = isAttackMode ? 50 : 10;
            const baseAllowed = isAttackMode ? 30 : 80;
            
            blocked = Math.floor(Math.random() * baseBlocked) + (isAttackMode ? 20 : 5);
            allowed = Math.floor(Math.random() * baseAllowed) + (isAttackMode ? 10 : 40);
        }

        // Add new data point
        this.dataPoints.push({
            time: now,
            blocked: blocked,
            allowed: allowed
        });

        // Remove old data points
        if (this.dataPoints.length > this.maxDataPoints) {
            this.dataPoints.shift();
        }

        // Update chart
        this.updateChart();
    }

    updateChart() {
        if (!this.firewallChart) return;

        this.firewallChart.data.labels = this.dataPoints.map(point => 
            point.time.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        );

        this.firewallChart.data.datasets[0].data = this.dataPoints.map(point => point.blocked);
        this.firewallChart.data.datasets[1].data = this.dataPoints.map(point => point.allowed);

        this.firewallChart.update('none'); // No animation for real-time updates
    }

    updateTimeframe(timeframe) {
        this.timeframe = timeframe;
        
        // Adjust data points based on timeframe
        switch (timeframe) {
            case '1h':
                this.maxDataPoints = 60; // 1 minute intervals
                break;
            case '6h':
                this.maxDataPoints = 72; // 5 minute intervals
                break;
            case '24h':
                this.maxDataPoints = 96; // 15 minute intervals
                break;
        }

        // Regenerate data for new timeframe
        this.regenerateData();
    }

    regenerateData() {
        this.dataPoints = [];
        const now = new Date();
        let interval;

        switch (this.timeframe) {
            case '1h':
                interval = 60000; // 1 minute
                break;
            case '6h':
                interval = 300000; // 5 minutes
                break;
            case '24h':
                interval = 900000; // 15 minutes
                break;
        }

        for (let i = this.maxDataPoints - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * interval));
            const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
            const baseBlocked = isAttackMode ? 50 : 10;
            const baseAllowed = isAttackMode ? 30 : 80;
            
            this.dataPoints.push({
                time: time,
                blocked: Math.floor(Math.random() * baseBlocked) + (isAttackMode ? 20 : 5),
                allowed: Math.floor(Math.random() * baseAllowed) + (isAttackMode ? 10 : 40)
            });
        }

        this.updateChart();
    }

    // Method to create additional charts if needed
    createThreatChart(canvasId) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (!ctx) return null;
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Brute Force', 'DDoS', 'Malware', 'SQL Injection', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#ff4757',
                        '#ffa502',
                        '#ff6b6b',
                        '#ff7675',
                        '#fd79a8'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b8c5d1',
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Initialize chart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chartManager = new ChartManager();
});