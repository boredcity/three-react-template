import { Clone, useAnimations, useGLTF } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect } from 'react';

export const TestModel = ({ position, scale }: MeshProps) => {
    const model = useGLTF('./Fox/Fox.gltf');
    const animations = useAnimations(model.animations, model.scene);

    const { animationName } = useControls('fox', {
        animationName: {
            options: animations.names
        }
    });

    useEffect(() => {
        const animation = animations.actions[animationName];
        animation
            ?.reset() // start animation from the beginning
            .fadeIn(0.5) // cross-fade from previous animation
            .play();
        return () => {
            animation?.fadeOut(0.5);
        };
    }, [animationName]);

    return (
        <>
            <primitive
                castShadow
                receiveShadow
                object={model.scene}
                position={position}
                scale={scale}
            />
        </>
    );
};

// Optionally preload model
useGLTF.preload('./Fox/Fox.gltf', true);
