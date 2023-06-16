class AnimationLoader {
  constructor(urlModel, urlAnimations) {
    this.model = null;
    this.urlModel = urlModel;
    this.urlAnimations = urlAnimations;
  }
  addPromiseLoader(promiseLoader) {
    this.promiseLoader = promiseLoader;
  }
  getModelWithAnimations() {
    return new Promise((res, rej) => {
      const animationAndModelPromises = [];
      animationAndModelPromises.push(this.promiseLoader.load(this.urlModel));

      Object.keys(this.urlAnimations).forEach(stringIndex => {
        animationAndModelPromises.push(this.promiseLoader.load(this.urlAnimations[stringIndex]));
      });

      Promise.all(animationAndModelPromises).then(paylaod => {
        const model = paylaod.shift();
        const animationEmptyModels = paylaod;

        const animations = [];

        Object.keys(this.urlAnimations).forEach(stringIndex => {
          animations[stringIndex * 1] = animationEmptyModels.shift().animations[0];
        });
        model.animations = animations;
        res(model);
      });
    });
  }
}

export default AnimationLoader;
