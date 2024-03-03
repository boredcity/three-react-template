import { Bvh, useAnimations, useCursor, useGLTF } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useState } from 'react';
import { Mesh } from 'three';

export const TestModel = ({ position, scale }: MeshProps) => {
    const { scene, animations } = useGLTF('./Fox/Fox.gltf');
    const { actions, names: animationNames } = useAnimations(animations, scene);
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    const [playAnimation, setPlayAnimation] = useState(true);

    const { animationName } = useControls(
        'Fox',
        {
            animationName: {
                options: animationNames
            }
        },
        { collapsed: true }
    );

    useEffect(() => {
        if (playAnimation) {
            const animation = actions[animationName];
            animation
                ?.reset() // start animation from the beginning
                .fadeIn(0.5) // cross-fade from previous animation
                .play();
            return () => {
                animation?.fadeOut(0.5);
            };
        }
    }, [animationName, actions, playAnimation]);

    useEffect(() => {
        // <Clone castShadow receiveShadow/> works fine
        scene.traverse(child => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <Bvh firstHitOnly>
            <primitive
                onClick={(e: Event) => setPlayAnimation(!playAnimation)}
                onPointerEnter={(e: Event) => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                castShadow
                receiveShadow
                object={scene}
                position={position}
                scale={scale}
            />
        </Bvh>
    );
};

// Optionally preload model
useGLTF.preload('./Fox/Fox.gltf', true);
