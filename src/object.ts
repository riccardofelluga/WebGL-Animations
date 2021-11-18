import { vec4, mat4 } from 'gl-matrix'
import { Geometry } from './geometry'
import { ShaderProgram } from './shaderProgram'

export interface OBJData {
  vertexData: Array<number>
  normalData: Array<number>
  controlPointData: Array<number>
  animationMode: boolean
}

export class Object {
  private _geometry: Geometry
  private _program: ShaderProgram
  private _model = mat4.create()

  constructor(gl: WebGL2RenderingContext, data: OBJData, vertexSrc: string, fragmentSrc: string) {
    this._program = new ShaderProgram(gl)
    this._program.addShader(gl.VERTEX_SHADER, vertexSrc)
    this._program.addShader(gl.FRAGMENT_SHADER, fragmentSrc)
    this._program.bind()

    const posLocation = this._program.getLocation('aPosition')
    const posComponents = 3
    const normLocation = this._program.getLocation('aNorm')
    const normComponents = 3

    this._geometry = new Geometry(gl, data.vertexData, data.normalData)
    this._geometry.setAttribute(posLocation, posComponents, 0, 0, false)
    this._geometry.setAttribute(normLocation, normComponents, 0, 0, true)
  }

  setColor(colorRGBA: vec4): void{
    this._program.setUniform('uColor', colorRGBA)
    this._program.setUniform('uLightPosition', [ 2.0, 3.7, 2.5 ])
  }

  setModelMatrix(model: mat4): void{
    this._model = model
  }

  render(projectionViewMatrix: mat4): void {
    this._program.setUniform('projectionView', projectionViewMatrix)
    this._program.setUniform('model', this._model)
    this._geometry.render()
  }
}
