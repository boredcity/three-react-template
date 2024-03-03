import { buttonGroup, useControls } from 'leva';
import { Canvas } from '../Canvas/Canvas';
import { PhysicsTemplate } from '../PhysicsTemplate/PhysicsTemplate';
import { BasicTemplate } from '../BasicTemplate/BasicTemplate';

export const App = () => {
    const [{ scene }, setControls] = useControls(() => ({
        scene: {
            value: 'Basic',
            editable: false
        },
        ' ': buttonGroup({
            Basic: () => {
                setControls({ scene: 'Basic' });
            },
            Physics: () => {
                setControls({ scene: 'Physics' });
            }
        })
    }));
    return (
        <Canvas>
            {scene === 'Basic' ? <BasicTemplate /> : <PhysicsTemplate />}
        </Canvas>
    );
};
