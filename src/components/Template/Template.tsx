import { useFrame } from '@react-three/fiber';
import {
    Float,
    Grid,
    Html,
    TransformControls,
    useHelper
} from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper, Mesh } from 'three';
import { useControls } from 'leva';
import { testButton } from './Template.module.css';
import { TestModel } from '../models/TestModel';
import { Placeholder } from '../models/Placeholder';
import { TestJSXModel } from '../models/TestJSXModel';

export const Template = () => {
    const cube = useRef<Mesh>(null);
    const sphere = useRef<Mesh>(null!);
    const directionalLight = useRef<DirectionalLight>(null!);
    useHelper(directionalLight, DirectionalLightHelper, 2, 0x000000);
    const { cubePosition, cubeColor, lightY, cheeseScale } = useControls({
        cubePosition: {
            value: { x: 2, z: 0 },
            min: -10,
            max: 10,
            step: 0.01
            // joystick: 'invertY'
        },
        lightY: {
            value: 2.5,
            min: 0,
            max: 5,
            step: 0.01
        },
        cubeColor: 'rebeccapurple',
        cheeseScale: {
            value: 1.5,
            min: 0.95,
            max: 1.5,
            step: 0.01
        }
    });

    useFrame((state, delta) => {
        const { elapsedTime } = state.clock;

        if (cube.current) {
            cube.current.rotation.y += delta * 0.2;
        }
        if (sphere.current) {
            sphere.current.position.y = Math.sin(elapsedTime * 2) + 1;
        }
        if (directionalLight.current) {
            directionalLight.current.position.x = Math.sin(elapsedTime) * 4;
            directionalLight.current.position.z = Math.cos(elapsedTime) * 4;
            directionalLight.current.position.y = lightY;
        }
    });

    return (
        <>
            <directionalLight
                ref={directionalLight}
                position={[1, 2, 3]}
                intensity={6.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={0.1}
                shadow-camera-far={12}
                // shadow-camera-top={5}
                // shadow-camera-bottom={-5}
                // shadow-camera-left={-5}
                // shadow-camera-right={5}
                shadow-normalBias={0.04} // choose the smallest ok value if shadow acne appears
                color={0xffaaaa}
            />

            <mesh ref={sphere} position-x={-2} castShadow receiveShadow>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
            <TransformControls object={sphere} />

            <group position-x={cubePosition.x} position-z={cubePosition.z}>
                <Html
                    position-y={1}
                    center
                    occlude={[cube, sphere]}
                    as="label"
                    distanceFactor={10}
                >
                    <button
                        onClick={() =>
                            cube.current &&
                            (cube.current.scale.x +=
                                Math.random() > 0.5 ? 1 : -1)
                        }
                        className={testButton}
                    >
                        Test button
                    </button>
                </Html>
                <mesh
                    ref={cube}
                    scale={1.5}
                    position-y={-0.25}
                    castShadow
                    receiveShadow
                >
                    <boxGeometry />
                    <meshStandardMaterial color={cubeColor} />
                </mesh>
            </group>

            <mesh
                position-y={-1}
                rotation-x={-Math.PI * 0.5}
                scale={10}
                receiveShadow
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <group position={[0, -1, 3]}>
                <Suspense
                    fallback={
                        <Placeholder scale={[2, 1, 2]} position={[0, 1, 0]} />
                    }
                >
                    <Float>
                        <TestJSXModel scale={0.25} cheeseScale={cheeseScale} />
                    </Float>
                </Suspense>
            </group>
            <Suspense>
                <TestModel scale={0.025} position={[0, -1, -3]} />
            </Suspense>

            <Grid fadeDistance={50} position-y={-0.99} infiniteGrid />
        </>
    );
};
