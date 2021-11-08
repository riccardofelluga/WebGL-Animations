export class Geometry {
  private _gl: WebGL2RenderingContext
  private _vboId: WebGLBuffer
  private _nboId: WebGLBuffer
  private _vaoId: WebGLVertexArrayObject
  private _vboSize: number
  private _totalAttributeSize = 0

  constructor (gl: WebGL2RenderingContext, vertexBuffer: Array<number>, normalsBuffer: Array<number>) {
    this._gl = gl
    this._vaoId = this._gl.createVertexArray()
    this._gl.bindVertexArray(this._vaoId)
    this._vboSize = vertexBuffer.length + normalsBuffer.length

    this._vboId = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vboId)
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertexBuffer), this._gl.STATIC_DRAW)

    this._nboId = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._nboId)
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(normalsBuffer), this._gl.STATIC_DRAW)
  }

  setAttribute(location: number, size: number, stride: number, offset: number, isNormal:boolean): void {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, (isNormal)?this._nboId:this._vboId)
    this._gl.vertexAttribPointer(location, size, this._gl.FLOAT, false, stride, offset)
    this._gl.enableVertexAttribArray(location)
    this._totalAttributeSize += size
  }

  render(): void {
    this._gl.bindVertexArray(this._vaoId)
    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vboSize/this._totalAttributeSize)
  }
}