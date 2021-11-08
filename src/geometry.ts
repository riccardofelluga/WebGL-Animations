export class Geometry {
  private _gl: WebGL2RenderingContext
  private _vboId: WebGLBuffer
  private _iboId: WebGLBuffer
  private _vaoId: WebGLVertexArrayObject
  private _vboSize: number

  constructor (gl: WebGL2RenderingContext, vertexBuffer: Array<number>, indexBuffer: Array<number>) {
    this._gl = gl
    this._vaoId = this._gl.createVertexArray()
    this._gl.bindVertexArray(this._vaoId)

    this._vboId = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vboId)
    this._gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexBuffer), gl.STATIC_DRAW)

    this._vboSize = vertexBuffer.length
    console.log(this._vboSize, vertexBuffer)
    // this._iboSize = indexBuffer.length
    // this._iboId = this._gl.createBuffer()
    // this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._iboId)
    // this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexBuffer), this._gl.STATIC_DRAW)
  }

  setAttribute(location: number, size: number, stride: number, offset: number): void {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vboId)
    this._gl.vertexAttribPointer(location, size, this._gl.FLOAT, false, stride, offset)
    this._gl.enableVertexAttribArray(location)
  }

  render(): void {
    this._gl.bindVertexArray(this._vaoId)
    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vboSize/6)
  }
}