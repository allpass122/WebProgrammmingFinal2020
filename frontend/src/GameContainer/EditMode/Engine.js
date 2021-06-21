
export default function Engine(objects) {
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].update) {
            const result = objects[i].update(objects);
            switch (result.type) {
                case 'produce':
                    objects.push(result.object);
                    break;
                case 'destory':
                    objects.splice(i--, 1);
                    break;
                default:
                    break;
            }
        }
    }
}
