#version 300 es 

in vec4 aPosition;
in vec3 aNorm;
in vec3 p0;
in vec3 p1;
in vec3 p2;
in vec3 p3;

uniform mat4 projectionView;
uniform mat4 model;
uniform mat4 bPoly;
uniform float t;

out vec3 vNormal;
out vec3 vPosition;

void main() {
    mat4 pointsOnModel = mat4(vec4(p0, 1), vec4(p1, 1), vec4(p2, 1), vec4(p3, 1));
    vec4 posOnB = pointsOnModel * bPoly * vec4(1, t, t*t, t*t*t);
    mat4 tModel = mat4(1);
    tModel[3] = vec4(posOnB.xyz ,1.0);
    vNormal = mat3(model) * aNorm;
    gl_Position =  projectionView  * model * tModel *  aPosition;
    vPosition = vec3(model * aPosition);
}