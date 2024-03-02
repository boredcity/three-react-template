import { Canvas as ReactCanvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { BakeShadows, OrbitControls, SoftShadows } from '@react-three/drei';
import { PostProcessing } from '../PostProcessing/PostProcessing';

const softShadows = (
    <SoftShadows
        size={6 /* how soft is the light */}
        samples={5 /* quality */}
        focus={0 /* where the shadow is sharpest */}
    />
);

const bakeShadows = <BakeShadows />; // if light and objects do not move

export const Canvas: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <ReactCanvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-4, 3, 6]
            }}
        >
            {/* {bakeShadows} */}
            {softShadows}

            <Perf position="top-left" />
            <OrbitControls makeDefault />

            <ambientLight intensity={1.5} />
            <color args={['#000']} attach="background" />
            {children}

            <PostProcessing />
        </ReactCanvas>
    );
};
