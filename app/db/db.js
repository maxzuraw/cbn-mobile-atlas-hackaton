import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("cbn-settings-v3.db");

export const dropTable = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS settings', [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                })
        });
    })
    return promise;
}

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS settings (' +
                'id INTEGER PRIMARY KEY NOT NULL, ' +
                'name TEXT NOT NULL, ' +
                'backendServer TEXT NOT NULL, ' +
                'user TEXT NOT NULL, ' +
                'password TEXT NOT NULL, ' +
                'withSsl INTEGER NOT NULL DEFAULT 0, ' +
                'isDefault INTEGER NOT NULL DEFAULT 0, ' +
                'UNIQUE (name))', [],
                () => {
                    resolve();
                    },
                (_, err) => {
                    reject(err);
                })
        });
    })
    return promise;
};

export const resetDefaultSettings = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('UPDATE settings set isDefault = 0 where isDefault = 1', [],
            (_, result) => {
                resolve(result);
            },
            (_, err) => {
            reject(err);
            });
        })
    });
    return promise;
}

export const fetchAllSettings = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM settings', [],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                });
        })
    });
    return promise;
}

export const fetchDefaultSettings = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM settings WHERE isDefault=1', [],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                });
        })
    });
    return promise;
}

export const fetchSettingsByName = (name) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM settings WHERE name = ?',
                [name],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                })
        });
    })
    return promise;
}

export const deleteSettings = (id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM settings WHERE id = ? ',
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                })
        });
    })
    return promise;
}

export const updateSettings = (settingsData) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('UPDATE settings SET ' +
                'name = ?, ' +
                'backendServer = ?, ' +
                'user = ?, ' +
                'password = ?, ' +
                'withSsl = ?, ' +
                'isDefault = ? ' +
                'WHERE id = ? ',
                [settingsData.name,
                    settingsData.backendServer,
                    settingsData.user,
                    settingsData.password,
                    settingsData.withSsl ? 1 : 0,
                    settingsData.isDefault ? 1 : 0,
                    settingsData.id
                ],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                })
        });
    })
    return promise;
}

export const insertSettings = (settingsData) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO settings (name, ' +
                'backendServer, ' +
                'user, ' +
                'password, ' +
                'withSsl, ' +
                'isDefault) ' +
                ' VALUES (?, ?, ?, ?, ?, ?) ',
                [settingsData.name,
                    settingsData.backendServer,
                    settingsData.user,
                    settingsData.password,
                    settingsData.withSsl ? 1 : 0,
                    settingsData.isDefault ? 1 : 0],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                })
        });
    })
    return promise;
}