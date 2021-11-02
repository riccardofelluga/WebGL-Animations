import { vec4, mat4 } from 'gl-matrix'

export class ShaderProgram {
  private _program: WebGLProgram;
  private _gl: WebGL2RenderingContext;
  private _isLinked = false;

  constructor (gl: WebGL2RenderingContext) {
    this._gl = gl
    this._program = this._gl.createProgram()
  }

  addShader(glShaderTyp: number, shSrc: string): void {
    const shader = this._gl.createShader(glShaderTyp)
    this._gl.shaderSource(shader, shSrc)
    this._gl.compileShader(shader)
    const compileSuccess = this._gl.getShaderParameter(
      shader,
      this._gl.COMPILE_STATUS
    )
    if (compileSuccess) {
      this._gl.attachShader(this._program, shader)
      return
    }
    console.error(this._gl.getShaderInfoLog(shader))
    this._gl.deleteShader(shader)
  }

  bind(): void {
    if (!this._isLinked) {
      this._gl.linkProgram(this._program)
      this._gl.validateProgram(this._program)
    }
    this._isLinked = true
    this._gl.useProgram(this._program)
  }

  // TODO Unbind(): void { }

  getLocation(name: string): number {
    return this._gl.getAttribLocation(this._program, name)
  }

  setUniform(name: string, value: vec4 | mat4): void {
    if (!this._isLinked) {
      console.log('Program must be liked before setting uniform!')
      return
    }
    const location = this._gl.getUniformLocation(this._program, name)
    if (value as mat4) {
      this._gl.uniformMatrix4fv(location, false, value)
    } else {
      this._gl.uniform4fv(location, value)
    }
  }
}