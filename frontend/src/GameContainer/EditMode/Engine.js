import constant from '../constant';

export default function Engine(objects, map) {
    for (let i = 0; i < constant.maxLayer; i++) {
        for (let j = 0; j < objects.length; j++) {
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
