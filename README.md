# create-umbraco-package
A CLI tool to help scaffold and bootstrap Umbraco extensions in the WebComponent based backoffice of Umbraco

## Build
* `npm install`
* `npm run build`
* `npm link`
This will globally install a symlink linking to your current project so there's no need for you to re-run this when we update our code. After running npm link you should have your CLI commands available.

* `create-package`


### Notes about commands
`npm create vite` is shorthand for the following:
* `npm init vite` which is shorthand for  `npm exec create-vite`

`npm create @umbraco/umbraco-package`
* `npm init @umbraco/umbraco-package` which is shorthand for`npm exec @umbraco/create-umbraco-package`
Note: `npm exec` is the verbose form of `npx`
