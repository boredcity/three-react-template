import { Canvas } from '../Canvas/Canvas';
import { PhysicsTemplate } from '../PhysicsTemplate/PhysicsTemplate';
import { Template } from '../Template/Template';

export const App = () => (
    <Canvas>
        <Template />
        <PhysicsTemplate />
    </Canvas>
);
