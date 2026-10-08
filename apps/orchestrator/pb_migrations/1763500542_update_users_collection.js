/// <reference path="../pb_data/types.d.ts" />

/**
 * @param {core.App} app
 */
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId('users');

        // Add name field if it doesn't exist
        const nameField = collection.fields.getByName('name');
        if (nameField) {
            nameField.required = true;
            nameField.presentable = true;
        }

        // Add role field if it doesn't exist
        if (!collection.fields.getByName('role')) {
            collection.fields.add(
                new SelectField({
                    system: true,
                    id: 'role',
                    name: 'role',
                    required: true,
                    presentable: true,
                    maxSelect: 1,
                    values: ['user', 'admin'],
                }),
            );
        }

        // Add mfaEnabled field if it doesn't exist
        if (!collection.fields.getByName('mfaEnabled')) {
            collection.fields.add(
                new BoolField({
                    system: false,
                    id: 'mfaEnabled',
                    name: 'mfaEnabled',
                    required: false,
                    presentable: false,
                }),
            );
        }

        // Add mfaSecret field if it doesn't exist
        if (!collection.fields.getByName('mfaSecret')) {
            collection.fields.add(
                new TextField({
                    system: false,
                    id: 'mfaSecret',
                    name: 'mfaSecret',
                    required: false,
                    presentable: false,
                }),
            );
        }

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId('users');

        // Remove fields in reverse order (down migration)
        if (collection.fields.getByName('mfaSecret')) {
            collection.fields.removeByName('mfaSecret');
        }

        if (collection.fields.getByName('mfaEnabled')) {
            collection.fields.removeByName('mfaEnabled');
        }

        if (collection.fields.getByName('role')) {
            collection.fields.removeByName('role');
        }

        const nameField = collection.fields.getByName('name');
        if (nameField) {
            nameField.required = false;
            nameField.presentable = false;
        }

        return app.save(collection);
    },
);
