![Banner image](images/n8n-and-n8nhackers.png)

# n8n-nodes-starter

This repo contains example nodes to help you get started building your own custom integrations for [n8n](https://n8n.io) and [n8n hackers](https://n8nhackers.com). 

If you want to learn step by step how to build your own community nodes, [join our course](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/) at n8n hackers. 

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows). Depending on your n8n version, one node version or another will be required to start n8n: 
	```
	# n8n 1.105.3 requires lts/iron
	# There is a .nvmrc file that sets the minimum version for n8n using nvm.
	# Run the next command to install the required version to start
	nvm use
	```
* Install n8n with:
  ```
  npm install n8n -g
  ```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1. [Generate a new repository](https://github.com/n8nhackers/n8n-nodes-starter/generate) from this template repository.
2. Clone your new repo:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```
3. Run `npm i` to install dependencies.
4. Open the project in your editor.
5. Browse the examples in `/nodes` and `/credentials`. Modify the examples, or replace them with your own nodes.
6. Update the `package.json` to match your details.
7. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible.
8. Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance, or follow the next steps:
```sh

# Build a compiled version. Always.
npm run build

# Link built version in the system. First time execution.
npm link

# Create custom directory in .n8n if required. First time execution.
mkdir -p ~/.n8n/custom/

# Go to custom directory. First time execution.
cd ~/.n8n/custom/

# Link current community node in the directory. 
# It will be installed under ~/.n8n/custom/node_modules
# First time execution.
npm link n8n-nodes-starter

# Check existing link. First time execution.
npm -g ls
#output sample:
# ├── n8n-nodes-starter@0.1.0 -> ./../../../../../Documents/companies/n8nhackers/n8n-nodes-starter

# Start n8n to test your community node. Always.
n8n start
```
10. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the LICENSE file to use your details.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.
```sh
# Push changes to repository
git commit -a -m "Change X"
git push

# Login with npm
npm login

# Publish the version
npm publish
```

## Publication

To make your custom node available to the community, you must create it as an npm package, and [submit it to the npm registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

If you would like your node to be available on n8n cloud you can also [submit your node for verification](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/).

## TL;DR 

You can also use the next ready-to-use samples for your n8n (self-hosted version):

- [Sample n8n-nodes-starter actions](https://raw.githubusercontent.com/n8nhackers/n8n-nodes-starter/refs/heads/main/use-cases/sample-n8n-nodes-starter-actions-workflow.json)![Sample n8n-nodes-starter](images/sample-n8n-nodes-starter-actions-workflow.png?raw=true "Sample n8n-nodes-starter actions")
- [Sample n8n-nodes-starter triggers](https://raw.githubusercontent.com/n8nhackers/n8n-nodes-starter/refs/heads/main/use-cases/sample-n8n-nodes-starter-triggers-workflow.json)![Sample n8n-nodes-starter](images/sample-n8n-nodes-starter-triggers-workflow.png?raw=true "Sample n8n-nodes-starter triggers")

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## Version history

Here you can find the list of changes applied to this node:
- 0.1.0: Initial version

## Issues

If you have any issues, please [let us know on GitHub](https://github.com/n8nhackers/n8n-nodes-brightdata/issues).

## About

Special thanks to [N8n nodemation](https://n8n.io) workflow automation by [Jan Oberhauser](https://www.linkedin.com/in/janoberhauser/).

This node was forked and adapted by [n8nhackers.com](https://n8nhackers.com) and [Miquel Colomer](https://www.linkedin.com/in/miquelcolomersalas/). For productive use and consulting on this, [contact us please](mailto:support@n8nhackers.com).

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

