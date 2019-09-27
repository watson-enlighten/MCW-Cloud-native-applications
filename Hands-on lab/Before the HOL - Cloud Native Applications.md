!["Microsoft Cloud Workshops"][logo]

<div class="MCWHeader1">
Cloud Native Applications
</div>

<div class="MCWHeader2">
Before the hands-on lab setup guide
</div>

<div class="MCWHeader3">
October 2019
</div>

Information in this document, including URL and other Internet Web site references, is subject to change without notice. Unless otherwise noted, the example companies, organizations, products, domain names, e-mail addresses, logos, people, places, and events depicted herein are fictitious, and no association with any real company, organization, product, domain name, e-mail address, logo, person, place or event is intended or should be inferred. Complying with all applicable copyright laws is the responsibility of the user. Without limiting the rights under copyright, no part of this document may be reproduced, stored in or introduced into a retrieval system, or transmitted in any form or by any means (electronic, mechanical, photocopying, recording, or otherwise), or for any purpose, without the express written permission of Microsoft Corporation.

Microsoft may have patents, patent applications, trademarks, copyrights, or other intellectual property rights covering subject matter in this document. Except as expressly provided in any written license agreement from Microsoft, the furnishing of this document does not give you any license to these patents, trademarks, copyrights, or other intellectual property.

The names of manufacturers, products, or URLs are provided for informational purposes only and Microsoft makes no representations and warranties, either expressed, implied, or statutory, regarding these manufacturers or the use of the products with any Microsoft technologies. The inclusion of a manufacturer or product does not imply endorsement of Microsoft of the manufacturer or product. Links may be provided to third party sites. Such sites are not under the control of Microsoft and Microsoft is not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. Microsoft is not responsible for webcasting or any other form of transmission received from any linked site. Microsoft is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement of Microsoft of the site or the products contained therein.

© 2019 Microsoft Corporation. All rights reserved.

**Contents**

<!-- TOC -->

- [Cloud Native Applications before the hands-on lab setup guide](#Cloud-Native-Applications-before-the-hands-on-lab-setup-guide)
  - [Requirements](#Requirements)
  - [Before the hands-on lab](#Before-the-hands-on-lab)
    - [Task 1: Resource Group](#Task-1-Resource-Group)
    - [Task 2: Create an SSH key](#Task-2-Create-an-SSH-key)
    - [Task 3: Create a Service Principal](#Task-3-Create-a-Service-Principal)
    - [Task 4: ARM Template](#Task-4-ARM-Template)
    - [Task 5: Connect securely to the build agent](#Task-5-Connect-securely-to-the-build-agent)
    - [Task 6: Complete the build agent setup](#Task-6-Complete-the-build-agent-setup)
    - [Task 7: Download the FabMedical starter files](#Task-7-Download-the-FabMedical-starter-files)

<!-- /TOC -->

# Cloud Native Applications before the hands-on lab setup guide

## Requirements

1. Microsoft Azure subscription must be pay-as-you-go or MSDN.

   - Trial subscriptions will _not_ work.

   - To complete this lab (including [Task 3: Create a Service Principal](#task-3-create-a-service-principal)) ensure your account has the following roles:

     - The [Owner](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#owner) built-in role for the subscription you will use.
     - The [Application Administrator](https://docs.microsoft.com/en-us/azure/active-directory/users-groups-roles/directory-assign-admin-roles#application-administrator) built-in role for the Azure AD tenant you will use.

   - You must have enough cores available in your subscription to create the build agent and Azure Kubernetes Service cluster in Task 5: Create a build agent VM and Task 10: Create an Azure Kubernetes Service cluster. You'll need eight cores if following the exact instructions in the lab, more if you choose additional agents or larger VM sizes. If you execute the steps required before the lab, you will be able to see if you need to request more cores in your sub.

2. An Azure DevOps account

3. Local machine or a virtual machine configured with:

   - A browser, preferably Chrome for consistency with the lab implementation tests.

4. You will be asked to install other tools throughout the exercises.

## Before the hands-on lab

**Duration**: 1 hour

You should follow all of the steps provided in this section _before_ taking part in the hands-on lab ahead of time as some of these steps take time.

### Task 1: Resource Group

You will create an Azure Resource Group to hold most of the resources that you create in this hands-on lab. This approach will make it easier to clean up later.

1. In your browser, navigate to the **Azure Portal** (<https://portal.azure.com>).

2. Select **+ Create a resource** in the navigation bar at the left.

   ![This is a screenshot of the + Create a resource link in the navigation bar.](media/b4-image4.png)

3. In the Search the Marketplace search box, type \"Resource group\" and press Enter.

   ![Resource Group is typed in the Marketplace search box.](media/b4-image5.png)

4. Select **Resource group** on the Everything blade and select **Create**.

   ![This is a screenshot of Resource group on the Everything blade.](media/b4-image6.png)

5. On the new Resource group blade, set the following:

   - **Subscription:** Select the subscription you will use for all the steps during the lab.

   - **Resource group:** Enter something like "fabmedical-SUFFIX", as shown in the following screenshot.

- **Region:** Choose a region where all Azure Container Registry SKUs have to be available, which is currently Canada Central, Canada East, North Central US, Central US, South Central US, East US, East US 2, West US, West US 2, West Central US, France Central, UK South, UK West, North Europe, West Europe, Australia East, Australia Southeast, Brazil South, Central India, South India, Japan East, Japan West, Korea Central, Southeast Asia, East Asia, and remember this for future steps so that the resources you create in Azure are all kept within the same region (example: `East US`).


    ![In the Resource group blade, the value for the Resource group box is fabmedical-sol, and the value of the Region box is East US.](media/b4-image7.png)

- Select **Review + Create** and then **Create**.

1. When this completes, your Resource Group will be listed in the Azure Portal.

   ![In this screenshot of the Azure Portal, the fabmedical-sol Resource group is listed.](media/b4-image8.png)

### Task 2: Create an SSH key

In this section, you will create an SSH key to securely access the VMs you create during the upcoming exercises.

1. Open cloud shell by selecting the cloud shell icon in the menu bar.

   ![The cloud shell icon is highlighted on the menu bar.](media/b4-image35.png)

2. The cloud shell will open in the browser window. Choose "Bash" if prompted or use the left-hand dropdown on the shell menu bar to choose "Bash" (as shown).

   ![This is a screenshot of the cloud shell opened in a browser window. Bash was selected.](media/b4-image36.png)

3. Before completing the steps to create the SSH key, you should make sure to set your default subscription correctly. To view your current subscription type:

   ```bash
   az account show
   ```

   ![In this screenshot of a Bash window, az account show has been typed and run at the command prompt. Some subscription information is visible in the window, and some information is obscured.](media/b4-image37.png)

4. To list all of your subscriptions, type:

   ```bash
   az account list
   ```

   ![In this screenshot of a Bash window, az account list has been typed and run at the command prompt. Some subscription information is visible in the window, and some information is obscured.](media/b4-image38.png)

5. To set your default subscription to something other than the current selection, type the following, replacing {id} with the desired subscription id value:

   ```bash
   az account set --subscription {id}
   ```

6. From the cloud shell command line, enter the following command to ensure that a directory for the SSH keys is created. You can ignore any errors you see in the output.

   ```bash
       mkdir .ssh
   ```

7. From the cloud shell command line, enter the following command to generate an SSH key pair. You can replace "admin" with your preferred name or handle.

   ```bash
   ssh-keygen -t RSA -b 2048 -C admin@fabmedical
   ```

8. You will be asked to save the generated key to a file. Enter \".ssh/fabmedical\" for the name.

9. Enter a passphrase when prompted, and **don't forget it**!

10. Because you entered ".ssh/fabmedical", the file will be generated in the ".ssh" folder in your user folder, where cloud shell opens by default.

11. Keep this cloud shell open and remain in the default directory, you will use it in later tasks.

    ![In this screenshot of the cloud shell window, ssh-keygen -t RSA -b 2048 -C admin@fabmedical has been typed and run at the command prompt. Information about the generated key appears in the window.](media/b4-image57.png)

12. Type the following command at the cloud shell prompt to display the public key that you generated and save the entire content of the file because you will need it later:

    ```bash
    cat .ssh/fabmedical.pub
    ```

    ![In this screenshot of the cloud shell window, cat .ssh/fabmedical.pub has been typed and run at the command prompt, which displays the public key that you generated.](media/b4-image59.png)

### Task 3: Create a Service Principal

Azure Kubernetes Service requires an Azure Active Directory service principal to interact with Azure APIs. The service principal is needed to dynamically manage resources such as user-defined routes and the Layer 4 Azure Load Balancer. The easiest way to set up the service principal is using the Azure cloud shell.

> **Note**: To complete this task ensure your account has the following roles: [Owner](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#owner) built-in role for the subscription you will use and [Application Administrator](https://docs.microsoft.com/en-us/azure/active-directory/users-groups-roles/directory-assign-admin-roles#application-administrator) built-in role for the Azure AD tenant you are using.  You may have trouble creating a service principal if you do not have these role assignments.

1. Open cloud shell by selecting the cloud shell icon in the menu bar.

   ![The cloud shell icon is highlighted on the menu bar.](media/b4-image35.png)

<!-- TODO: Remove steps 2 through 5; refer back to previous instructions or remind them that they should be in the same cloudshell we told them not to close -->
<!-- An idea: would it be better to have a task in order to "Setup Azure Cloud Shell" and then reference that in all the other tasks that might need it and remove all this recurrent steps? | Create as Task 2 and update everything else accordingly -->
<!-- JC: Yes I like that idea, please make it so -->

2. The cloud shell will open in the browser window. Choose "Bash" if prompted or use the left-hand dropdown on the shell menu bar to choose "Bash" (as shown).

   ![This is a screenshot of the cloud shell opened in a browser window. Bash was selected.](media/b4-image36.png)

3. Before completing the steps to create the service principal, you should make sure to set your default subscription correctly. To view your current subscription type:

   ```bash
   az account show
   ```

   ![In this screenshot of a Bash window, az account show has been typed and run at the command prompt. Some subscription information is visible in the window, and some information is obscured.](media/b4-image37.png)

4. To list all of your subscriptions, type:

   ```bash
   az account list
   ```

   ![In this screenshot of a Bash window, az account list has been typed and run at the command prompt. Some subscription information is visible in the window, and some information is obscured.](media/b4-image38.png)

5. To set your default subscription to something other than the current selection, type the following, replacing {id} with the desired subscription id value:

   ```bash
   az account set --subscription {id}
   ```

6. To create a service principal, type the following command, replacing {id} with your subscription identifier, and replacing suffix with your chosen suffix to make the name unique:

   ```bash
   az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/{id}" --name="http://Fabmedical-sp-{SUFFIX}"
   ```

7. The service principal command will produce output like this. Copy this information; you will need it later.

   ![In this screenshot of a Bash window, az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/{id}" --name="Fabmedical-sp-SUFFIX" has been typed and run at the command prompt. Service principal information is visible in the window, but at this time, we are unable to capture all of the information in the window. Future versions of this course should address this.](media/b4-image39.png)

8. To get the service principal object id, type the following command, replacing {appId} with your service principal appId:

   ```bash
   az ad sp show --id {appId} --query "{objectId:@.objectId}"
   ```

9. The service principal information command will produce output like this. Copy this information; you will need it later.

   ![In this screenshot of a Bash window, az ad sp show --id d41261a3-d8b8-4cf0-890d-1fb6efc20a67 --query "{objectId:@.objectId}" has been typed and run at the command prompt. Service Principal information is visible in the window.](media/b4-image58.png)

### Task 4: ARM Template

In this section, you will configure and execute an ARM template that will create all the resources that you will need throughout the exercises.

1. Open cloud shell by selecting the cloud shell icon in the menu bar.

   ![The cloud shell icon is highlighted on the menu bar.](media/b4-image35.png)

<!-- TODO: Remove steps 2 through 5; refer back to previous instructions or remind them that they should be in the same cloudshell we told them not to close -->
<!-- Same comment as above -->

2. The cloud shell will open in the browser window. Choose "Bash" if prompted or use the left-hand dropdown on the shell menu bar to choose "Bash" (as shown).

   ![This is a screenshot of the cloud shell opened in a browser window. Bash was selected.](media/b4-image36.png)

3. Before completing the steps to create the service principal, you should make sure to set your default subscription correctly. To view your current subscription type:

   ```bash
   az account show
   ```

   ![In this screenshot of a Bash window, az account show has been typed and run at the command prompt. Some subscription information is visible in the window, and some information is obscured.](media/b4-image37.png)

4. To list all of your subscriptions, type:

   ```bash
   az account list
   ```

   ![In this screenshot of a Bash window, az account list has been typed and run at the command prompt. Some subscription information is visible in the window, and some information is obscured.](media/b4-image38.png)

5. To set your default subscription to something other than the current selection, type the following, replacing {id} with the desired subscription id value:

   ```bash
   az account set --subscription {id}
   ```

   <!-- TODO: Update to not use bitly.  Include the src files as a directory in the MCW without zipping them. Per Joel, most MCW no longer use Bitly: We've moved to having people download the repo. This way, all the source code is included in GitHub instead of having zip files we have to manage, a la bit.ly. Example: https://github.com/microsoft/MCW-Cosmos-DB-Real-Time-Advanced-Analytics/blob/master/Hands-on%20lab/Before%20the%20HOL%20-%20Cosmos%20DB%20real-time%20advanced%20analytics.md#task-1-download-the-starter-files (edited) -->
   <!-- Clone the repo first and remove references to untar the zip file -->

6. Download the parameters starter file by typing the following curl instruction (case sensitive):

   ```bash
   curl -L -o azuredeploy.parameters.json https://bit.ly/2XHyVaY
   ```

7. Open the azuredeploy.parameters.json file for editing using Azure Cloud Shell editor.

   ```bash
   code azuredeploy.parameters.json
   ```

8. Update the values for the various keys so that they match your environment:

   - **Suffix**: Enter something like "SUF" with max of 3 chars.
   - **VirtualMachineAdminUsernameLinux**: The Linux Build Agent VM admin username (example: `"adminfabmedical"`).
   - **VirtualMachineAdminPublicKeyLinux**: The Linux Build Agent VM admin ssh public key. Use the information from a previous step (example: `"ssh-rsa AAAAB3N(...)vPiybQV admin@fabmedical"`).
   - **KubernetesServicePrincipalClientId**: The Kubernetes Cluster Service Principal Client Id. Use the service principal “appId” from a previous step.
   - **KubernetesServicePrincipalClientSecret**: The Kubernetes Cluster Service Principal Client Secret. Use the service principal “password” from a previous step.
   - **KubernetesServicePrincipalObjectId**: The Kubernetes Cluster Service Principal Object Id. Use the service principal “objectId” from a previous step.
   - **CosmosLocation**: The primary location of the Azure Cosmos DB. Use the same location as the resource group previously created (example: `"eastus"`).
   - **CosmosLocationName**: The name of the primary location of the Azure Cosmos DB. Use the name of the same location as the resource group previously created (example: `"East US"`).
   - **CosmosPairedLocation**: The secondary location of the Azure Cosmos DB. Use a location from the list below (example: `"westus"`).
   - **CosmosPairedLocationName**: The name of the secondary location of the Azure Cosmos DB. Use the location name from the list below that matches the secondary location defined in the previous key (example: `"West US"`).

     > | Location           | Location Name       |
     > | ------------------ | ------------------- |
     > | canadacentral      | Canada Central      |
     > | canadaeast         | Canada East         |
     > | northcentralus     | North Central US    |
     > | centralus          | Central US          |
     > | southcentralus     | South Central US    |
     > | eastus             | East US             |
     > | eastus2            | East US 2           |
     > | westus             | West US             |
     > | westus2            | West US 2           |
     > | westcentralus      | West Central US     |
     > | francecentral      | France Central      |
     > | uksouth            | UK South            |
     > | ukwest             | UK West             |
     > | northeurope        | North Europe        |
     > | westeurope         | West Europe         |
     > | australiaeast      | Australia East      |
     > | australiasoutheast | Australia Southeast |
     > | brazilsouth        | Brazil South        |
     > | centralindia       | Central India       |
     > | southindia         | South India         |
     > | japaneast          | Japan East          |
     > | japanwest          | Japan West          |
     > | koreacentral       | Korea Central       |
     > | southeastasia      | Southeast Asia      |
     > | eastasia           | East Asia           |

9. Click the **...** button and select **Save**.

   ![In this screenshot of an Azure Cloud Shell editor window, the ... button has been clicked and the Save option is highlighted.](media/b4-image62.png)

10. Click the **...** button again and select **Close Editor**.

    ![In this screenshot of the Azure Cloud Shell editor window, the ... button has been clicked and the Close Editor option is highlighted.](media/b4-image63.png)

<!-- TODO: Assuming this is all cloned locally, can we get rid of bitly and just refer to the file saved in cloudshell for the template? -->

1.  Create the needed resources by typing the following instruction (case sensitive), replacing {resourceGroup} with the name of the previously created resource group:

    ```bash
    az group deployment create --resource-group {resourceGroup} --template-uri https://bit.ly/2XCaXh2 --parameters azuredeploy.parameters.json
    ```

### Task 5: Connect securely to the build agent

In this section, you will validate that you can connect to the new build agent VM.

1. From the Azure portal, navigate to the Resource Group you created previously and select the new VM, fabmedical-SUFFIX.

2. In the Overview area for the VM, take note of the public IP address for the VM.

   ![In this screenshot of the Overview area for the VM, Public IP address 52.174.141.11 is highlighted.](media/b4-image26.png)

3. In the cloud shell window, type the following command and copy the output:

   ```bash
   cat .ssh/fabmedical
   ```

   ![In this screenshot of the cloud shell window, cat .ssh/fabmedical has been typed and run at the command prompt, which displays the private key that you generated.](media/b4-image60.png)

4. Update the permission for the fabmedical file.

   ```text
    sudo chmod 600 ~/.ssh/fabmedical
   ```

5. Connect to the new VM you created by typing the following command:

   ```bash
    ssh -i [PRIVATEKEYNAME] [BUILDAGENTUSERNAME]@[BUILDAGENTIP]
   ```

   Replace the bracketed values in the command as follows:

   - [PRIVATEKEYNAME]: Use the private key name ".ssh/fabmedical," created above.

   - [BUILDAGENTUSERNAME]: Use the username for the VM, such as adminfabmedical.

   - [BUILDAGENTIP]: The IP address for the build agent VM, retrieved from the VM Overview blade in the Azure Portal.

   ```bash
   ssh -i .ssh/fabmedical adminfabmedical@52.174.141.11
   ```

6. When asked to confirm if you want to connect, as the authenticity of the connection cannot be validated, type "yes".

7. When asked for the passphrase for the private key you created previously, enter this value.

8. You will connect to the VM with a command prompt such as the following. Keep this command prompt open for the next step:

   `adminfabmedical@fabmedical-SUFFIX:~$`

    ![In this screenshot of a Command Prompt window, ssh -i .ssh/fabmedical adminfabmedical@52.174.141.11 has been typed and run at the command prompt. The information detailed above appears in the window. At this time, we are unable to capture all of the information in the window. Future versions of this course should address this.](media/b4-image27.png)

> **Note**: If you have issues connecting, you may have pasted the SSH public key incorrectly in the ARM template. Unfortunately, if this is the case, you will have to recreate the VM and try again.

### Task 6: Complete the build agent setup

In this task, you will update the packages and install Docker engine.

1. Go to the cloud shell window that has the SSH connection open to the build agent VM.

2. Update the Ubuntu packages and install curl and support for repositories over HTTPS in a single step by typing the following in a single line command. When asked if you would like to proceed, respond by typing "Y" and pressing enter.

   ```bash
   sudo apt-get update && sudo apt install apt-transport-https ca-certificates curl software-properties-common
   ```

3. Add Docker's official GPG key by typing the following in a single line command:

   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```

4. Add Docker's stable repository to Ubuntu packages list by typing the following in a single line command:

   ```bash
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   ```

5. Add NodeJs PPA to use NodeJS LTS release and update the Ubuntu packages and install Docker engine, node.js and the node package manager in a single step by typing the following in a single line command. When asked if you would like to proceed, respond by typing "Y" and pressing enter.

   ```bash
   sudo apt-get install curl python-software-properties
   curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
   sudo apt-get update && sudo apt install docker-ce nodejs mongodb-clients
   ```

6. Now, upgrade the Ubuntu packages to the latest version by typing the following in a single line command. When asked if you would like to proceed, respond by typing "Y" and pressing enter.

   ```bash
   sudo apt-get upgrade
   ```

7. Install `docker-compose`

   ```bash
   sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

8. When the command has completed, check the Docker version installed by executing this command. The output may look something like that shown in the following screen shot. Note that the server version is not shown yet, because you didn't run the command with elevated privileges (to be addressed shortly).

   ```bash
   docker version
   ```

   ![In this screenshot of a Command Prompt window, docker version has been typed and run at the command prompt. Docker version information appears in the window.](media/b4-image28.png)

9. You may check the versions of node.js and npm as well, just for information purposes, using these commands:

   ```bash
   nodejs --version

   npm -version
   ```

<!-- TODO: Remove Bower -->

10. Install `bower`

    ```bash
    npm install -g bower
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    ```

11. Add your user to the Docker group so that you do not have to elevate privileges with sudo for every command. You can ignore any errors you see in the output.

    ```bash
    sudo usermod -aG docker $USER
    ```

    ![In this screenshot of a Command Prompt window, sudo usermod -aG docker $USER has been typed and run at the command prompt. Errors appear in the window.](media/b4-image29.png)

12. In order for the user permission changes to take effect, exit the SSH session by typing 'exit', then press \<Enter\>. Reconnect to the build agent VM as you did previously in Task 5: Connect securely to the build agent using the SSH command.

13. Run the Docker version command again, and note the output now shows the server version as well.

    ![In this screenshot of a Command Prompt window, docker version has been typed and run at the command prompt. Docker version information appears in the window, in addition to server version information.](media/b4-image30.png)

14. Run a few Docker commands:

    - One to see if there are any containers presently running.

      ```bash
      docker container ls
      ```

    - One to see if any containers exist whether running or not.

      ```bash
      docker container ls -a
      ```

15. In both cases, you will have an empty list but no errors running the command. Your build agent is ready with Docker engine running properly.

    ![In this screenshot of a Command Prompt window, docker container ls has been typed and run at the command prompt, as has the docker container ls -a command.](media/b4-image31.png)

### Task 7: Download the FabMedical starter files

FabMedical has provided starter files for you. They have taken a copy of one of
their websites, for their customer Contoso Neuro, and refactored it from a
single node.js site into a website with a content API that serves up the
speakers and sessions. This is a starting point to validate the containerization
of their websites. They have asked you to use this to help them complete a POC
that validates the development workflow for running the website and API as
Docker containers and managing them within the Azure Kubernetes Service
environment.

<!-- TODO: Remove bitly reference, replace with instructions on how to find the downloaded code.   Since code will not be a tarball we can get rid of instructions on how to 
unpack it -->

1. From Azure Cloud Shell, download the starter files by typing the following curl instruction (case sensitive):

   ```bash
   curl -L -o FabMedical.tgz http://bit.ly/2uhZseT
   ```

   > **Important note**: If you'll be taking the Infrastructure edition of the lab, instead of using the above instructions, type the following ones:
   >
   > ```bash
   > curl -L -o FabMedical.tgz https://bit.ly/2uDDZNq
   > ```
   >
   > This will download the version of the starter files that will be used by that edition of the lab.

2. Create a new directory named FabMedical by typing in the following command:

   ```bash
   mkdir FabMedical
   ```

3. Unpack the archive with the following command. This command will extract the files from the archive to the FabMedical directory you created. The directory is case sensitive when you navigate to it.

   ```bash
   tar -C FabMedical -xzf FabMedical.tgz --strip-components=1
   ```

4. Navigate to FabMedical folder and list the contents.

   ```bash
   cd FabMedical
   ll
   ```

5. You'll see the listing includes three folders, one for the web site, another for the content API and one to initialize API data:

   ```bash
   content-api/
   content-init/
   content-web/
   ```

6. Next log into your Azure DevOps account.

   If this is your first time logging into this account you will be taken through a first-run experience:

   - Confirm your contact information and select next.
   - Select "Create new account".
   - Enter a fabmedical-SUFFIX for your account name and select Continue.

7. Create repositories to host the code.

   - Enter fabmedical as the project name.
   - Ensure the project is Private.
   - Click the Advanced dropdown.
   - Ensure the Version control is set to Git.
   - Click the "Create Project" button.

     ![Home page icon](media/b4-image51.png)

   - Once the project creation has completed, use the repository dropdown to create a new repository by selecting "+ New repository".

     ![Repository dropdown](media/b4-image53.png)

   - Enter "content-web" as the repository name.

   - Once the project is created click "Generate Git credentials".

     ![Generate Git Credentials](media/b4-image50.png)

     - Enter a password.
     - Confirm the password.
     - Select "Save Git Credentials".

   - Using your cloud shell window, set your username and email which are used in Azure DevOps for Git Commits.

     ```bash
     git config --global user.email "you@example.com"
     git config --global user.name "Your Name"
     ```

     For example:

     ```bash
     git config --global user.email "you@example.onmicrosoft.com"
     git config --global user.name "you@example.onmicrosoft.com"
     ```

   - Using your cloud shell window, configure git CLI to cache your credentials, so that you don't have to keep re-typing them.

     ```bash
     git config --global credential.helper cache
     ```

   - Using your cloud shell window, initialize a new git repository.

     ```bash
     cd content-web
     git init
     git add .
     git commit -m "Initial Commit"
     ```

   - Setup your Azure DevOps repository as a new remote for push. You can copy the commands for "**HTTPS**" to do this from your browser. Edit the HTTPS URL as given below:

     Remove characters between "https://" and "dev.azure.com" from HTTPS URL of the copied commands.
     For example:

     ```bash
     From this https URL
     "git remote add origin https://fabmedical-sol@dev.azure.com/fabmedical-sol/fabmedical/_git/content-web
      git push -u origin --all"

     Remove "fabmedical-sol@" from the above url to make it like below:
     "git remote add origin https://dev.azure.com/fabmedical-sol/fabmedical/_git/content-web
      git push -u origin --all"
     ```

     Paste these commands into your cloud shell window.

     - When prompted, enter your Azure DevOps username and the git credentials password you created earlier in this task.

   - Use the repository dropdown to create a second repository called "content-api".

   - Using your cloud shell window, initialize a new git repository in the content-api directory.

     ```bash
     cd ../content-api
     git init
     git add .
     git commit -m "Initial Commit"
     ```

   - Setup your Azure DevOps repository as a new remote for push. Use the repository dropdown to switch to the "content-api" repository. You can then copy the commands for the setting up the content-api repository from your browser, then update the HTTPS URL as you did earlier for content-web repository HTTPS url. Paste these commands into your cloud shell window.

     - When prompted, enter your Azure DevOps username and the git credentials password you created earlier in this task.

   - Use the repository drop down to create a third repository called "content-init".

   - Using your cloud shell window, initialize a new git repository in the content-init directory.

     ```bash
     cd ../content-init
     git init
     git add .
     git commit -m "Initial Commit"
     ```

   - Setup your Azure DevOps repository as a new remote for push. Use the repository drop down to switch to the "content-init" repository. You can then copy the commands for the setting up the content-init repository from your browser, then update the HTTPS URL as you did earlier for other repo's HTTPS url. Paste these commands into your cloud shell window.

     - When prompted, enter your Azure DevOps username and the git credentials password you created earlier in this task.

8. Clone your repositories to the build agent.

   - From cloud shell, connect to the build agent VM as you did previously in Task 5: Connect securely to the build agent using the SSH command.

   - In your browser, switch to the "content-web" repository and click "Clone" in the right corner.

     ![This is a screenshot of the content-web repository page with the Clone button indicated.](media/b4-image55.png)

   - Copy the repository url.

   - Update the repository url by removing the characters between "https://" and "dev.azure.com".

     For example: modify the repository url "https://fabmedical-sol@dev.azure.com/fabmedical-sol/fabmedical/_git/content-web"
     as "https://dev.azure.com/fabmedical-sol/fabmedical/_git/content-web"

   - Use the repository url to clone the content-web code to your build agent machine.

     ```bash
     git clone <REPOSITORY_URL>
     ```

   - In your browser, switch to the "content-api" repository and select "Clone" to see and copy the repository url and update the URL by removing some characters as you did earlier for content-web repository.

   - Use the repository url and `git clone` to copy the content-api code to your build agent.

   - In your browser, switch to the "content-init" repository and select "Clone" to see and copy the repository url and then update the url by removing some characters as you did earlier for other repositories.

   - Use the repository url and `git clone` to copy the content-init code to your build agent.

> **Note**: Keep this cloud shell window open as your build agent SSH 
> connection.  The lab will instruct you to open additional cloudshell sessions
> as and when needed. 

You should follow all steps provided _before_ performing the Hands-on lab.

[logo]: https://github.com/Microsoft/MCW-Template-Cloud-Workshop/raw/master/Media/ms-cloud-workshop.png
