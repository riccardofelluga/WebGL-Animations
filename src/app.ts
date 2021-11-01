import { vec3, vec4, mat4, glMatrix } from 'gl-matrix'
import frag_sh_src from './shaders/simple_fragment.glsl'
import { vec4 } from 'gl-matrix'
import vert_sh_src from './shaders/simple_vertex.glsl'

class ShaderProgram {
	private _program: WebGLProgram
	private _gl: WebGL2RenderingContext
	private _is_liked = false

	constructor (gl: WebGL2RenderingContext) {
		this._gl = gl
		this._program = this._gl.createProgram()
	}

	addShader(gl_shader_typ: number, sh_src: string): void {
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

	bind(): void {
		if (!this._is_liked) {
			this._gl.linkProgram(this._program)
			this._gl.validateProgram(this._program)
		}
		this._is_liked = true
		this._gl.useProgram(this._program)
	}

	// TODO Unbind(): void { }

	getLocation(name: string): number {
		return this._gl.getAttribLocation(this._program, name)
	}

	setUniform(name: string, value: vec4) {
		if (!this._is_liked) {
			console.log('Program must be liked before setting uniform!')
			return
		}
		const location = this._gl.getUniformLocation(this._program, name)
		this._gl.uniform4fv(location, value)
	}
}

class Geometry {
	private _gl: WebGL2RenderingContext
	private _vbo_id: WebGLBuffer
	private _ibo_id: WebGLBuffer
	private _vao_id: WebGLVertexArrayObject
	private _ibo_size: number

	constructor (gl: WebGL2RenderingContext, vertex_buffer: Array<number>, index_buffer: Array<number>) {
		this._gl = gl
		this._vao_id = this._gl.createVertexArray()
		this._gl.bindVertexArray(this._vao_id)

		this._vbo_id = this._gl.createBuffer()
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo_id)
		this._gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_buffer), gl.STATIC_DRAW)

		this._ibo_size = index_buffer.length
		this._ibo_id = this._gl.createBuffer()
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._ibo_id)
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(index_buffer), this._gl.STATIC_DRAW)
	}

	setAttribute(location: number, size: number, stride: number, offset: number): void {
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo_id)
		this._gl.vertexAttribPointer(location, size, this._gl.FLOAT, false, stride, offset)
		this._gl.enableVertexAttribArray(location)
	}

	render(): void {
		this._gl.bindVertexArray(this._vao_id)
		this._gl.drawElements(this._gl.TRIANGLES, this._ibo_size, this._gl.UNSIGNED_INT, 0)
	}
}

function parseOBJ(text: string) {

	const vertexData = []
	const normalData = []
	const vertexIndices = []
	const normalIndices = []

	const keywords = {
		v: (args: Array<string>) => {
			args.forEach(a => vertexData.push(parseFloat(a)))
		},
		vn: (args: Array<string>) => {
			args.forEach(a => normalData.push(parseFloat(a)))
		},
		f: (args: Array<string>) => {
			args.forEach(a => {
				vertexIndices.push(parseFloat(a.split('/')[0]) - 1)
				normalIndices.push(parseFloat(a.split('/')[2]) - 1)
			})
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

	return {
		vertexData,
		normalData,
		vertexIndices,
		normalIndices
	}
}

class Camera {
	private _eye: vec3
	private _center: vec3
	private _direction: vec3
	private _up: vec3
	private _aspect_ratio = 1.333
	private _fov = 60.0

	constructor (eye: vec3, direction: vec3, up: vec3) {
		this._eye = eye
		this._direction = direction
		this._up = up
		this._center = vec3.add(vec3.create(), this._eye, this._direction)
	}

	viewProjectionMatrix(): mat4 {
		const perspective = mat4.perspective(mat4.create(), glMatrix.toRadian(this._fov), this._aspect_ratio, 0.1, 100.0)
		const look_at = mat4.lookAt(mat4.create(), this._eye, this._center, this._up)
		return mat4.mul(mat4.create(), perspective, look_at)
	}
}
function main() {
	const canvas = <HTMLCanvasElement>document.querySelector('#gl-context')
	const gl = canvas.getContext('webgl2')
	gl.viewport(0, 0, canvas.width, canvas.height)
	if (gl === null) {
		console.error('Unable to run WebGL2 on this browser.')
		return
	}
	gl.viewport(0, 0, canvas.width, canvas.height)

	const camera = new Camera(
		[0.0, 0.0, 3.0],
		[0.0, 0.0, -1.0],
		[0.0, 1.0, 0.0]
	)

	const program = new ShaderProgram(gl)
	program.addShader(gl.VERTEX_SHADER, vert_sh_src)
	program.addShader(gl.FRAGMENT_SHADER, frag_sh_src)
	program.bind()

	program.setUniform('u_color', [0.3, 0.2, 0.7, 1.0])
	program.setUniform('u_mv_mat', [0.3, 0.2, 0.7, 1.0])

	const a_location = program.getLocation('a_pos')
	const a_components = 2

	const cube = [
		0, 0,
		0, 0.5,
		0.7, 0,
		0.7, 0.5
	]
	const cube2 = [
		0.1, 0.1,
		0.1, 0.6,
		0.8, 0.1,
		0.8, 0.6
	]
	const cube_idx = [
		0, 1, 2,
		2, 1, 3
	]

	const mesh = new Geometry(gl, cube, cube_idx)
	mesh.setAttribute(a_location, a_components, 0, 0)

	const mesh2 = new Geometry(gl, cube2, cube_idx)
	mesh2.setAttribute(a_location, a_components, 0, 0)

	const OBJtext = `
	v 0 0
	v 0 -0.5
	v -0.7 0
	v -0.7 -0.5

	vn 1 1
	vn 1 1
	vn 1 1
	vn 1 1

	f 1//1 2//2 3//3
	f 3//3 2//2 4//4
	`
	const obj = parseOBJ(OBJtext)
	const mesh3 = new Geometry(gl, obj.vertexData, obj.vertexIndices)
	mesh3.setAttribute(a_location, a_components, 0, 0)

	gl.clearColor(0.8, 0.7, 0.7, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST)

	mesh.render()
	mesh2.render()
	mesh3.render()
}

window.onload = main