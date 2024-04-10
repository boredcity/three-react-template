import { useFrame } from '@react-three/fiber';
import {
    CuboidCollider,
    InstancedRigidBodies,
    InstancedRigidBodyProps,
    Physics,
    RigidBody
} from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import {
    AdditiveBlending,
    Color,
    Euler,
    Quaternion,
    ShaderMaterial
} from 'three';
import { BurgerModel } from '../ModelAndPlaceholder/BurgerModel';
import { useControls } from 'leva';
import {
    holographicFragmentShader,
    holographicVertexShader
} from '../../holographic';

export const PhysicsTemplate = () => {
    const complexCuboid = useRef<any>(null!);
    const twister = useRef<any>(null!);
    const jump = () => {
        complexCuboid.current?.applyImpulse({ x: 0, y: 50, z: 0 });
        complexCuboid.current?.applyTorqueImpulse({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 10
        });
    };

    useFrame(({ clock: { elapsedTime } }) => {
        const eulerRotation = new Euler(0, elapsedTime * 4, 0);
        const quaternionRotation = new Quaternion();
        quaternionRotation.setFromEuler(eulerRotation);
        twister.current.setNextKinematicRotation(quaternionRotation);
        const angle = elapsedTime * 0.5;
        twister.current.setNextKinematicTranslation({
            x: Math.sin(angle) * 2,
            z: Math.cos(angle) * 2,
            y: -0.8
        });
    });

    const cubesCount = 200;
    const instances = useMemo(() => {
        const instances: InstancedRigidBodyProps[] = [];
        for (let i = 0; i < cubesCount; i++) {
            instances.push({
                key: `phys_cube_${i}`,
                position: [
                    (Math.random() - 0.5) * 8,
                    6 + i * 0.2,
                    (Math.random() - 0.5) * 8
                ],
                rotation: [Math.random(), Math.random(), Math.random()]
            });
        }

        return instances;
    }, []);

    const { debug, dropCubes } = useControls(
        'Physics',
        {
            dropCubes: false,
            debug: false
        },
        { collapsed: true }
    );

    const shaderMaterialRef = useRef<ShaderMaterial>(null!);

    const uniforms = useMemo(
        () => ({
            uColor: { value: new Color('tomato') }
        }),
        []
    );

    useFrame(({ clock }) => {
        if (shaderMaterialRef.current?.uniforms) {
            shaderMaterialRef.current.uniforms.uTime ??= { value: 0 };
            shaderMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
        }
    });

    return (
        <>
            <directionalLight
                position={[1, 2, 3]}
                intensity={6.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={0.1}
                shadow-camera-far={12}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-normalBias={0.04} // choose the smallest ok value if shadow acne appears
                color={0xffaaaa}
            />
            <Physics debug={debug} gravity={[0, -9.08, 0]}>
                <group>
                    <RigidBody
                        colliders="ball"
                        gravityScale={1}
                        restitution={1}
                        friction={0.7}
                    >
                        <mesh castShadow position={[-2, 2, 0]}>
                            <sphereGeometry />
                            <meshStandardMaterial color="orange" />
                        </mesh>
                    </RigidBody>

                    <RigidBody ref={complexCuboid} friction={0.7}>
                        <mesh castShadow position={[2, 4, 0]} onClick={jump}>
                            <boxGeometry args={[2, 2, 1]} />
                            <meshStandardMaterial color="mediumpurple" />
                        </mesh>
                        <mesh castShadow position={[2, 4, 1]}>
                            <boxGeometry args={[2, 1, 1, 4, 4]} />
                            <shaderMaterial
                                ref={shaderMaterialRef}
                                vertexShader={holographicVertexShader}
                                fragmentShader={holographicFragmentShader}
                                uniforms={uniforms}
                                transparent
                                blending={AdditiveBlending}
                                depthWrite={false}
                            />
                        </mesh>
                    </RigidBody>
                    <RigidBody colliders="hull">
                        <BurgerModel scale={0.2} />
                    </RigidBody>

                    <RigidBody colliders="hull">
                        {/* "trimesh" option is better but is empty inside which might lead to bugs with items stuck inside of them */}
                        <mesh
                            castShadow
                            position={[0, 1, 4]}
                            rotation-x={Math.PI / 2}
                        >
                            <torusGeometry args={[1, 0.5]} />
                            <meshStandardMaterial color="tomato" />
                        </mesh>
                    </RigidBody>

                    <RigidBody type="fixed" restitution={1}>
                        <mesh receiveShadow position-y={-1.25}>
                            <boxGeometry args={[10, 0.5, 10]} />
                            <meshStandardMaterial color="greenyellow" />
                        </mesh>
                    </RigidBody>

                    <RigidBody type="kinematicPosition" ref={twister}>
                        <mesh castShadow scale={[0.4, 0.4, 4]}>
                            <boxGeometry />
                            <meshStandardMaterial color="tomato" />
                        </mesh>
                    </RigidBody>

                    {/* Walls */}
                    <RigidBody type="fixed">
                        <CuboidCollider
                            args={[5, 2, 0.5]}
                            position={[0, 1, 5.5]}
                        />
                        <CuboidCollider
                            args={[5, 2, 0.5]}
                            position={[0, 1, -5.5]}
                        />
                        <CuboidCollider
                            args={[0.5, 2, 5]}
                            position={[5.5, 1, 0]}
                        />
                        <CuboidCollider
                            args={[0.5, 2, 5]}
                            position={[-5.5, 1, 0]}
                        />
                    </RigidBody>

                    {/* Cubes */}
                    {dropCubes && (
                        <InstancedRigidBodies instances={instances}>
                            <instancedMesh
                                castShadow
                                args={[
                                    undefined, // provided within
                                    undefined, // provided within
                                    cubesCount
                                ]}
                            >
                                <boxGeometry />
                                <meshBasicMaterial color="lime" />
                            </instancedMesh>
                        </InstancedRigidBodies>
                    )}
                </group>
            </Physics>
        </>
    );
};
