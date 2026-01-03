// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
      // Mobile Menu Toggle - FIXED VERSION
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        // Toggle menu on button click
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling to document click
            mainNav.classList.toggle('active');
            menuToggle.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideNav = mainNav.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // Only on mobile
                    mainNav.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Initialize 3D Medical Scene on Home Page
    if (document.getElementById('medicalCanvas')) {
        initMedicalScene();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Simple validation
            if (!formObject.name || !formObject.email || !formObject.message) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual API endpoint)
            setTimeout(() => {
                showAlert('Your message has been sent successfully! We will contact you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Gallery image modal
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.dataset.image || this.querySelector('img')?.src;
            const title = this.dataset.title || this.querySelector('.gallery-title')?.textContent;
            const description = this.dataset.description || this.querySelector('.gallery-description')?.textContent;
            
            if (imgSrc) {
                openModal(imgSrc, title, description);
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in, .card, .stat-item').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for stats
    if (document.querySelector('.stats-section')) {
        animateCounters();
    }
    
    // Initialize tooltips
    initTooltips();
});

// Alert function
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(alert);
    
    // Close button
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(alert)) {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// 3D Medical Scene - REALISTIC VERSION
function initMedicalScene() {
    const canvasContainer = document.getElementById('medicalCanvas');
    if (!canvasContainer || typeof THREE === 'undefined') {
        console.warn('Three.js not loaded or canvas container not found');
        return;
    }
    
    try {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;
        
        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            canvasContainer.clientWidth / canvasContainer.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 2, 8);
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasContainer.appendChild(renderer.domElement);
        
        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.minDistance = 5;
        controls.maxDistance = 20;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);
        
        // Create realistic medical equipment
        createRealisticMedicalEquipment(scene);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Update scene objects
            scene.traverse((object) => {
                if (object.userData.rotation) {
                    object.rotation.x += object.userData.rotation.x || 0;
                    object.rotation.y += object.userData.rotation.y || 0;
                    object.rotation.z += object.userData.rotation.z || 0;
                }
                
                // Pulsing effect for heart
                if (object.userData.pulse) {
                    const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
                    object.scale.set(scale, scale, scale);
                }
            });
            
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        });
        
    } catch (error) {
        console.error('Error initializing 3D scene:', error);
    }
}

function createRealisticMedicalEquipment(scene) {
    // Create medical equipment group
    const medicalGroup = new THREE.Group();
    
    // Realistic ECG Monitor
    createECGMonitor(medicalGroup);
    
    // Realistic Anatomical Heart
    createAnatomicalHeart(medicalGroup);
    
    // Realistic DNA Helix (Medical Symbol)
    createDNAHelix(medicalGroup);
    
    scene.add(medicalGroup);
}

function createECGMonitor(group) {
    // Monitor base
    const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2A377D,
        shininess: 100,
        specular: 0x333333
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, -1, 0);
    base.castShadow = true;
    group.add(base);
    
    // Monitor screen
    const screenGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0F172A,
        emissive: 0x1E293B,
        emissiveIntensity: 0.1,
        shininess: 150
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.1, 1);
    group.add(screen);
    
    // Create animated ECG line
    const linePoints = [];
    const segmentCount = 200;
    
    for (let i = 0; i <= segmentCount; i++) {
        const t = i / segmentCount;
        const x = (t - 0.5) * 2.3;
        
        // Realistic ECG waveform
        let y = 0;
        const period = Math.PI * 4;
        
        // P wave
        if (t < 0.1) y = Math.sin(t * period) * 0.1;
        // QRS complex
        else if (t < 0.25) y = Math.sin(t * period * 2) * 0.4;
        // T wave
        else if (t < 0.35) y = Math.sin(t * period * 0.5) * 0.2;
        // Flat line
        else y = 0;
        
        linePoints.push(new THREE.Vector3(x, y, 1.01));
    }
    
    const lineCurve = new THREE.CatmullRomCurve3(linePoints);
    const lineGeometry = new THREE.TubeGeometry(lineCurve, segmentCount, 0.01, 8, false);
    const lineMaterial = new THREE.MeshPhongMaterial({
        color: 0x1E68A4,
        emissive: 0x1E68A4,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const ecgLine = new THREE.Mesh(lineGeometry, lineMaterial);
    ecgLine.position.y = 0.1;
    ecgLine.userData.rotation = { y: 0.01 }; // Slow rotation
    group.add(ecgLine);
}

function createAnatomicalHeart(group) {
    const heartGroup = new THREE.Group();
    heartGroup.position.set(2, 1, 0);
    
    // Main heart chambers
    const heartGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xC22028,
        shininess: 80,
        specular: 0x444444,
        flatShading: false
    });
    
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.scale.set(1, 1.2, 0.8);
    heart.userData.pulse = true;
    heartGroup.add(heart);
    
    // Aorta
    const aortaGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 8);
    const aorta = new THREE.Mesh(aortaGeometry, heartMaterial);
    aorta.position.set(0, 0.8, 0);
    aorta.rotation.x = Math.PI / 6;
    heartGroup.add(aorta);
    
    // Pulmonary artery
    const arteryGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 8);
    const artery = new THREE.Mesh(arteryGeometry, heartMaterial);
    artery.position.set(0.3, 0.7, 0.2);
    artery.rotation.set(Math.PI / 4, Math.PI / 6, 0);
    heartGroup.add(artery);
    
    group.add(heartGroup);
}

function createDNAHelix(group) {
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(-2, 0.5, 0);
    
    const radius = 0.3;
    const height = 2;
    const segments = 50;
    
    // Create two helixes
    for (let side = 0; side < 2; side++) {
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 4;
            const x = Math.cos(angle + side * Math.PI) * radius;
            const y = (t - 0.5) * height;
            const z = Math.sin(angle + side * Math.PI) * radius;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, segments * 2, 0.03, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: side === 0 ? 0xC22028 : 0x2A377D,
            shininess: 90,
            specular: 0x333333
        });
        
        const helix = new THREE.Mesh(tubeGeometry, tubeMaterial);
        dnaGroup.add(helix);
    }
    
    // Create connecting rungs
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const y = (t - 0.5) * height;
        
        const rungGeometry = new THREE.CylinderGeometry(0.01, 0.01, radius * 2, 8);
        const rungMaterial = new THREE.MeshPhongMaterial({
            color: 0x1E68A4,
            emissive: 0x1E68A4,
            emissiveIntensity: 0.3
        });
        
        const rung = new THREE.Mesh(rungGeometry, rungMaterial);
        rung.position.set(0, y, 0);
        rung.rotation.z = Math.PI / 2;
        dnaGroup.add(rung);
    }
    
    dnaGroup.userData.rotation = { y: 0.005 };
    group.add(dnaGroup);
}

// Modal for gallery images
function openModal(imgSrc, title, description) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imgSrc}" alt="${title || 'Gallery Image'}">
            ${title ? `<h3>${title}</h3>` : ''}
            ${description ? `<p>${description}</p>` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: modalFadeIn 0.3s ease;
            padding: 2rem;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from { transform: translateY(50px) scale(0.9); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        .modal-content img {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
        }
        
        .modal-content h3 {
            padding: 1.5rem;
            margin: 0;
            color: #2A377D;
        }
        
        .modal-content p {
            padding: 0 1.5rem 1.5rem;
            margin: 0;
            color: #64748B;
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            color: white;
            background: rgba(194, 32, 40, 0.8);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 10;
            transition: background 0.3s ease;
        }
        
        .close-modal:hover {
            background: #C22028;
        }
    `;
    document.head.appendChild(style);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.animation = 'modalFadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }, 300);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(15, 23, 42, 0.95);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.875rem;
                z-index: 9998;
                white-space: nowrap;
                pointer-events: none;
                transform: translate(-50%, -100%);
                margin-top: -8px;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top}px;
                animation: tooltipFadeIn 0.2s ease;
            `;
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.animation = 'tooltipFadeOut 0.2s ease';
                setTimeout(() => {
                    if (document.body.contains(tooltip)) {
                        document.body.removeChild(tooltip);
                    }
                }, 200);
            }, { once: true });
        });
    });
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -90%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -100%);
        }
    }
    
    @keyframes tooltipFadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -90%);
        }
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .card {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
    }
    
    .card.animated {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;
document.head.appendChild(animationStyles);
