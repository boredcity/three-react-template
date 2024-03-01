import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Template } from './components/Template/Template.js';
import { Perf } from 'r3f-perf';
import { BakeShadows, OrbitControls, SoftShadows } from '@react-three/drei';

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
        {bakeShadows}
        {softShadows}
        <Perf position="top-left" />
        <OrbitControls makeDefault />
        <ambientLight intensity={1.5} />
        <color args={[0xffffff]} attach="background" />
        <Template />
    </Canvas>
);
