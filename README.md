sf-schema-to-ts
===============

A tool to generate TypeScript interfaces for LWC, according to the defined sObject schema.

<!-- toc -->
<!-- install -->

## Install
Execute following commands in order.

``` shell
yarn install
yarn build
sfdx plugins:link .
```
<!-- usage -->

## Usage

Run this tool at the main Salesforce project.

```
USAGE
  $ sfdx types:sobject:create -s <string> [-o <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -o, --outputdir=<value>                                                           [default: .] The folder where the interface file is generated
  -s, --sobject=<value>                                                             (required) The sObject API name to generate interface from
  -u, --targetusername=<value>                                                      username or alias for the target org; overrides default target org
  --apiversion=<value>                                                              override the api version used for api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation
```

<!-- commands -->
## Example

Generate IContact interface file to a path.

``` shell
sfdx types:sobject:create -o ./src/types/ -s Contact
```

Generate ILog (custom Object) interface file to a path.

``` shell
sfdx types:sobject:create -o ./src/types/ -s Log__c
```

<!-- debugging-your-plugin -->
## Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `types:sobject:create` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx types:sobject:create -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run types:sobject:create -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
