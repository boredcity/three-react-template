import { Clone, useGLTF } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

// use https://gltf.pmnd.rs/ to convert gltf to jsx
export const TestModel = ({ position, scale }: MeshProps) => {
    const model = useGLTF('./testModel/TestModel-DRACO.glb');
    return (
        <>
            <Clone
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
useGLTF.preload('./testModel/TestModel-DRACO.glb', true);
