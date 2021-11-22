import { Scene, SceneAnimationStatus } from './scene'
import { ButtonFunctionality } from './buttons'
import { Camera } from './camera'
import { ObjectData } from './sceneObject'

new ButtonFunctionality('fileinput')
new ButtonFunctionality('b1')
new ButtonFunctionality('b2')
new ButtonFunctionality('b3')
new ButtonFunctionality('b4')
new ButtonFunctionality('b5')

window.onload = main
window.loadOBJ = function (text: string) {
  OBJtext = text
  main()
}

function parseOBJ(text: string) {

  const tmpV = []
  const tmpN = []
  const tmpC = []

  const vertexData = []
  const normalData = []
  const controlPointData = []
  let animationMode = false //false = geometric, true = vertex

  const keywords = {
    a: (args: Array<string>) => {
      animationMode = args[0] === 'v'
    },
    v: (args: Array<string>) => {
      tmpV.push(args.map(a => parseFloat(a)))
    },
    vn: (args: Array<string>) => {
      tmpN.push(args.map(a => parseFloat(a)))
    },
    f: (args: Array<string>) => {
      for (let i = 1; i < args.length - 1; i++) {
        tmpV[parseInt(args[0].split('/')[0]) - 1].forEach(a => vertexData.push(parseFloat(a)))
        tmpV[parseInt(args[i].split('/')[0]) - 1].forEach(a => vertexData.push(parseFloat(a)))
        tmpV[parseInt(args[i+1].split('/')[0]) - 1].forEach(a => vertexData.push(parseFloat(a)))

        tmpN[parseInt(args[0].split('/')[2]) - 1].forEach(a => normalData.push(parseFloat(a)))
        tmpN[parseInt(args[i].split('/')[2]) - 1].forEach(a => normalData.push(parseFloat(a)))
        tmpN[parseInt(args[i+1].split('/')[2]) - 1].forEach(a => normalData.push(parseFloat(a)))

        if (tmpC.length !== 0) {
          tmpC[parseInt(args[0].split('/')[3]) - 1].forEach(a => controlPointData.push(parseFloat(a)))
          tmpC[parseInt(args[i].split('/')[3]) - 1].forEach(a => controlPointData.push(parseFloat(a)))
          tmpC[parseInt(args[i+1].split('/')[3]) - 1].forEach(a => controlPointData.push(parseFloat(a)))
        }
      }
    },
    c: (args: Array<string>) => {
      tmpC.push(args.map(a => parseFloat(a)))
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
      continue
    }

    handler(args)
  }

  const ret: ObjectData = {
    vertexData,
    normalData,
    controlPointData,
    animationMode
  }

  return ret
}

let OBJtext = ''
/*`
a g

v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 1.000000 -1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -1.000000 1.000000

vn 0.0000 1.0000 0.0000
vn 0.0000 0.0000 1.0000
vn -1.0000 0.0000 0.0000
vn 0.0000 -1.0000 0.0000
vn 1.0000 0.0000 0.0000
vn 0.0000 0.0000 -1.0000

c 0 0 0 1 0 0 0 1 0 1 1 0

f 1/1/1/1 5/2/1/1 7/3/1/1 3/4/1/1
f 4/5/2/1 3/4/2/1 7/6/2/1 8/7/2/1
f 8/8/3/1 7/9/3/1 5/10/3/1 6/11/3/1
f 6/12/4/1 2/13/4/1 4/5/4/1 8/14/4/1
f 2/13/5/1 1/1/5/1 3/4/5/1 4/5/5/1
f 6/11/6/1 5/10/6/1 1/1/6/1 2/13/6/1
`*/

const animationStatus: SceneAnimationStatus = {
  isPlaying: false,
  startFrame: 0,
  endFrame: 150
}


function main() {
  const canvas = <HTMLCanvasElement>document.querySelector('#gl-context')
  const gl = canvas.getContext('webgl2')
  if (gl === null) {
    console.error('Unable to run WebGL2 on this browser.')
    return
  }
  gl.viewport(0, 0, canvas.width, canvas.height)

  const camera = new Camera([ 2.0, 3.0, 4.0 ], [ 0.0, 0.0, 0.0 ], [ 0.0, 1.0, 0.0 ])
  const scene = new Scene(gl, camera)
  const obj = parseOBJ(OBJtext)

  console.log(obj)
  scene.addObject(obj)

  function render(time: DOMHighResTimeStamp){
    time *= 0.001

    // const model = mat4.create()
    // mat4.fromYRotation(model, time)
    // cube.setModelMatrix(model)

    scene.renderScene(time, animationStatus)
    if (animationStatus.isPlaying) requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}