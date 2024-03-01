import { useGLTF } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

export const TestModel = ({ position, scale }: MeshProps) => {
    const model = useGLTF('./TestModel.glb');
    return <primitive object={model.scene} position={position} scale={scale} />;
};
