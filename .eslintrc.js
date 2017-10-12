module.exports = {
    "env": {
        "browser": true,
<<<<<<< HEAD
        "es6": true
=======
        "commonjs": true,
        "es6": true,
        "node": true
>>>>>>> 76d49a72d342d0c23ce69dbdaf8e8b062cbbfc93
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};