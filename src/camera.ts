import { vec3, mat4, glMatrix } from 'gl-matrix'

export class Camera {
  private _eye: vec3
  private _center: vec3
  private _up: vec3
  private _aspectRatio = 1.333
  private _fov = 60.0

  constructor(eye: vec3, pointTo: vec3, up: vec3) {
    this._eye = eye
    this._center = pointTo
    this._up = up
  }

  viewProjectionMatrix(): mat4 {
    const projection =  mat4.create()
    mat4.perspective(projection, glMatrix.toRadian(this._fov), this._aspectRatio, 0.1, 100.0)
    const view = mat4.create()
    mat4.lookAt(view, this._eye, this._center, this._up)
    const viewProjection = mat4.create()
    mat4.mul(viewProjection, projection, view)
    return viewProjection
  }
}