export const holographicVertexShader = /* glsl */ `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec3 vPosition;
    varying vec3 vNormal;

    float random2D(vec2 value) {
        return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        // Glitch
        float glitchTime = uTime - modelPosition.y;
        float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) +  sin(glitchTime * 8.76);
        glitchStrength = smoothstep(0.3, 1.0, glitchStrength / 3.0);
        glitchStrength *= 0.25;
        modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
        modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

        gl_Position = projectionMatrix // perspective
            * viewMatrix // camera
            * modelPosition; // position of the vertex in the world

        vec4 modelNormal = modelMatrix * vec4(normal, 0.0 /* only the rotation is applied */);

        vPosition = modelPosition.xyz;
        vNormal = modelNormal.xyz; // value of a vec perpendicular to the surface
    }
`;

export const holographicFragmentShader = /* glsl */ `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
        vec3 normal = normalize(vNormal);
        if(!gl_FrontFacing) {
            normal *= - 1.0;
        }

        float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
        stripes = pow(stripes, 3.0);

        // Fresnel - the reflection of the light on the side of a surface almost parallel to to the viewer
        vec3 viewDirection = normalize(vPosition - cameraPosition);
        float fresnel = dot(viewDirection, normal) + 1.0;
        // if vectors are parallel, the dot product is 2, if perpendicular, it's 0
        fresnel = pow(fresnel, 2.0);
        float falloff = smoothstep(0.8, 0.0, fresnel);

        // Holographic
        float holographic = stripes * fresnel;
        holographic += fresnel * 1.25 * falloff;

        // Final color
        gl_FragColor = vec4(uColor, holographic);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;
