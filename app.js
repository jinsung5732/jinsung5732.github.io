import * as THREE from 'three';
import { Airplane } from './airplane.js';
import { Sky } from 'three/addons/objects/Sky.js';

class App {
    constructor() {
        this.container = document.getElementById('game-container');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.clock = new THREE.Clock();

        this.input = {
            pitch: 0,
            roll: 0,
            yaw: 0,
            throttleUp: false,
            throttleDown: false
        };

        this.init();
        this.initCompass();
        this.createWorld();
        this.animate();

        window.addEventListener('resize', this.onResize.bind(this));

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    init() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.container.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 20000);
        // Initial position behind plane
        this.cameraOffset = new THREE.Vector3(0, 3, -10);
    }

    createWorld() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(50, 100, 50);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        // Sky
        this.initSky();

        // Ground / Ocean
        const waterGeom = new THREE.PlaneGeometry(10000, 10000);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x004488,
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        const water = new THREE.Mesh(waterGeom, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = -50;
        this.scene.add(water);

        // Grid for reference
        const gridHelper = new THREE.GridHelper(2000, 50, 0xffffff, 0x444444);
        gridHelper.position.y = -49;
        this.scene.add(gridHelper);

        // Add some random landmarks (cubes)
        const geometry = new THREE.BoxGeometry(10, 50, 10);
        const material = new THREE.MeshStandardMaterial({ color: 0x555555 });

        for (let i = 0; i < 100; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (Math.random() - 0.5) * 1000;
            mesh.position.y = -25;
            mesh.position.z = (Math.random() - 0.5) * 1000;
            this.scene.add(mesh);
        }

        // Airplane
        this.airplane = new Airplane(this.scene, () => {
             console.log("Airplane loaded/created");
        });
        this.scene.add(this.airplane.mesh);
        // Start position
        this.airplane.mesh.position.y = 100;
        this.airplane.throttle = 0.5;
        this.airplane.speed = 1.0;
    }

    initSky() {
        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.scene.add(this.sky);

        const sun = new THREE.Vector3();
        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 180,
            exposure: 0.5
        };

        const uniforms = this.sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity;
        uniforms['rayleigh'].value = effectController.rayleigh;
        uniforms['mieCoefficient'].value = effectController.mieCoefficient;
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);
        uniforms['sunPosition'].value.copy(sun);
        this.renderer.toneMappingExposure = effectController.exposure;
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.input.pitch = 1; break; // Nose down ? No, usually W is pitch down (nose down) or up? Let's check logic.
            // Flight Sim convention: Pull back (S) -> Nose Up. Push forward (W) -> Nose Down.
            case 'KeyS': this.input.pitch = -1; break;
            case 'KeyA': this.input.roll = -1; break; // Left
            case 'KeyD': this.input.roll = 1; break; // Right
            case 'KeyQ': this.input.yaw = 1; break; // Left Yaw
            case 'KeyE': this.input.yaw = -1; break; // Right Yaw
            case 'ShiftLeft': this.input.throttleUp = true; break;
            case 'ControlLeft': this.input.throttleDown = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
            case 'KeyS': this.input.pitch = 0; break;
            case 'KeyA':
            case 'KeyD': this.input.roll = 0; break;
            case 'KeyQ':
            case 'KeyE': this.input.yaw = 0; break;
            case 'ShiftLeft': this.input.throttleUp = false; break;
            case 'ControlLeft': this.input.throttleDown = false; break;
        }
    }

    initCompass() {
        const compass = document.getElementById('compass');
        for (let i = 0; i <= 720; i += 5) {
            const tick = document.createElement('div');
            tick.className = 'compass-tick';
            tick.style.position = 'absolute';
            tick.style.left = (i * 2) + 'px'; // 2px per degree visual scale
            tick.style.height = i % 45 === 0 ? '15px' : '8px';
            tick.style.width = '1px';
            tick.style.backgroundColor = 'white';
            tick.style.top = '0';

            if (i % 45 === 0) {
                const label = document.createElement('div');
                label.className = 'compass-label';
                label.innerText = (i % 360).toString();
                label.style.position = 'absolute';
                label.style.top = '18px';
                label.style.left = '-10px';
                label.style.width = '20px';
                label.style.textAlign = 'center';
                label.style.fontSize = '10px';
                tick.appendChild(label);
            }
            compass.appendChild(tick);
        }
    }

    updateHUD() {
        const speedKts = Math.floor(this.airplane.speed * 100);
        document.getElementById('speed-display').textContent = speedKts;

        const altFt = Math.floor(this.airplane.mesh.position.y * 10);
        document.getElementById('altitude-display').textContent = altFt;

        // Compass
        // Get rotation Y. 
        let heading = this.airplane.mesh.rotation.y * (180 / Math.PI);
        // Normalize to 0-360
        heading = heading % 360;
        if (heading < 0) heading += 360;

        // Update compass strip position
        // We want the current heading to be centered.
        // If heading is 0, we want 0 centered.
        // Let's assume the strip is long enough.
        // We generated 720 degrees so we can loop? 
        // Simpler: Just Translate X.
        // 2px per degree. Center is 200px (width 400/2).
        // heading * 2 px.
        // offset = -heading * 2 + 200;
        const compass = document.getElementById('compass');
        const centerOffset = 200;
        const degToPx = 2;
        // Invert heading for visual strip moving left as we turn right
        const x = centerOffset - (heading * degToPx);
        compass.style.transform = `translateX(${x}px)`;

        // Artificial Horizon (Attitude)
        // Pitch controls horizon Y (up/down). 
        // Roll controls horizon rotation.
        // Pitch: mesh.rotation.x
        // Roll: mesh.rotation.z
        const horizon = document.querySelector('.horizon-line');
        const pitchDeg = this.airplane.mesh.rotation.x * (180 / Math.PI);
        const rollDeg = this.airplane.mesh.rotation.z * (180 / Math.PI);

        // Simple approximation
        const pitchOffset = pitchDeg * 5; // Pixels per degree pitch
        horizon.style.transform = `translateY(${pitchOffset}px) rotate(${-rollDeg}deg)`;
    }

    updateCamera() {
        // Smooth follow
        const relativeOffset = this.cameraOffset.clone().applyMatrix4(this.airplane.mesh.matrixWorld);
        this.camera.position.lerp(relativeOffset, 0.1);
        this.camera.lookAt(this.airplane.mesh.position);
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const dt = this.clock.getDelta();

        this.airplane.update(this.input, dt);
        this.updateCamera();
        this.updateHUD();

        this.renderer.render(this.scene, this.camera);
    }
}

new App();
