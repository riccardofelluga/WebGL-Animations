attribute vec4 vPosition;

uniform mat4 projectionView;
uniform mat4 model;

void main() {
    gl_Position =  projectionView * model * vPosition;
}