import { forwardRef } from 'react';
import { DrunkEffect, DrunkEffectProps } from './DrunkEffect';

export const Drunk = forwardRef(
    (props: DrunkEffectProps & { enabled: boolean }, ref) => {
        if (!props.enabled) {
            return null;
        }
        const effect = new DrunkEffect(props);
        return <primitive ref={ref} object={effect} />;
    }
);
