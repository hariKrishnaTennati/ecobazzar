import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        camera.position.z = 5;

        // --- Lights ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x22c55e, 2); // Eco Green
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // --- Particles (Organic "Seeds" or "Leaves") ---
        const count = 300;
        const geometry = new THREE.SphereGeometry(0.04, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4ade80,
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });

        const particles: THREE.Mesh[] = [];
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Random position
            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            );

            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            // Custom velocity for animation
            (mesh as any).velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            );

            scene.add(mesh);
            particles.push(mesh);
        }

        // --- Mouse Interaction ---
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- Resize handler ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // --- Animation Loop ---
        const animate = () => {
            requestAnimationFrame(animate);

            // Smooth camera parallax
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            // Animate particles
            particles.forEach(p => {
                p.position.add((p as any).velocity);
                p.rotation.x += 0.005;
                p.rotation.y += 0.005;

                // Wrap around
                if (p.position.x > 8) p.position.x = -8;
                if (p.position.x < -8) p.position.x = 8;
                if (p.position.y > 8) p.position.y = -8;
                if (p.position.y < -8) p.position.y = 8;
                if (p.position.z > 8) p.position.z = -8;
                if (p.position.z < -8) p.position.z = 8;
            });

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 pointer-events-none opacity-40 bg-gradient-to-br from-green-50/50 to-emerald-50/50"
        />
    );
};

export default ThreeBackground;
