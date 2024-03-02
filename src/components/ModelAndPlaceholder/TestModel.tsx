import { useAnimations, useGLTF } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect } from 'react';
import { Mesh } from 'three';

export const TestModel = ({ position, scale }: MeshProps) => {
    const { scene, animations } = useGLTF('./Fox/Fox.gltf');
    const { actions, names: animationNames } = useAnimations(animations, scene);

    const { animationName } = useControls('fox', {
        animationName: {
            options: animationNames
        }
    });

    useEffect(() => {
        const animation = actions[animationName];
        animation
            ?.reset() // start animation from the beginning
            .fadeIn(0.5) // cross-fade from previous animation
            .play();
        return () => {
            animation?.fadeOut(0.5);
        };
    }, [animationName, actions]);

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
        <primitive
            castShadow
            receiveShadow
            object={scene}
            position={position}
            scale={scale}
        />
    );
};

// Optionally preload model
useGLTF.preload('./Fox/Fox.gltf', true);
