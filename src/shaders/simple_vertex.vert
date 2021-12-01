#version 300 es 

in vec4 aPosition;
in vec3 aNorm;

uniform mat4 projectionView;
uniform mat4 model;

out vec3 vNormal;
out vec3 vPosition;

void main() {
    vNormal = mat3(model) * aNorm;
    gl_Position =  projectionView * model * aPosition;
    vPosition = vec3(model * aPosition);
}