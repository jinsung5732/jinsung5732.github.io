import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Airplane {
    constructor(scene, readyCallback) {
        this.scene = scene;
        this.readyCallback = readyCallback;
        this.mesh = new THREE.Group();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 0;
        this.maxSpeed = 5.0;
        this.minSpeed = 0.5;
        this.throttle = 0;

        // Attitude
        this.pitch = 0;
        this.roll = 0;
        this.yaw = 0;

        this.pitchRate = 0;
        this.rollRate = 0;
        this.yawRate = 0;

        // Try to load external model, fallback to internal mesh
        this.loadModel();
    }

    loadModel() {
        // Example: Loading a model. NOTE: We default to procedural mesh since no .glb file exists yet.
        // To use a real model:
        // 1. Place 'plane.glb' in the 'assets' folder.
        // 2. Uncomment the loader code below.

        /*
        const loader = new GLTFLoader();
        loader.load('./assets/plane.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5); // Adjust scale
            model.rotation.y = Math.PI; // Adjust orientation
            this.mesh.add(model);
            
            // Find propeller if named
            // this.propeller = model.getObjectByName('Propeller');
            
            if(this.readyCallback) this.readyCallback();
        }, undefined, (error) => {
            console.error('Error loading model, using fallback:', error);
            this.createFallbackMesh();
            if(this.readyCallback) this.readyCallback();
        });
        */

        // For now, immediately use fallback
        this.createFallbackMesh();
        if (this.readyCallback) this.readyCallback();
    }

    createFallbackMesh() {
        this.mesh.clear();

        // Materials
        const fuselageMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, roughness: 0.3, metalness: 0.6
        });
        const cockpitMat = new THREE.MeshStandardMaterial({
            color: 0x222222, roughness: 0.1, metalness: 0.9
        });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });

        // Fuselage Body
        const fuselageGeom = new THREE.ConeGeometry(0.6, 5, 32);
        fuselageGeom.rotateX(Math.PI / 2);
        const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat);
        this.mesh.add(fuselage);

        // Cockpit Window
        const canopyGeom = new THREE.CapsuleGeometry(0.5, 1.2, 4, 12);
        canopyGeom.rotateZ(Math.PI / 2);
        const canopy = new THREE.Mesh(canopyGeom, cockpitMat);
        canopy.position.set(0, 0.5, 0.2);
        canopy.scale.set(0.7, 0.8, 0.6);
        this.mesh.add(canopy);

        // Main Wings
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.lineTo(1.5, 0.5);
        wingShape.lineTo(4, 0.2);
        wingShape.lineTo(4, -0.2);
        wingShape.lineTo(0.5, -0.8);
        wingShape.lineTo(0, -0.5);

        const wingExtrudeSettings = { steps: 2, depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 };
        const wingGeom = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);

        // Left Wing
        const leftWing = new THREE.Mesh(wingGeom, fuselageMat);
        leftWing.rotation.x = Math.PI / 2;
        leftWing.rotation.y = Math.PI; // Flip
        leftWing.position.set(-0.3, 0, 0.8);
        this.mesh.add(leftWing);

        // Right Wing
        const rightWing = new THREE.Mesh(wingGeom, fuselageMat);
        rightWing.rotation.x = Math.PI / 2;
        rightWing.rotation.y = 0;
        rightWing.position.set(0.3, 0, 0.8);
        this.mesh.add(rightWing);

        // Tail
        const tailGeom = new THREE.BoxGeometry(2, 0.1, 1);
        const tail = new THREE.Mesh(tailGeom, redMat);
        tail.position.set(0, 0.2, -2);
        this.mesh.add(tail);

        const rubberGeom = new THREE.BoxGeometry(0.1, 1.2, 1);
        const rudder = new THREE.Mesh(rubberGeom, redMat);
        rudder.position.set(0, 0.6, -2);
        this.mesh.add(rudder);

        // Propeller
        const propGeom = new THREE.BoxGeometry(0.1, 1.6, 0.1);
        const propMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.propeller = new THREE.Mesh(propGeom, propMat);
        this.propeller.position.set(0, 0, 2.55);
        this.mesh.add(this.propeller);

        // Spinner
        const spinnerGeom = new THREE.ConeGeometry(0.2, 0.4, 16);
        spinnerGeom.rotateX(Math.PI / 2);
        const spinner = new THREE.Mesh(spinnerGeom, redMat);
        spinner.position.set(0, 0, 2.6);
        this.mesh.add(spinner);

        // Lights
        const rightLight = new THREE.PointLight(0x00ff00, 2, 5);
        rightLight.position.set(3.8, 0, 0.5);
        this.mesh.add(rightLight);

        const leftLight = new THREE.PointLight(0xff0000, 2, 5);
        leftLight.position.set(-3.8, 0, 0.5);
        this.mesh.add(leftLight);
    }

    update(input, dt) {
        // Handle Input
        const rollSpeed = 2.0;
        const pitchSpeed = 1.5;
        const yawSpeed = 1.0;

        // Target Rates
        const targetPitchRate = input.pitch * pitchSpeed;
        const targetRollRate = -input.roll * rollSpeed; // Invert roll for standard feel
        const targetYawRate = -input.yaw * yawSpeed;

        // Smoothly interpolate rates
        this.pitchRate = THREE.MathUtils.lerp(this.pitchRate, targetPitchRate, dt * 2);
        this.rollRate = THREE.MathUtils.lerp(this.rollRate, targetRollRate, dt * 2);
        this.yawRate = THREE.MathUtils.lerp(this.yawRate, targetYawRate, dt * 2);

        // Throttle
        if (input.throttleUp) this.throttle += dt * 0.5;
        if (input.throttleDown) this.throttle -= dt * 0.5;
        this.throttle = THREE.MathUtils.clamp(this.throttle, 0, 1);

        // Calculated Speed based on throttle and pitch (gravity)
        const targetSpeed = this.minSpeed + this.throttle * (this.maxSpeed - this.minSpeed);
        // Dive gains speed, climb loses speed
        const gravityFactor = -Math.sin(this.mesh.rotation.x) * 2.0;

        this.speed = THREE.MathUtils.lerp(this.speed, targetSpeed + gravityFactor, dt * 0.5);
        this.speed = Math.max(0, this.speed); // Prevent reverse for now

        // Apply Rotations
        this.mesh.rotateX(this.pitchRate * dt);
        this.mesh.rotateZ(this.rollRate * dt);
        this.mesh.rotateY(this.yawRate * dt);

        // Move Forward
        this.mesh.translateZ(this.speed * dt); // Local Z is forward for this mesh setup?

        // Spin propeller
        if (this.propeller) {
            this.propeller.rotateZ(10 * dt * (0.2 + this.throttle));
        }
    }
}
