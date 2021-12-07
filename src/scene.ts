import { ObjectData, SceneObject } from './sceneObject'
import { Camera } from './camera'

export interface SceneAnimationStatus {
    isPlaying: boolean,
	currentFrame: number,
    startFrame: number,
    endFrame: number,
	subStartFrame: number,
	subEndFrame: number,
	animForward: boolean
}

class SceneAnimation {
}

export class Scene {

  private gl_ :WebGL2RenderingContext
  private camera_: Camera
  private object_: SceneObject
  private animation_: SceneAnimationStatus

  constructor(gl: WebGL2RenderingContext, cam: Camera){
    this.gl_= gl
    this.camera_ = cam
    this.gl_.clearColor(0.12, 0.14, 0.17, 1.0)
    this.gl_.enable(this.gl_.DEPTH_TEST)
    this.gl_.enable(this.gl_.CULL_FACE)
  }


  updateAnimation(){
  
	let totalFrames = Math.abs(this.animation_.endFrame - this.animation_.startFrame);
	let frameLength = 1.0 / totalFrames;
	let currentNorm = this.animation_.currentFrame / totalFrames;
	
	if(this.animation_.animForward) {
		this.object_.updateTime(currentNorm + frameLength) //goes from 0.0 -> 1.0
		this.animation_.currentFrame += 1
		if(this.animation_.currentFrame > this.animation_.subEndFrame) {
			this.animation_.currentFrame = this.animation_.subStartFrame;
		}
	}
	else {
		this.object_.updateTime(currentNorm - frameLength) //goes from 1.0 -> 0.0
		this.animation_.currentFrame -= 1;
		if(this.animation_.currentFrame < this.animation_.subStartFrame) {
			this.animation_.currentFrame = this.animation_.subEndFrame;
		}
	}
	
  }

  setObject(data: ObjectData) {
    if (this.object_){
      this.object_.destroy()
    }
    const obj = new SceneObject(this.gl_, data)
    obj.setColor([ 0.8, 0.8, 0.8, 1.0 ])
    this.object_ = obj
  }

  //this will need to be modified.
  /*
  setKeyframes(start: number, end: number){
    this.currentFrame_ = start
    this.endFrame_ = end
  }
  */
  
  setAnimationStatus(status: SceneAnimationStatus) {
	this.animation_ = status;
  }

  renderScene(dt: DOMHighResTimeStamp){
    this.gl_.clear(this.gl_.COLOR_BUFFER_BIT | this.gl_.DEPTH_BUFFER_BIT)
    this.object_.render(this.camera_.viewProjectionMatrix())
	
	if(this.animation_.isPlaying){ this.updateAnimation() }
	else if(!this.animation_.isPlaying) { }
	
  }
}
