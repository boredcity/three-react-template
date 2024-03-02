import { MeshProps } from '@react-three/fiber';

export const Placeholder = ({ position, scale }: MeshProps) => {
    return (
        <mesh position={position} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial wireframe color="red" />
        </mesh>
    );
};
