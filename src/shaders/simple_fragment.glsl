#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vPosition;

uniform vec4 uColor;
uniform vec3 uLightPosition;

out vec4 outColor;

void main() {
     vec3 normal = normalize(vNormal);
     vec3 light_dir = normalize(uLightPosition - vPosition);
     float diffuse_intensity = max(dot(normal, light_dir), 0.0);
     vec3 diffuse_color = diffuse_intensity * vec3(1);
     outColor = vec4(normal, 1.0); // * uColor; 
}