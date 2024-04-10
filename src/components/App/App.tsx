import { buttonGroup, useControls } from 'leva';
import { Canvas } from '../Canvas/Canvas';
import { PhysicsTemplate } from '../PhysicsTemplate/PhysicsTemplate';
import { BasicTemplate } from '../BasicTemplate/BasicTemplate';
import { XRButton } from '@react-three/xr';
import { XRTemplate } from '../XRTemplate/XRTemplate';

export const App = () => {
    const [{ scene }, setControls] = useControls(() => ({
        'scene': {
            value: 'Basic',
            editable: false
        },
        ' ': buttonGroup({
            Basic: () => {
                setControls({ scene: 'Basic' });
            },
            Physics: () => {
                setControls({ scene: 'Physics' });
            },
            XR: () => {
                setControls({ scene: 'XR' });
            }
        })
    }));
    return (
        <>
            <Canvas>
                {scene === 'Basic' ? (
                    <BasicTemplate />
                ) : scene === 'Physics' ? (
                    <PhysicsTemplate />
                ) : scene === 'XR' ? (
                    <XRTemplate />
                ) : null}
            </Canvas>
            {scene === 'XR' && (
                <XRButton
                    mode="AR"
                    sessionInit={{
                        optionalFeatures: [
                            'local-floor',
                            'bounded-floor',
                            'hand-tracking',
                            'layers'
                        ]
                    }}
                    onError={console.log}
                />
            )}
        </>
    );
};
