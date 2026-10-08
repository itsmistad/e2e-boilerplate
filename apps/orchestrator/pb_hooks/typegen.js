/// <reference path="../pb_data/types.d.ts" />

/**
 * @param {core.CollectionEvent} e
 */
const generateTypes = (e) => {
    console.log('Collection changed - Running type generation...');
    const cmd = $os.cmd('./scripts/gen-pb-types.sh');
    const result = toString(cmd.output());
    console.log(result);

    e.next();
};

onCollectionAfterCreateSuccess(generateTypes);
onCollectionAfterUpdateSuccess(generateTypes);
onCollectionAfterDeleteSuccess(generateTypes);
