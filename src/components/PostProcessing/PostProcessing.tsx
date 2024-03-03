import {
    ToneMapping,
    EffectComposer,
    Bloom,
    DepthOfField
} from '@react-three/postprocessing';
import { Drunk } from './effects/drunk/Drunk';
import { useRef } from 'react';
import { useControls } from 'leva';

export const PostProcessing = () => {
    const drunkRef = useRef();

    const drunkProps = useControls('FX.Drunk FX', {
        enabled: false,
        frequency: {
            render: get => get('FX.Drunk FX.enabled') === true,
            value: 32,
            min: 0,
            max: 100,
            step: 0.1
        },
        amplitude: {
            value: 0.01,
            min: 0,
            max: 0.4,
            step: 0.001,
            render: get => get('FX.Drunk FX.enabled') === true
        }
    });

    const depthOfField = useControls('FX.DepthOfField FX', {
        enabled: true
    });

    return (
        <EffectComposer
            disableNormalPass
            multisampling={8} // prevents aliasing (samples); 8 is default
        >
            <Drunk ref={drunkRef} {...drunkProps} />

            <Bloom
                luminanceThreshold={1.001} // color values above glow
                mipmapBlur // adds blur effect outside object too
                intensity={2} // general intensity
            />
            <DepthOfField
                focusDistance={0.05} // distance from camera to unblured element (camera.far - camera.near) * value
                focalLength={0.025} // min distance from unblured to max blur
                bokehScale={depthOfField.enabled ? 4 : 0} // blur radius
            />
            <ToneMapping />
        </EffectComposer>
    );
};
