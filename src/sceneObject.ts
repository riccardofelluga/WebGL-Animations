import { vec4, mat4 } from 'gl-matrix'
import animSrc from './shaders/animation_vertex.vert'
import fragSrc from './shaders/simple_fragment.frag'
import { ShaderProgram } from './shaderProgram'
import vertSrc from './shaders/simple_vertex.vert'

export interface ObjectData {
  vertexData: Array<number>
  normalData: Array<number>
  controlPointData: Array<number>
  animationMode: boolean
}

export class SceneObject {
  private program_: ShaderProgram
  private model_ = mat4.create()
  private gl_: WebGL2RenderingContext
  private vao_: WebGLVertexArrayObject
  private bufferLength_ = 0
  private attributeSize_ = 0
  private bernsteinPoly_ = mat4.fromValues(
    1, 0, 0, 0,
    -3, 3, 0, 0,
    3, -6, 3, 0,
    -1, 3, -3, 1 )

  constructor(gl: WebGL2RenderingContext, data: ObjectData) {
    this.gl_ = gl
    this.program_ = new ShaderProgram(gl)
    this.program_.addShader(gl.VERTEX_SHADER, (data.controlPointData.length !== 0)?animSrc:vertSrc)
    this.program_.addShader(gl.FRAGMENT_SHADER, fragSrc)
    this.program_.bind()

    this.vao_ = gl.createVertexArray()
    const pos = this.setBuffer(data.vertexData)
    this.setAttribute(pos, 'aPosition', 3, 0, 0)
    const norm = this.setBuffer(data.normalData)
    this.setAttribute(norm, 'aNorm', 3, 0, 0)
    if (data.controlPointData.length !== 0) {
      const control = this.setBuffer(data.controlPointData)
      this.setAttribute(control, 'p0', 3, 12, 0)
      this.setAttribute(control, 'p1', 3, 12, 3)
      this.setAttribute(control, 'p2', 3, 12, 6)
      this.setAttribute(control, 'p3', 3, 12, 9)
      this.program_.setUniform('bPoly', this.bernsteinPoly_)
    }
  }

  destroy(){
    this.gl_.deleteVertexArray(this.vao_)
  }

  setBuffer(bufferData: Array<number>): WebGLBuffer {
    this.gl_.bindVertexArray(this.vao_)
    const buffer = this.gl_.createBuffer()
    this.gl_.bindBuffer(this.gl_.ARRAY_BUFFER, buffer)
    this.gl_.bufferData(this.gl_.ARRAY_BUFFER, new Float32Array(bufferData), this.gl_.STATIC_DRAW)
    this.bufferLength_ += bufferData.length
    return buffer
  }

  setAttribute(buffer:WebGLBuffer, name:string, attributeSize:number, attributeStride:number, attributeOffset:number){
    this.gl_.bindBuffer(this.gl_.ARRAY_BUFFER, buffer)
    const loc = this.program_.getLocation(name)
    this.gl_.vertexAttribPointer(loc, attributeSize, this.gl_.FLOAT, false, 4*attributeStride, 4*attributeOffset)
    this.gl_.enableVertexAttribArray(loc)
    this.attributeSize_ += attributeSize
  }

  setColor(colorRGBA: vec4): void {
    this.program_.setUniform('uColor', colorRGBA)
    this.program_.setUniform('uLightPosition', [ 2.0, 3.7, 2.5 ])
  }

  updateTime(dt:number){
    this.program_.setUniform('t', dt)
  }

  setModelMatrix(model: mat4): void {
    this.model_ = model
  }

  render(projectionViewMatrix: mat4, wireframeMode?:boolean): void {
    this.program_.setUniform('projectionView', projectionViewMatrix)
    this.program_.setUniform('model', this.model_)
    this.gl_.bindVertexArray(this.vao_)
    this.gl_.drawArrays(wireframeMode?this.gl_.LINES:this.gl_.TRIANGLES, 0, this.bufferLength_/this.attributeSize_)
  }
}
