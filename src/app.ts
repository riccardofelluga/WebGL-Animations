import simple_shader from './shaders/simple_shader.glsl'

function main() {
	const canvas = <HTMLCanvasElement>document.querySelector('#gl-context')
	const gl = canvas.getContext('webgl')

	if (gl === null) {
		console.error('Unable to run WebGL on this browser.')
		return
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)
}

window.onload = main