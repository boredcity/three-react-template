import { Canvas as LibCanvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import {
    BakeShadows,
    Loader,
    OrbitControls,
    SoftShadows
} from '@react-three/drei';
import { PostProcessing } from '../PostProcessing/PostProcessing';
import { Leva, useControls } from 'leva';

export const Canvas: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { bakeShadows, showPerf, softShadows } = useControls(
        'Canvas',
        {
            softShadows: true,
            bakeShadows: false,
            showPerf: false
        },
        { collapsed: true }
    );
    return (
        <>
            <Leva
                collapsed
                theme={{
                    sizes: {
                        rootWidth: '300px'
                    }
                }}
            />
            <LibCanvas
                shadows
                // frameloop="demand" // enable if nothing moves in the scene
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [10, 10, 10]
                }}
            >
                {bakeShadows && <BakeShadows />}
                {softShadows && (
                    <SoftShadows
                        size={6 /* how soft is the light */}
                        samples={5 /* quality */}
                        focus={0 /* where the shadow is sharpest */}
                    />
                )}
                {showPerf && <Perf position="top-left" />}
                <OrbitControls makeDefault />
                <ambientLight intensity={1.5} />
                <color args={['#000']} attach="background" />
                {children}
                <PostProcessing />
            </LibCanvas>
            <Loader />
        </>
    );
};
