import constant from '../constant';
import { CONSTANT } from './PlayModeConstant';

export default function Engine(objects, map, status) {
    const {me} = status
    const needEngin = ['movingPlatform','movingPlatform_oblique', 'movingPlatform_rect', 
                'bow', 'arrow', 'missile', 'missileBase', 'cymbal','cymbalWave', 'woodenBox', 'mucus' ]

    for (let i = 0; i < constant.maxLayer; i++) {
        for (let j = 0; j < objects.length; j++) {
            if ( status.gameState === CONSTANT.PLAYING 
                && !inView(objects[j].pos, me) 
                && !needEngin.includes(objects[j].type) ) continue 
            if (objects[j].update) {
                const result = objects[j].update(objects, map);
                switch (result.type) {
                    case 'produce':
                        objects.push(result.object);
                        break;
                    case 'destory':
                        objects.splice(j--, 1);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

function inView(ObjPos, me){
    const [halfViewX, halfViewY] = [250, 180]
    if ( ObjPos.x > me.pos.x - halfViewX && ObjPos.x < me.pos.x + halfViewX 
            && ObjPos.y > me.pos.y - halfViewY && ObjPos.y < me.pos.y + halfViewY ){
                // console.log('me ', me.pos)
                // console.log('obj ', ObjPos)
                // console.log("inView")
                return true
            }
    else return false
}