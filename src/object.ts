import { Geometry } from './geometry'
import { mat4 } from 'gl-matrix'
import { ShaderProgram } from './shaderProgram'

export interface OBJData {
  vertexData: Array<number>
  vertexIdx: Array<number>
  normalData: Array<number>
  normalIdx: Array<number>
}

export class Object {
  private _geometry: Geometry
  private _program: ShaderProgram
  private _viewProjection: mat4
  private _model: mat4

  constructor(gl: WebGL2RenderingContext, data: OBJData, vertexSrc: string, fragmentSrc: string) {
    this._program = new ShaderProgram(gl)
    this._program.addShader(gl.VERTEX_SHADER, vertexSrc)
    this._program.addShader(gl.FRAGMENT_SHADER, fragmentSrc)
    this._program.bind()

    this._program.setUniform('color', [ 0.3, 0.2, 0.7, 1.0 ])
    this._program.setUniform('projectionView', this._viewProjection)

    const posLocation = this._program.getLocation('vPosition')
    const posComponents = 3

    this._geometry = new Geometry(gl, data.vertexData, data.vertexIdx)
    this._geometry.setAttribute(posLocation, posComponents, 0, 0)
  }

  render(): void {
    this._program.setUniform('model', this._model)
    this._geometry.render()
  }
}
