import { BlendFunction, Effect } from 'postprocessing';
import { Uniform } from 'three';
// import fragmentShader from './fragment.glsl';

const fragmentShader = /* glsl */ `
    uniform float amplitude;
    uniform float frequency;
    uniform float offset;

    void mainUv(inout vec2 uv) {
        uv.y += sin(offset + uv.x * frequency) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        vec4 color = inputColor;
        color.rgb *= vec3(0.2, 1.5, 0.2);
        outputColor = normalize(color);
    }
`;

export interface DrunkEffectProps {
    frequency?: number;
    amplitude?: number;
    blendFunction?: BlendFunction;
}

export class DrunkEffect extends Effect {
    constructor({
        frequency = 32,
        amplitude = 0.01,
        blendFunction = BlendFunction.DARKEN
    }: DrunkEffectProps) {
        super('DrunkEffect', fragmentShader, {
            blendFunction,
            uniforms: new Map([
                ['frequency', new Uniform(frequency)],
                ['amplitude', new Uniform(amplitude)],
                ['offset', new Uniform(0)]
            ])
        });
    }

    update(_renderer: unknown, _importBuffer: unknown, deltaTime: number) {
        const offset = this.uniforms.get('offset');
        if (offset) {
            offset.value += deltaTime;
        }
    }
}
