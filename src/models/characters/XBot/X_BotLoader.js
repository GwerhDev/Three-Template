import fileList from "./fileList"
import PromiseLoader from "../../../basic/PromiseLoader"
import AnimationLoader from "../../../basic/animations/AnimationLoader"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const folder = 'src/models/characters/XBot/'

const urlAnimations = {}

for(const [key, value] of Object.entries(fileList)) {
  urlAnimations[key] = folder + 'animations/' + value
}

const urlModel = folder + "X_Bot.fbx"

const X_BotLoader = () => {
  const animationLoader = new AnimationLoader(urlModel, urlAnimations)
  const promiseLoader = new PromiseLoader(FBXLoader, function(object) {
    const scale = .005
    object.scale.set(scale, scale, scale)
    object.traverse(function(child) {
      if(child.isMesh) {
        child.castShadow = true;
        child.recieveShadow = true;
      }
    });
    object.castShadow = true;
    object.recieveShadow = true;
    return object
  })
  animationLoader.addPromiseLoader(promiseLoader)
  return animationLoader.getModelWithAnimations()
}

export default X_BotLoader;