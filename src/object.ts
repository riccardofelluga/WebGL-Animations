import { vec4, mat4 } from 'gl-matrix'
import { Geometry } from './geometry'
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

    const vao = [ ...data.vertexData, ...data.normalData ]
    // const ibo = [ ...data.vertexIdx, ...data.normalIdx ]

    console.log(posLocation, posComponents, normLocation, normComponents)

    this._geometry = new Geometry(gl, vao, [])
    this._geometry.setAttribute(posLocation, posComponents, 0, 0)
    this._geometry.setAttribute(normLocation, normComponents, 0, data.vertexData.length)
  }

  setColor(colorRGBA: vec4): void{
    this._program.setUniform('uColor', colorRGBA)
    this._program.setUniform('uLightPosition', [ 1.0, 0.7, 0.5 ])
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
