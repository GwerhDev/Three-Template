import scene from './basic/Scene';
import camera from './basic/camera';
import renderer from './basic/Renderer';
import cube from './basic/shapes/Cube';
import light from './basic/Light';
import resize from './basic/Resize';
import plane from './basic/shapes/Plane';
import loopMachine from './basic/LoopMachine';
import keyListener from './basic/KeyListener';
import keyCode from './basic/KeyCode';
import characterController from './controllers/CharacterController';
import keyController from './controllers/KeyController';
import moveController from './controllers/MoveController';
import X_BotLoader from './models/characters/XBot/X_BotLoader';
import animationController from './controllers/AnimationController';
import modeController from './controllers/ModeController';

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


camera.position.set(2,2,-2);

X_BotLoader().then(bot => {
	scene.add(bot, light, plane);
	characterController.addCharacter(bot);
	characterController.addController(keyController);
	characterController.addController(moveController);
	characterController.addController(animationController);
	characterController.addController(modeController);
	characterController.start();
	camera.lookAt(bot.position);
})

loopMachine.addCallback(()=>{
	renderer.render(scene, camera);
});

resize.start(renderer);
loopMachine.start();
keyListener.start();
