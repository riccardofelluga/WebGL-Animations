import { OBJData, Object } from './object'
import { vec3, mat4, glMatrix } from 'gl-matrix'
import fragSrc from './shaders/simple_fragment.glsl'
import vertSrc from './shaders/simple_vertex.glsl'

function parseOBJ(text: string) {

  const vertexData = []
  const normalData = []
  const vertexIdx = []
  const normalIdx = []

  const keywords = {
    v: (args: Array<string>) => {
      args.forEach(a => vertexData.push(parseFloat(a)))
    },
    vn: (args: Array<string>) => {
      args.forEach(a => normalData.push(parseFloat(a)))
    },
    f: (args: Array<string>) => {
      for (let i = 1; i < args.length - 1; i++) {
        vertexIdx.push(parseFloat(args[0].split('/')[0]) - 1)
        vertexIdx.push(parseFloat(args[i].split('/')[0]) - 1)
        vertexIdx.push(parseFloat(args[i+1].split('/')[0]) - 1)

        normalIdx.push(parseFloat(args[0].split('/')[2]) - 1)
        normalIdx.push(parseFloat(args[i].split('/')[2]) - 1)
        normalIdx.push(parseFloat(args[i+1].split('/')[2]) - 1)
      }
    }
  }

  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '' || line[0] === '#') {
      continue
    }

    const keyword = line.split(/\s+/)[0]
    const args = line.split(/\s+/).splice(1)

    const handler = keywords[keyword]
    if (!handler) {
      console.log(`Unhandled keyword: ${keyword} at line ${i + 1}`)
      continue
    }

    handler(args)
  }

  const ret: OBJData = {
    vertexData,
    normalData,
    vertexIdx,
    normalIdx
  }

  return ret
}

class Camera {
  private _eye: vec3
  private _center: vec3
  private _direction: vec3
  private _up: vec3
  private _aspectRatio = 1.333
  private _fov = 60.0

  constructor(eye: vec3, direction: vec3, up: vec3) {
    this._eye = eye
    this._direction = direction
    this._up = up
    this._center = vec3.add(vec3.create(), this._eye, this._direction)
  }

  viewProjectionMatrix(): mat4{
    const perspective = mat4.perspective(mat4.create(), glMatrix.toRadian(this._fov), this._aspectRatio, 0.1, 100.0)
    const lookAt = mat4.lookAt(mat4.create(), this._eye, this._center, this._up)
    return mat4.mul(mat4.create(), perspective, lookAt)
  }
}

function main() {
  const canvas = <HTMLCanvasElement>document.querySelector('#gl-context')
  const gl = canvas.getContext('webgl2')
  if (gl === null) {
    console.error('Unable to run WebGL2 on this browser.')
    return
  }
  gl.viewport(0, 0, canvas.width, canvas.height)

  const data: OBJData = {
    vertexData: [
      0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      0.5, -0.5, -0.5,
      -0.5, -0.5, -0.5,
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5
    ],
    vertexIdx: [
      0, 1, 2, 1, 2, 3,
      4, 5, 6, 5, 6, 7,
      4, 0, 3, 0, 3, 7,
      5, 1, 2, 1, 2, 6,
      3, 2, 6, 2, 6, 7,
      0, 1, 3, 1, 3, 4,
    ],
    normalData: [],
    normalIdx: []
  }

  const camera = new Camera([ 0.0, 0.0, 3.0 ], [ 0.0, 0.0, -1.0 ], [ 0.0, 1.0, 0.0 ])
  const cube = new Object(gl, data, vertSrc, fragSrc)



  const OBJtext = `
    v 1 1 0
    v 0.5 1 0
    v 0.5 0.5 0
    v 1 0.5 0

    vn 0 0 0
    vn 0 0 0
    vn 0 0 0
    vn 0 0 0

    f 1//1 2//2 3//3 4//4
  `
  const obj = parseOBJ(OBJtext)
  const cube2 = new Object(gl, obj, vertSrc, fragSrc)

  gl.clearColor(0.8, 0.7, 0.7, 0.5)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)

  cube.render()
  cube2.render()
}

window.onload = main
