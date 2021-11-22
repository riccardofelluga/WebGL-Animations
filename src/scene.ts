import { ObjectData, SceneObject } from './sceneObject'
import { Camera } from './camera'
import fragSrc from './shaders/simple_fragment.glsl'
import vertSrc from './shaders/simple_vertex.glsl'

export interface SceneAnimationStatus {
    isPlaying: boolean,
    startFrame: number,
    endFrame: number
  }

class SceneAnimation {
}

export class Scene {

  private gl_ :WebGL2RenderingContext
  private camera_: Camera
  private object_: SceneObject
  private animation_: SceneAnimation

  constructor(gl: WebGL2RenderingContext, cam: Camera){
    this.gl_= gl
    this.camera_ = cam
    this.gl_.clearColor(0.12, 0.14, 0.17, 1.0)
    this.gl_.enable(this.gl_.DEPTH_TEST)
    this.gl_.enable(this.gl_.CULL_FACE)
  }

  addObject(data: ObjectData){
    const obj = new SceneObject(this.gl_, data, vertSrc, fragSrc)
    obj.setColor([ 0.8, 0.8, 0.8, 1.0 ])
    this.object_ = obj
  }

  renderScene(dt: DOMHighResTimeStamp, animationStatus: SceneAnimationStatus){
    this.gl_.clear(this.gl_.COLOR_BUFFER_BIT | this.gl_.DEPTH_BUFFER_BIT)
    this.object_.render(this.camera_.viewProjectionMatrix())
  }
}
