import { useFrame } from '@react-three/fiber';
import {
    CuboidCollider,
    InstancedRigidBodies,
    InstancedRigidBodyProps,
    Physics,
    RigidBody
} from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import { Euler, Quaternion } from 'three';
import { TestJSXModel } from '../ModelAndPlaceholder/TestJSXModel';
import { useControls } from 'leva';

const hitSound = new Audio('/audio/hit.mp3');
const sceneX = -11;
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
        const eulerRotation = new Euler(0, elapsedTime, 0);
        const quaternionRotation = new Quaternion();
        quaternionRotation.setFromEuler(eulerRotation);
        twister.current.setNextKinematicRotation(quaternionRotation);
        const angle = elapsedTime * 0.5;
        twister.current.setNextKinematicTranslation({
            x: Math.sin(angle) * 2 + sceneX,
            z: Math.cos(angle) * 2,
            y: -0.8
        });
    });

    const onCollisionEnter = () => {
        hitSound.currentTime = 0;
        hitSound.play();
    };

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

    const { debug } = useControls('Physics', {
        debug: false
    });

    return (
        <Physics debug={debug} gravity={[0, -9.08, 0]}>
            <group position-x={sceneX}>
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

                <RigidBody
                    ref={complexCuboid}
                    friction={0.7}
                    onCollisionEnter={onCollisionEnter}
                >
                    <mesh castShadow position={[2, 4, 0]} onClick={jump}>
                        <boxGeometry args={[2, 2, 1]} />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <mesh castShadow position={[2, 4, 1]}>
                        <boxGeometry args={[2, 1, 1]} />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                </RigidBody>
                <RigidBody colliders="hull">
                    <TestJSXModel scale={0.2} />
                </RigidBody>
                {/* <RigidBody
                    colliders={false}
                    position={[-2, 1, 0]}
                    rotation-x={Math.PI / 2}
                >
                    <CuboidCollider args={[1.5, 1.5, 0.5]} />
                    <mesh castShadow>
                        <torusGeometry args={[1, 0.5]} />
                        <meshStandardMaterial color="tomato" />
                    </mesh>
                </RigidBody> */}

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

                <RigidBody type="fixed">
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                    <CuboidCollider
                        args={[5, 2, 0.5]}
                        position={[0, 1, -5.5]}
                    />
                    <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                    <CuboidCollider
                        args={[0.5, 2, 5]}
                        position={[-5.5, 1, 0]}
                    />
                </RigidBody>
                <InstancedRigidBodies instances={instances}>
                    <instancedMesh
                        castShadow
                        args={[undefined, undefined, cubesCount]}
                    >
                        <boxGeometry />
                        <meshBasicMaterial color="lime" />
                    </instancedMesh>
                </InstancedRigidBodies>
            </group>
        </Physics>
    );
};
