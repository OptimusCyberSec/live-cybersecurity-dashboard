// Map Management System
class MapManager {
    constructor() {
        this.map = null;
        this.attackMarkers = [];
        this.heatmapData = [];
        this.maxMarkers = 100;
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.startAttackSimulation();
    }

    initializeMap() {
        // Initialize Leaflet map
        this.map = L.map('attackMap', {
            center: [20, 0],
            zoom: 2,
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            touchZoom: true
        });

        // Add dark theme tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // Add some initial attack markers
        this.addInitialAttacks();
    }

    addInitialAttacks() {
        const initialAttacks = [
            { lat: 55.7558, lng: 37.6176, country: 'Russia', risk: 'high', type: 'brute_force' },
            { lat: 39.9042, lng: 116.4074, country: 'China', risk: 'high', type: 'ddos' },
            { lat: 40.7128, lng: -74.0060, country: 'USA', risk: 'medium', type: 'port_scan' },
            { lat: 51.5074, lng: -0.1278, country: 'UK', risk: 'low', type: 'intrusion' },
            { lat: 35.6762, lng: 139.6503, country: 'Japan', risk: 'medium', type: 'malware' },
            { lat: -33.8688, lng: 151.2093, country: 'Australia', risk: 'low', type: 'sql_injection' },
            { lat: 52.5200, lng: 13.4050, country: 'Germany', risk: 'medium', type: 'brute_force' },
            { lat: -23.5505, lng: -46.6333, country: 'Brazil', risk: 'high', type: 'ddos' }
        ];

        initialAttacks.forEach(attack => {
            this.addAttack(attack);
        });
    }

    addAttack(attackData) {
        const { lat, lng, country, risk, type } = attackData;
        
        // Create custom marker based on risk level
        const markerColor = this.getRiskColor(risk);
        const markerSize = this.getRiskSize(risk);
        
        // Create pulsing marker
        const marker = L.circleMarker([lat, lng], {
            radius: markerSize,
            fillColor: markerColor,
            color: markerColor,
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.6,
            className: `attack-marker ${risk}-risk`
        });

        // Add popup with attack details
        const popupContent = `
            <div class="attack-popup">
                <h4><i class="fas fa-exclamation-triangle"></i> ${this.formatAttackType(type)}</h4>
                <p><strong>Location:</strong> ${country}</p>
                <p><strong>Risk Level:</strong> <span class="risk-badge ${risk}">${risk.toUpperCase()}</span></p>
                <p><strong>Coordinates:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(this.map);

        // Add pulsing animation
        this.addPulseAnimation(marker, risk);

        // Store marker
        this.attackMarkers.push({
            marker: marker,
            timestamp: Date.now(),
            risk: risk
        });

        // Remove old markers
        this.cleanupMarkers();

        // Update heatmap data
        this.updateHeatmapData(lat, lng, risk);
    }

    getRiskColor(risk) {
        const colors = {
            'high': '#ff4757',
            'medium': '#ffa502',
            'low': '#2ed573'
        };
        return colors[risk] || '#00d4ff';
    }

    getRiskSize(risk) {
        const sizes = {
            'high': 12,
            'medium': 8,
            'low': 6
        };
        return sizes[risk] || 6;
    }

    addPulseAnimation(marker, risk) {
        const element = marker.getElement();
        if (element) {
            element.style.animation = `pulse-${risk} 2s infinite`;
        }
    }

    formatAttackType(type) {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    cleanupMarkers() {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutes

        this.attackMarkers = this.attackMarkers.filter(item => {
            if (now - item.timestamp > maxAge || this.attackMarkers.length > this.maxMarkers) {
                this.map.removeLayer(item.marker);
                return false;
            }
            return true;
        });
    }

    updateHeatmapData(lat, lng, risk) {
        const intensity = risk === 'high' ? 1.0 : risk === 'medium' ? 0.6 : 0.3;
        
        this.heatmapData.push({
            lat: lat,
            lng: lng,
            intensity: intensity,
            timestamp: Date.now()
        });

        // Keep only recent data
        const maxAge = 10 * 60 * 1000; // 10 minutes
        const now = Date.now();
        this.heatmapData = this.heatmapData.filter(point => now - point.timestamp < maxAge);
    }

    startAttackSimulation() {
        setInterval(() => {
            this.simulateRandomAttack();
        }, 5000); // Add new attack every 5 seconds
    }

    simulateRandomAttack() {
        const attackTypes = ['brute_force', 'ddos', 'malware', 'sql_injection', 'port_scan', 'intrusion'];
        const riskLevels = ['low', 'medium', 'high'];
        const countries = [
            { name: 'Russia', lat: 55.7558, lng: 37.6176 },
            { name: 'China', lat: 39.9042, lng: 116.4074 },
            { name: 'North Korea', lat: 39.0392, lng: 125.7625 },
            { name: 'Iran', lat: 35.6892, lng: 51.3890 },
            { name: 'Brazil', lat: -15.7942, lng: -47.8822 },
            { name: 'India', lat: 20.5937, lng: 78.9629 },
            { name: 'Turkey', lat: 38.9637, lng: 35.2433 },
            { name: 'Vietnam', lat: 14.0583, lng: 108.2772 },
            { name: 'Romania', lat: 45.9432, lng: 24.9668 },
            { name: 'Ukraine', lat: 48.3794, lng: 31.1656 }
        ];

        // Increase attack frequency in attack mode
        const isAttackMode = window.dashboard && window.dashboard.isAttackMode;
        if (!isAttackMode && Math.random() < 0.3) return; // 30% chance in normal mode

        const country = countries[Math.floor(Math.random() * countries.length)];
        const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        let risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

        // Increase high-risk attacks in attack mode
        if (isAttackMode && Math.random() < 0.7) {
            risk = 'high';
        }

        // Add some randomness to coordinates
        const lat = country.lat + (Math.random() - 0.5) * 10;
        const lng = country.lng + (Math.random() - 0.5) * 10;

        this.addAttack({
            lat: lat,
            lng: lng,
            country: country.name,
            risk: risk,
            type: type
        });

        // Notify dashboard about the attack
        if (window.dashboard) {
            window.dashboard.addFeedItem({
                title: `${this.formatAttackType(type)} Attack Detected`,
                details: `Source: ${country.name} (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
                risk: risk,
                type: type,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Method to focus on a specific region
    focusOnRegion(lat, lng, zoom = 6) {
        this.map.setView([lat, lng], zoom);
    }

    // Method to get attack statistics
    getAttackStats() {
        const stats = {
            total: this.attackMarkers.length,
            high: this.attackMarkers.filter(item => item.risk === 'high').length,
            medium: this.attackMarkers.filter(item => item.risk === 'medium').length,
            low: this.attackMarkers.filter(item => item.risk === 'low').length
        };
        return stats;
    }
}

// Add CSS for map animations
const mapStyles = `
    .attack-popup {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #ffffff;
        background: var(--secondary-bg);
        border-radius: 4px;
        padding: 0.5rem;
    }
    
    .attack-popup h4 {
        margin: 0 0 0.5rem 0;
        color: var(--danger-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .attack-popup p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
    }
    
    @keyframes pulse-high {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
        }
        50% { 
            transform: scale(1.5);
            opacity: 0.4;
        }
    }
    
    @keyframes pulse-medium {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
        }
        50% { 
            transform: scale(1.3);
            opacity: 0.3;
        }
    }
    
    @keyframes pulse-low {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
        }
        50% { 
            transform: scale(1.2);
            opacity: 0.2;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mapStyles;
document.head.appendChild(styleSheet);

// Initialize map manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new MapManager();
});