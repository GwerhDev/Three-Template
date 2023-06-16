import * as THREE from 'three';

const light = new THREE.AmbientLight( 0x404040 );

const directionalLight = new THREE.DirectionalLight( 0xffffff, .5)

directionalLight.position.set(-10, 10, 10)

light.add(directionalLight)



export default light;
