import { ObjectData, SceneObject } from './sceneObject'
import { Camera } from './camera'
import fragSrc from './shaders/simple_fragment.glsl'
import { mat4 } from 'gl-matrix'
import vertSrc from './shaders/animation_vertex.vert'

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
  private currentFrame_: number
  private endFrame_ :number

  constructor(gl: WebGL2RenderingContext, cam: Camera){
    this.gl_= gl
    this.camera_ = cam
    this.gl_.clearColor(0.12, 0.14, 0.17, 1.0)
    this.gl_.enable(this.gl_.DEPTH_TEST)
    this.gl_.enable(this.gl_.CULL_FACE)
  }

  addObject(data: ObjectData){

  updateAnimation(dt){
    this.object_.updateTime(dt)
  }

  addObject(data: ObjectData) {
    this.prepareAnimation(data.animationMode, data.controlPointData)
    const obj = new SceneObject(this.gl_, data, vertSrc, fragSrc)
    obj.setColor([ 0.8, 0.8, 0.8, 1.0 ])
    this.object_ = obj
  }

  setKeyframes(start: number, end: number){
    this.currentFrame_ = start
    this.endFrame_ = end
  }

  renderScene(dt: DOMHighResTimeStamp){
    this.gl_.clear(this.gl_.COLOR_BUFFER_BIT | this.gl_.DEPTH_BUFFER_BIT)
    this.object_.render(this.camera_.viewProjectionMatrix())
    if (this.currentFrame_ < this.endFrame_){
      this.updateAnimation(this.currentFrame_/this.endFrame_)
      this.currentFrame_++
    }
  }
}
