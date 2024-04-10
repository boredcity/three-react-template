import { Controllers, Hands, XR } from '@react-three/xr';

export const XRTemplate = () => {
    return (
        <XR>
            <Controllers />
            <Hands />
            <mesh>
                <boxGeometry />
                <meshBasicMaterial color="blue" />
            </mesh>
        </XR>
    );
};
