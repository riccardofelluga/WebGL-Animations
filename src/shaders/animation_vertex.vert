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
    vec4 movedP0 = vec4(p0 - p0, 1);
    vec4 movedP1 = vec4(p1 - p0, 1);
    vec4 movedP2 = vec4(p2 - p0, 1);
    vec4 movedP3 = vec4(p3 - p0, 1);
    mat4 pointsOnModel = mat4(movedP0, movedP1, movedP2, movedP3);
    vec4 posOnB = pointsOnModel * bPoly * vec4(1, t, t*t, t*t*t);
    mat4 tModel = mat4(1);
    tModel[3] = vec4(posOnB.xyz ,1.0);
    vNormal = mat3(model) * aNorm;
    gl_Position =  projectionView * model * tModel *  aPosition;
    vPosition = vec3(model * aPosition);
}