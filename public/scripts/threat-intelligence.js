// Threat Intelligence Analysis System
class ThreatIntelligenceManager {
    constructor() {
        this.reportData = {
            executiveSummary: '',
            topThreats: [],
            geographicAnalysis: [],
            temporalPatterns: [],
            riskAssessment: '',
            recommendations: []
        };
        this.analyticsData = {
            attackVectors: {},
            geoHeatIndex: {},
            temporalPatterns: {},
            riskMatrix: {}
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnalytics();
        this.generateInitialReport();
    }

    setupEventListeners() {
        const generateBtn = document.getElementById('generateReport');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateThreatReport();
            });
        }

        const exportBtn = document.getElementById('exportReport');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        const timeframeSelect = document.getElementById('analyticsTimeframe');
        if (timeframeSelect) {
            timeframeSelect.addEventListener('change', (e) => {
                this.updateAnalyticsTimeframe(e.target.value);
            });
        }
    }

    generateThreatReport() {
        const reportContainer = document.getElementById('threatReport');
        if (!reportContainer) return;
        
        reportContainer.innerHTML = '<div class="report-loading"><i class="fas fa-spinner fa-spin"></i><p>Analyzing global threat landscape...</p></div>';

        // Simulate report generation delay
        setTimeout(() => {
            const report = this.createThreatIntelligenceReport();
            reportContainer.innerHTML = report;
        }, 2000);
    }

    createThreatIntelligenceReport() {
        const currentTime = new Date();
        const reportId = `TI-${currentTime.getFullYear()}${(currentTime.getMonth() + 1).toString().padStart(2, '0')}${currentTime.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
        
        // Generate realistic threat data
        const threatLevel = this.calculateCurrentThreatLevel();
        const topThreats = this.generateTopThreats();
        const geoAnalysis = this.generateGeographicAnalysis();
        const recommendations = this.generateRecommendations(threatLevel);

        return `
            <div class="threat-report">
                <div class="report-header">
                    <div class="report-title">Global Cyber Threat Intelligence Report</div>
                    <div class="report-meta">
                        <span><strong>Report ID:</strong> ${reportId}</span>
                        <span><strong>Generated:</strong> ${currentTime.toLocaleString()}</span>
                        <span><strong>Classification:</strong> TLP:WHITE</span>
                        <span><strong>Threat Level:</strong> <span class="threat-level-indicator ${threatLevel.level.toLowerCase()}">${threatLevel.level}</span></span>
                    </div>
                </div>

                <div class="report-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> Executive Summary</h3>
                    <div class="threat-summary">
                        <p>${this.generateExecutiveSummary(threatLevel, topThreats)}</p>
                    </div>
                </div>

                <div class="report-section">
                    <h3><i class="fas fa-globe-americas"></i> Top Threat Source Countries</h3>
                    <ul class="top-threats-list">
                        ${topThreats.map(threat => `
                            <li>
                                <span class="threat-country">${threat.country}</span>
                                <div class="threat-stats">
                                    <span>${threat.attacks} attacks</span>
                                    <span>${threat.percentage}% of total</span>
                                    <span class="risk-badge ${threat.risk}">${threat.risk.toUpperCase()}</span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="report-section">
                    <h3><i class="fas fa-crosshairs"></i> Primary Attack Vectors</h3>
                    <div class="report-content">
                        <p><strong>Brute Force Attacks:</strong> Increased 23% from previous period, primarily targeting SSH and RDP services.</p>
                        <p><strong>DDoS Campaigns:</strong> Volumetric attacks averaging 15.7 Gbps, with peak observed at 47.2 Gbps.</p>
                        <p><strong>Malware Distribution:</strong> New variants detected focusing on cryptocurrency mining and data exfiltration.</p>
                        <p><strong>SQL Injection:</strong> Targeting web applications with outdated frameworks and insufficient input validation.</p>
                    </div>
                </div>

                <div class="report-section">
                    <h3><i class="fas fa-chart-line"></i> Temporal Analysis</h3>
                    <div class="report-content">
                        <p>Attack patterns show increased activity during business hours (UTC 08:00-18:00), with peak activity observed between 14:00-16:00 UTC. Weekend activity remains elevated, suggesting automated attack infrastructure.</p>
                        <p>Notable spike in activity correlates with recent geopolitical tensions and major software vulnerability disclosures.</p>
                    </div>
                </div>

                <div class="report-section">
                    <h3><i class="fas fa-shield-alt"></i> Risk Assessment & Recommendations</h3>
                    <div class="report-content">
                        <ul>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="report-section">
                    <h3><i class="fas fa-info-circle"></i> Intelligence Sources</h3>
                    <div class="report-content">
                        <p><em>This report is based on simulated threat intelligence data for demonstration purposes. In a production environment, data would be sourced from:</em></p>
                        <ul>
                            <li>NETSCOUT Horizon Global Threat Intelligence</li>
                            <li>Honeypot Networks and Threat Sensors</li>
                            <li>Commercial Threat Intelligence Feeds</li>
                            <li>Open Source Intelligence (OSINT)</li>
                            <li>Industry Threat Sharing Partnerships</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    calculateCurrentThreatLevel() {
        const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
        const levels = [
            { level: 'CRITICAL', threshold: 90, color: 'critical' },
            { level: 'HIGH', threshold: 70, color: 'high' },
            { level: 'MEDIUM', threshold: 40, color: 'medium' },
            { level: 'LOW', threshold: 0, color: 'low' }
        ];

        const currentScore = isAttackMode ? 
            Math.floor(Math.random() * 30) + 70 : // 70-100 in attack mode
            Math.floor(Math.random() * 60) + 20;  // 20-80 in normal mode

        return levels.find(level => currentScore >= level.threshold) || levels[levels.length - 1];
    }

    generateTopThreats() {
        const countries = [
            { country: 'Russia', baseAttacks: 1250 },
            { country: 'China', baseAttacks: 980 },
            { country: 'North Korea', baseAttacks: 750 },
            { country: 'Iran', baseAttacks: 620 },
            { country: 'Brazil', baseAttacks: 450 },
            { country: 'India', baseAttacks: 380 },
            { country: 'Turkey', baseAttacks: 290 },
            { country: 'Vietnam', baseAttacks: 220 }
        ];

        const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
        const multiplier = isAttackMode ? 2.5 : 1;

        let totalAttacks = 0;
        const threats = countries.map(country => {
            const attacks = Math.floor((country.baseAttacks + Math.random() * 200) * multiplier);
            totalAttacks += attacks;
            return { ...country, attacks };
        });

        return threats.map(threat => ({
            ...threat,
            percentage: Math.round((threat.attacks / totalAttacks) * 100),
            risk: threat.attacks > 1500 ? 'high' : threat.attacks > 800 ? 'medium' : 'low'
        })).slice(0, 5);
    }

    generateGeographicAnalysis() {
        return [
            { region: 'Eastern Europe', riskLevel: 'High', primaryThreats: ['APT Groups', 'Ransomware'] },
            { region: 'East Asia', riskLevel: 'High', primaryThreats: ['State-sponsored', 'Industrial Espionage'] },
            { region: 'Middle East', riskLevel: 'Medium', primaryThreats: ['Hacktivism', 'DDoS'] },
            { region: 'South America', riskLevel: 'Medium', primaryThreats: ['Financial Fraud', 'Botnets'] }
        ];
    }

    generateExecutiveSummary(threatLevel, topThreats) {
        const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
        
        if (isAttackMode) {
            return `Current global threat landscape indicates ELEVATED risk levels with significant increases in coordinated attack campaigns. Primary threat actors from ${topThreats[0].country} and ${topThreats[1].country} are conducting sustained operations targeting critical infrastructure and financial services. Immediate defensive measures recommended across all monitored networks.`;
        } else {
            return `Global cyber threat activity remains within expected parameters with moderate fluctuations across primary attack vectors. Routine threat actor activity observed from traditional source regions. Standard security posture maintenance recommended with continued monitoring of emerging threat patterns.`;
        }
    }

    generateRecommendations(threatLevel) {
        const baseRecommendations = [
            'Implement multi-factor authentication across all critical systems',
            'Maintain current patch management schedules for all network infrastructure',
            'Review and update incident response procedures',
            'Conduct regular security awareness training for all personnel'
        ];

        const elevatedRecommendations = [
            'Activate enhanced monitoring protocols for all network perimeters',
            'Consider implementing temporary access restrictions for non-essential services',
            'Increase frequency of security log reviews and analysis',
            'Coordinate with industry partners for threat intelligence sharing',
            'Prepare incident response teams for potential escalation scenarios'
        ];

        return threatLevel.level === 'HIGH' || threatLevel.level === 'CRITICAL' ? 
            [...baseRecommendations, ...elevatedRecommendations] : 
            baseRecommendations;
    }

    initializeAnalytics() {
        this.createAttackVectorChart();
        this.createGeoHeatIndex();
        this.createTemporalChart();
        this.createRiskMatrix();
    }

    createAttackVectorChart() {
        const ctx = document.getElementById('attackVectorChart').getContext('2d');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Brute Force', 'DDoS', 'Malware', 'SQL Injection', 'Port Scan', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 12, 5, 3],
                    backgroundColor: [
                        '#ff4757',
                        '#ffa502',
                        '#ff6b6b',
                        '#ff7675',
                        '#fd79a8',
                        '#a29bfe'
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
                            padding: 10,
                            usePointStyle: true,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    createGeoHeatIndex() {
        const container = document.getElementById('geoHeatIndex');
        if (!container) return;
        
        const countries = [
            { name: 'Russia', intensity: 95, level: 'high' },
            { name: 'China', intensity: 87, level: 'high' },
            { name: 'N. Korea', intensity: 72, level: 'medium' },
            { name: 'Iran', intensity: 68, level: 'medium' },
            { name: 'Brazil', intensity: 45, level: 'low' }
        ];

        container.innerHTML = countries.map(country => `
            <div class="heat-index-item">
                <span>${country.name}</span>
                <div class="heat-bar">
                    <div class="heat-fill ${country.level}" style="width: ${country.intensity}%"></div>
                </div>
                <span>${country.intensity}%</span>
            </div>
        `).join('');
    }

    createTemporalChart() {
        const ctx = document.getElementById('temporalChart').getContext('2d');
        if (!ctx) return;
        
        // Generate 24-hour attack pattern data
        const hours = Array.from({length: 24}, (_, i) => i);
        const attackData = hours.map(hour => {
            // Simulate higher activity during business hours
            const baseActivity = hour >= 8 && hour <= 18 ? 60 : 30;
            return baseActivity + Math.random() * 40;
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
                datasets: [{
                    label: 'Attack Frequency',
                    data: attackData,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(58, 69, 83, 0.3)'
                        },
                        ticks: {
                            color: '#b8c5d1',
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(58, 69, 83, 0.3)'
                        },
                        ticks: {
                            color: '#b8c5d1'
                        }
                    }
                }
            }
        });
    }

    createRiskMatrix() {
        const container = document.getElementById('riskMatrix');
        if (!container) return;
        
        const riskLevels = [
            { label: 'Critical\nInfrastructure', level: 'critical' },
            { label: 'Financial\nServices', level: 'high' },
            { label: 'Healthcare\nSystems', level: 'high' },
            { label: 'Government\nAgencies', level: 'critical' },
            { label: 'Educational\nInstitutions', level: 'medium' },
            { label: 'Small\nBusiness', level: 'medium' },
            { label: 'Personal\nDevices', level: 'low' },
            { label: 'IoT\nDevices', level: 'medium' },
            { label: 'Cloud\nServices', level: 'high' }
        ];

        container.innerHTML = `
            <div class="risk-matrix">
                ${riskLevels.map(risk => `
                    <div class="risk-cell ${risk.level}" title="${risk.label.replace('\\n', ' ')}">
                        ${risk.label}
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateAnalyticsTimeframe(timeframe) {
        // Update analytics based on selected timeframe
        console.log(`Updating analytics for timeframe: ${timeframe}`);
        // In a real implementation, this would fetch new data and update charts
    }

    exportReport() {
        const reportContent = document.getElementById('threatReport').innerHTML;
        if (!reportContent) {
            alert('No report content found.');
            return;
        }
        
        if (!reportContent || reportContent.includes('report-loading')) {
            alert('Please generate a report first before exporting.');
            return;
        }

        // Create a formatted export
        const exportData = {
            timestamp: new Date().toISOString(),
            reportType: 'Threat Intelligence Report',
            classification: 'TLP:WHITE',
            content: reportContent.replace(/<[^>]*>/g, ''), // Strip HTML for text export
            generatedBy: 'CyberWatch Threat Intelligence System'
        };

        // Create and download file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat-intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateInitialReport() {
        // Generate initial report after a short delay
        setTimeout(() => {
            this.generateThreatReport();
        }, 1000);
    }

    // Method to update analytics based on dashboard data
    updateAnalyticsFromDashboard(dashboardData) {
        if (dashboardData.attackers) {
            this.updateGeoHeatIndex(dashboardData.attackers);
        }
        if (dashboardData.attackMode !== undefined) {
            this.updateThreatLevel(dashboardData.attackMode);
        }
    }

    updateGeoHeatIndex(attackers) {
        const countryStats = {};
        attackers.forEach(attacker => {
            countryStats[attacker.country] = (countryStats[attacker.country] || 0) + attacker.attempts;
        });

        // Update the heat index display
        const container = document.getElementById('geoHeatIndex');
        if (container && Object.keys(countryStats).length > 0) {
            const maxAttacks = Math.max(...Object.values(countryStats));
            const sortedCountries = Object.entries(countryStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);

            container.innerHTML = sortedCountries.map(([country, attacks]) => {
                const intensity = Math.round((attacks / maxAttacks) * 100);
                const level = intensity > 70 ? 'high' : intensity > 40 ? 'medium' : 'low';
                
                return `
                    <div class="heat-index-item">
                        <span>${country}</span>
                        <div class="heat-bar">
                            <div class="heat-fill ${level}" style="width: ${intensity}%"></div>
                        </div>
                        <span>${intensity}%</span>
                    </div>
                `;
            }).join('');
        }
    }

    updateThreatLevel(isAttackMode) {
        // Regenerate report when attack mode changes
        if (document.getElementById('threatReport').innerHTML && 
            !document.getElementById('threatReport').innerHTML.includes('report-loading')) {
            setTimeout(() => {
                this.generateThreatReport();
            }, 500);
        }
    }
}

// Initialize threat intelligence manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.threatIntelligence = new ThreatIntelligenceManager();
});