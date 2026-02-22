"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count }: { count: number }) {
    const meshRef = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const lastScrollRef = useRef(0);

    const originalPositions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 8 * Math.cbrt(Math.random());
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count]);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(originalPositions);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const isRed = Math.random() < 0.2;
            col[i * 3] = isRed ? 1 : 0.3;
            col[i * 3 + 1] = isRed ? 0.231 : 0.3;
            col[i * 3 + 2] = isRed ? 0.188 : 0.3;
        }
        return [pos, col];
    }, [count, originalPositions]);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };
        window.addEventListener("mousemove", handleMouse);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("mousemove", handleMouse);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        meshRef.current.rotation.y += 0.0003;
        meshRef.current.rotation.x += 0.0001;

        // Scroll-based tilt
        const scrollDelta = scrollRef.current - lastScrollRef.current;
        lastScrollRef.current = scrollRef.current;
        meshRef.current.rotation.x += scrollDelta * 0.00005;

        // Mouse repulsion
        const posArray = meshRef.current.geometry.attributes.position
            .array as Float32Array;
        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const dx = posArray[ix] - mouseRef.current.x * 4;
            const dy = posArray[ix + 1] - mouseRef.current.y * 4;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 2) {
                const force = (2 - dist) * 0.01;
                posArray[ix] += (dx / dist) * force;
                posArray[ix + 1] += (dy / dist) * force;
            } else {
                posArray[ix] += (originalPositions[ix] - posArray[ix]) * 0.01;
                posArray[ix + 1] +=
                    (originalPositions[ix + 1] - posArray[ix + 1]) * 0.01;
                posArray[ix + 2] +=
                    (originalPositions[ix + 2] - posArray[ix + 2]) * 0.01;
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

export default function ParticleField() {
    const count =
        typeof window !== "undefined" && window.devicePixelRatio < 2 ? 2000 : 3000;

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5] }}
                gl={{ antialias: true }}
                dpr={typeof window !== "undefined" ? window.devicePixelRatio : 1}
                style={{ width: "100%", height: "100%" }}
            >
                <Particles count={count} />
            </Canvas>
        </div>
    );
}
