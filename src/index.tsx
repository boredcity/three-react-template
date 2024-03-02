import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Template } from './components/Template/Template.js';
import { Perf } from 'r3f-perf';
import { BakeShadows, OrbitControls, SoftShadows } from '@react-three/drei';
import {
    ToneMapping,
    EffectComposer,
    Bloom,
    DepthOfField
} from '@react-three/postprocessing';

const root = ReactDOM.createRoot(document.querySelector('#root')!);

const softShadows = (
    <SoftShadows
        size={6 /* how soft is the light */}
        samples={5 /* quality */}
        focus={0 /* where the shadow is sharpest */}
    />
);

const bakeShadows = <BakeShadows />; // if light and objects do not move

root.render(
    <Canvas
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
        <Template />
        <EffectComposer
            disableNormalPass
            multisampling={8} // prevents aliasing (samples); 8 is default
        >
            <Bloom
                luminanceThreshold={1.001} // color values above glow
                mipmapBlur // adds blur effect outside object too
                intensity={2} // general intensity
            />
            <DepthOfField
                focusDistance={0.05} // distance from camera to unblured element (camera.far - camera.near) * value
                focalLength={0.025} // min distance from unblured to max blur
                bokehScale={4} // blur radius
            />
            <ToneMapping />
        </EffectComposer>
    </Canvas>
);
