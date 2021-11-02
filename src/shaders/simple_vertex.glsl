attribute vec4 vPosition;

// uniform mat4 projectionView;
// uniform mat4 model;

void main() {
    //projectionView * model *
    gl_Position =  vPosition;
}