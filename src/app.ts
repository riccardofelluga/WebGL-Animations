import frag_sh_src from './shaders/simple_fragment.glsl'
import vert_sh_src from './shaders/simple_vertex.glsl'

class ShaderProgram {
	private _program: WebGLProgram
	private _gl: WebGL2RenderingContext
	private _is_liked = false

	constructor (gl: WebGL2RenderingContext) {
		this._gl = gl
		this._program = this._gl.createProgram()
	}

	AddShader(gl_shader_typ: number, sh_src: string): void {
		const shader = this._gl.createShader(gl_shader_typ)
		this._gl.shaderSource(shader, sh_src)
		this._gl.compileShader(shader)
		const compile_success = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)
		if (compile_success) {
			this._gl.attachShader(this._program, shader)
			return
		}
		console.error(this._gl.getShaderInfoLog(shader))
		this._gl.deleteShader(shader)
	}

	Bind(): void {
		if (!this._is_liked) {
			this._gl.linkProgram(this._program)
			this._gl.validateProgram(this._program)
		}
		this._is_liked = true
		this._gl.useProgram(this._program)
	}

	// TODO Unbind(): void { }

	GetLocation(name: string): number {
		return this._gl.getAttribLocation(this._program, name)
	}

}


function main() {
	const canvas = <HTMLCanvasElement>document.querySelector('#gl-context')
	const gl = canvas.getContext('webgl')
	gl.viewport(0, 0, canvas.width, canvas.height)
	if (gl === null) {
		console.error('Unable to run WebGL on this browser.')
		return
	}

	const program = new ShaderProgram(gl)
	program.AddShader(gl.VERTEX_SHADER, vert_sh_src)
	program.AddShader(gl.FRAGMENT_SHADER, frag_sh_src)
	program.Bind()

	const pos_buffer = gl.createBuffer()
	const a_location = program.GetLocation('a_pos')
	const a_pos_ncomponents = 2

	const triangle: Array<number> = [
		0, 0,
		0, 0.5,
		0.7, 0
	]

	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW)
	gl.enableVertexAttribArray(a_location)
	gl.vertexAttribPointer(a_location, a_pos_ncomponents, gl.FLOAT, false, 0, 0)


	gl.clearColor(0.8, 0.7, 0.7, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST)

	gl.drawArrays(gl.TRIANGLES, 0, 3)
}

window.onload = main